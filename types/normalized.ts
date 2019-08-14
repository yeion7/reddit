export interface Normalized {
  posts: Posts;
  comments: Comments;
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
