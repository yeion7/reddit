import { schema } from "normalizr";
import { RawEntry } from "../types/reddit";

const comment = new schema.Entity(
  "comments",
  {},
  {
    processStrategy(value) {
      return value;
    }
  }
);

comment.define({
  replies: {
    data: {
      children: [
        {
          data: comment
        }
      ]
    }
  }
});

export const schemaComments = {
  data: {
    children: [
      {
        data: comment
      }
    ]
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const parsePost = (rawPost: RawEntry) => {
  return {
    id: rawPost.id,
    ups: rawPost.ups,
    title: rawPost.title,
    subreddit: rawPost.subreddit,
    author: rawPost.author,
    created: rawPost.created_utc,
    comments: rawPost.num_comments,
    postHint: rawPost.post_hint
  };
};

const post = new schema.Entity(
  "posts",
  {},
  {
    processStrategy: parsePost
  }
);

export const schemaPosts = {
  data: {
    children: [
      {
        data: post
      }
    ]
  }
};
