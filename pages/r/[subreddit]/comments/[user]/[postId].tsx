import React from "react";
import { NextPage } from "next";
import { normalize } from "normalizr";
import Head from "next/head";

import Post from "../../../../../components/post";
import Comment from "../../../../../components/comment";
import { PostsResponse, CommentsResponse } from "../../../../../types/reddit";

import { schemaPosts, schemaComments } from "../../../../../schemas";
import { fetchPost } from "../../../../../api";
import {
  Normalized,
  NormalizedEntities,
  NormalizedResult
} from "../../../../../types/normalized";

const normalizeResponse = (data: {
  comments: CommentsResponse;
  posts: PostsResponse;
}) => {
  return normalize<NormalizedEntities, NormalizedResult, Normalized>(data, {
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
      <Head>
        <link rel="icon" type="image/png" href="/static/favicon.png" />
      </Head>
      <div style={{ background: "#fff" }}>
        {/* <Post {...post} opened /> */}
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

PostPage.getInitialProps = async ({ query }) => {
  const { subreddit, user, postId } = query;
  const [posts, comments] = await fetchPost(
    `/r/${subreddit}/comments/${user}/${postId}.json`
  );

  return {
    data: normalizeResponse({ posts, comments }),
    rawData: [posts, comments]
  };
};

export default PostPage;
