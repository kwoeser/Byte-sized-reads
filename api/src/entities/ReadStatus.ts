import {
  Entity,
  ManyToOne,
  ref,
  Unique,
  type Ref,
} from "@mikro-orm/postgresql";
import type { Article } from "./Article.js";
import { BaseEntity } from "./BaseEntity.js";
import type { User } from "./User.js";

@Entity()
@Unique({ properties: ["user", "article"] })
export class ReadStatus extends BaseEntity {
  @ManyToOne("User", { ref: true })
  user!: Ref<User>;

  @ManyToOne("Article", { ref: true })
  article!: Ref<Article>;

  constructor(user: User, article: Article) {
    super();
    this.user = ref(user);
    this.article = ref(article);
  }
}
