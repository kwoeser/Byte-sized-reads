import { Entity, Enum, Property } from "@mikro-orm/postgresql";
import { BaseEntity } from "./BaseEntity.js";

export enum ModerationStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity()
export class Submission extends BaseEntity {
  @Property({ unique: true })
  url!: string;

  @Enum({ items: () => ModerationStatus, nullable: true })
  moderationStatus?: ModerationStatus;

  @Property()
  scraped!: boolean;

  constructor(url: string) {
    super();
    this.url = url;
    this.scraped = false;
  }
}
