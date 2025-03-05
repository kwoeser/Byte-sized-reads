import { Entity, Property } from "@mikro-orm/postgresql";
import { BaseEntity } from "./BaseEntity.js";

@Entity()
export class Article extends BaseEntity {
  @Property({ unique: true })
  url!: string;

  @Property()
  siteName!: string;

  @Property()
  title!: string;

  @Property()
  excerpt!: string;

  @Property()
  wordCount!: number;

  constructor(
    url: string,
    siteName: string,
    title: string,
    excerpt: string,
    wordCount: number
  ) {
    super();
    this.url = url;
    this.siteName = siteName;
    this.title = title;
    this.excerpt = excerpt;
    this.wordCount = wordCount;
  }
}
