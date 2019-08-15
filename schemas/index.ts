import { schema } from "normalizr";
import { RawEntry, RawComment } from "../types/reddit";
import { voteOptions } from "../types/normalized";

export const parseComment = (rawComment: RawComment) => {
  return {
    id: rawComment.id,
    author: rawComment.author,
    body: rawComment.body,
    name: rawComment.name,
    created: rawComment.created_utc,
    depth: rawComment.depth,
    ups: rawComment.ups,
    replies: rawComment.replies,
    children: rawComment.children
  };
};

const comment = new schema.Entity(
  "comments",
  {},
  {
    processStrategy: parseComment
  }
);

/**
 * define a nested structure
 */
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

export const parsePost = (rawPost: RawEntry) => {
  return {
    id: rawPost.id,
    name: rawPost.name,
    ups: rawPost.ups,
    title: rawPost.title,
    subreddit: rawPost.subreddit,
    author: rawPost.author,
    created: rawPost.created_utc,
    comments: rawPost.num_comments,
    postHint: rawPost.post_hint,
    permalink: rawPost.permalink,
    url: rawPost.url,
    previews: rawPost.preview,
    thumbnail: rawPost.thumbnail,
    media: rawPost.media,
    selftext: rawPost.selftext,
    vote: null as voteOptions
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
