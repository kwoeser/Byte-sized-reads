import { Entity, Property } from "@mikro-orm/postgresql";
import { BaseEntity } from "./BaseEntity.js";

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  username!: string;

  @Property()
  passwordHash!: string;

  constructor(username: string, passwordHash: string) {
    super();
    this.username = username;
    this.passwordHash = passwordHash;
  }
}
