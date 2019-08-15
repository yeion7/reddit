import {
  parsePost,
  parseComment,
  schemaComments,
  schemaPosts
} from "../schemas";

export type Post = ReturnType<typeof parsePost>;
type Comment = ReturnType<typeof parseComment>;

export interface Normalized {
  posts: Posts;
  comments: Comments;
}

export interface NormalizedEntities {
  comments: typeof schemaComments;
  posts: typeof schemaPosts;
}

export interface NormalizedResult {
  posts: { [key: string]: Post };
  comments: { [key: string]: Comment };
}

interface Comments {
  kind: string;
  data: Data2;
}

interface Data2 {
  modhash: string;
  dist?: any;
  children: Child[];
  after?: any;
  before?: any;
}

interface Posts {
  kind: string;
  data: Data;
}

interface Data {
  modhash: string;
  dist: number;
  children: Child[];
  after?: any;
  before?: any;
}

interface Child {
  kind: string;
  data: string;
}
