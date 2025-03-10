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

  @Property({ length: 8192 })
  excerpt!: string;

  @Property()
  wordCount!: number;

  @Property({ default: "" })
  category!: string;

  constructor(
    url: string,
    siteName: string,
    title: string,
    excerpt: string,
    wordCount: number,
    category: string
  ) {
    super();
    this.url = url;
    this.siteName = siteName;
    this.title = title;
    this.excerpt = excerpt;
    this.wordCount = wordCount;
    this.category = category;
  }
}
