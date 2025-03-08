import { Entity, Property } from "@mikro-orm/postgresql";
import { BaseEntity } from "./BaseEntity.js";

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  username!: string;

  @Property()
  passwordHash!: string;

  @Property() // Add this to mark a user as a moderator or not
  moderator: boolean = false;

  constructor(username: string, passwordHash: string, moderator: boolean = false) {
    super();
    this.username = username;
    this.passwordHash = passwordHash;
    this.moderator = moderator;
  }
}
