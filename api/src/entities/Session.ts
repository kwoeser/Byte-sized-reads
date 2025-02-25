import {
  Entity,
  ManyToOne,
  Property,
  ref,
  type Ref,
} from "@mikro-orm/postgresql";
import { BaseEntity } from "./BaseEntity.js";
import type { User } from "./User.js";

@Entity()
export class Session extends BaseEntity {
  @ManyToOne("User", { ref: true })
  user!: Ref<User>;

  @Property({ index: true })
  tokenHash!: string;

  @Property()
  expiresAt!: Date;

  constructor(user: User, tokenHash: string, expiresAt: Date) {
    super();
    this.user = ref(user);
    this.tokenHash = tokenHash;
    this.expiresAt = expiresAt;
  }
}
