import type { EntityManager, Loaded } from "@mikro-orm/postgresql";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import * as argon2 from "argon2";
import express from "express";
import { Session } from "./entities/Session.js";
import { User } from "./entities/User.js";

export const SESSION_LIFETIME = 1000 * 60 * 60 * 24 * 30; // 30 days
export const SESSION_COOKIE_NAME = "session";

/**
 * Creates a session in the database for the given user.
 *
 * Returns the raw session token and the session object.
 */
const createSession = (em: EntityManager, user: User) => {
  // generate 20 secure random bytes for the token
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  // encode as base32
  const token = encodeBase32LowerCaseNoPadding(bytes);

  // hash the token with sha256 for storage
  const hash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // create a session in the database
  const session = new Session(
    user,
    hash,
    new Date(Date.now() + SESSION_LIFETIME)
  );
  em.persist(session);

  return { token, session };
};

/**
 * Registers a user in the database and creates a session.
 *
 * First checks if the username is in use. If not, it hashes the password and
 * creates a user in the database. Then it creates a session and sets the
 * session cookie on the response, and returns the user.
 */
export const register = async (
  em: EntityManager,
  username: string,
  password: string,
  res: express.Response
): Promise<{ ok: User } | { error: string }> => {
  // Sees if the username is empty 
  // *Test was failing for auth.test.ts when username was empty using vitest outputting a 200 instead of 400*
  if (!username) {
    return { error: "Username cannot be empty" };
  }

  // check if the username is in use
  const existing = await em.findOne(User, {
    username,
  });
  if (existing) {
    return { error: "Username in use" };
  }

  // check password length
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  // hash the password using argon2id
  const passwordHash = await argon2.hash(password);

  // create a user in the database
  const user = new User(username, passwordHash);
  em.persist(user);

  // create a session
  const { token, session } = createSession(em, user);

  // set the session cookie for the response
  setCookie(res, token, session);

  // flush database changes
  await em.flush();

  return { ok: user };
};

/**
 * Logs in a user, creating a new session.
 *
 * Retrieves the user from the database by username. If the user exists, it
 * verifies the password against the stored password hash. If the password was
 * valid, it creates a session and sets the session cookie on the response, and
 * returns the uesr.
 */
export const login = async (
  em: EntityManager,
  username: string,
  password: string,
  res: express.Response
): Promise<{ ok: User } | { error: string }> => {
  // retrieve the user
  const user = await em.findOne(User, {
    username,
  });
  if (!user) {
    return { error: "Login failed" };
  }

  // verify the password using argon2id
  const passwordValid = await argon2.verify(user.passwordHash, password);
  if (!passwordValid) {
    return { error: "Login failed" };
  }

  // create a session
  const { token, session } = createSession(em, user);

  // set the session cookie for the response
  setCookie(res, token, session);

  // flush database changes
  await em.flush();

  return { ok: user };
};

/**
 * Logs out a session.
 *
 * Deletes the session from the database and clears the session cookie.
 */
export const logout = async (
  em: EntityManager,
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // retrieve the token from the session cookie
  const token = req.cookies?.[SESSION_COOKIE_NAME]?.trim();
  if (!token) {
    // not logged in, do nothing
    return;
  }

  // hash the token with sha256
  const hash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // delete matching sessions
  await em.nativeDelete(Session, { tokenHash: hash });

  // clear the session cookie
  res.clearCookie(SESSION_COOKIE_NAME);
};

/**
 * Validates a session in the database.
 *
 * If the session cookie is valid, returns the session with the user relation
 * populated. Otherwise, returns null.
 *
 * A valid session is one that exists in the database and is not expired.
 * If the checked session is past halfway to expiry, the session duration is
 * refreshed and the session cookie is updated.
 */
export const validateSession = async (
  em: EntityManager,
  req: express.Request,
  res: express.Response
): Promise<Loaded<Session, "user", "*", never> | null> => {
  // retrieve the token from the session cookie
  const token = req.cookies?.[SESSION_COOKIE_NAME]?.trim();
  if (!token) return null;

  // hash the token with sha256
  const hash = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // try to find a matching session
  const session = await em.findOne(
    Session,
    { tokenHash: hash },
    { populate: ["user"] }
  );
  if (session === null) {
    return null;
  }

  // check if expired
  if (Date.now() > session.expiresAt.getTime()) {
    // delete session from database
    em.remove(session);
    await em.flush();

    // clear the session cookie
    res.clearCookie(SESSION_COOKIE_NAME);

    return null;
  }

  // if halfway to expiry, refresh
  if (Date.now() > session.expiresAt.getTime() - SESSION_LIFETIME / 2) {
    // update the expiry date
    session.expiresAt = new Date(Date.now() + SESSION_LIFETIME);
    await em.flush();

    // re-set the session cookie with the new expiry
    setCookie(res, token, session);
  }

  return session;
};

/**
 * Sets the session cookie for a response.
 */
const setCookie = (res: express.Response, token: string, session: Session) => {
  res.cookie(SESSION_COOKIE_NAME, token, {
    // domain: new URL(env.PUBLIC_URL).hostname, // TODO
    path: "/",
    // secure: true,
    secure: false, // just for testing change back to true
    httpOnly: true,
    sameSite: "lax",
    expires: session.expiresAt,
  });
};
