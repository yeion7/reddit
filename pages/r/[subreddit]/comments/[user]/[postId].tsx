import React from "react";
import { NextPage } from "next";
import { normalize } from "normalizr";

import Post from "../../../../../components/post";
import Comment from "../../../../../components/comment";
import { PostsResponse, CommentsResponse } from "../../../../../types/reddit";

import {
  schemaPosts,
  parsePost,
  schemaComments,
  parseComment
} from "../../../../../schemas";
import { fetchPost } from "../../../../../api";
import { Normalized } from "../../../../../types/normalized";

type Post = ReturnType<typeof parsePost>;
type Comment = ReturnType<typeof parseComment>;

const normalizeResponse = (data: {
  comments: CommentsResponse;
  posts: PostsResponse;
}) => {
  return normalize<
    {
      comments: typeof schemaComments;
      posts: typeof schemaPosts;
    },
    {
      posts: { [key: string]: Post };
      comments: { [key: string]: Comment };
    },
    Normalized
  >(data, {
    comments: schemaComments,
    posts: schemaPosts
  });
};

interface Props {
  data: ReturnType<typeof normalizeResponse>;
}
const PostPage: NextPage<Props> = ({ data }) => {
  const post = Object.values(data.entities.posts)[0];
  const comments = data.entities.comments;

  return (
    <div className="app">
      <div style={{ background: "#fff" }}>
        <Post {...post} opened />
        {data.result.comments.data.children.map(({ data: commentId }) => (
          <Comment
            key={commentId}
            comments={comments}
            {...comments[commentId]}
          />
        ))}
      </div>
      <style jsx>
        {`
          .app {
            padding: 0.2em;
          }
          @media (min-width: 426px) {
            .app {
              padding: 1em;
              max-width: 1280px;
              margin: 0 auto;
            }
          }
        `}
      </style>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          background: #dae0e6;
          font-size: 14px;
          margin: 0;
        }
        @media (min-width: 425px) {
          body {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

PostPage.getInitialProps = async ({ req }) => {
  const [posts, comments] = await fetchPost(req.url);

  return {
    data: normalizeResponse({ posts, comments }),
    rawData: [posts, comments]
  };
};

export default PostPage;
