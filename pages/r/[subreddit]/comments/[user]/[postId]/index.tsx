import React from "react";
import { NextPage } from "next";
import { normalize } from "normalizr";
import Head from "next/head";

import PostContent from "../../../../../../components/post";
import Comment from "../../../../../../components/comment";
import {
  PostsResponse,
  CommentsResponse
} from "../../../../../../types/reddit";

import { schemaPosts, schemaComments } from "../../../../../../schemas";
import { fetchPost } from "../../../../../../api";
import {
  Normalized,
  NormalizedEntities,
  NormalizedResult,
  voteOptions
} from "../../../../../../types/normalized";
import getUnixTime from "date-fns/getUnixTime";
import { calculateNewVotes } from "../../../../../../utils";

const normalizeResponse = (data: {
  comments: CommentsResponse;
  posts: PostsResponse;
}) => {
  const normalized = normalize<
    NormalizedEntities,
    NormalizedResult,
    Normalized
  >(data, {
    comments: schemaComments,
    posts: schemaPosts
  });

  return {
    posts: normalized.entities.posts,
    comments: normalized.entities.comments,
    rootComments: normalized.result.comments
  };
};

type State = ReturnType<typeof normalizeResponse>;
type Action =
  | {
      type: "vote";
      payload: { id: string; vote: voteOptions; entity: "comments" | "posts" };
    }
  | { type: "addComment"; payload: { belongTo: string; comment: string } };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "vote": {
      const { id, vote, entity } = action.payload;
      const currentEntity = state[entity][id];

      return {
        ...state,
        [entity]: {
          ...state[entity],
          [id]: {
            ...currentEntity,
            vote: vote === currentEntity.vote ? null : vote,
            ups: calculateNewVotes({
              lastVote: currentEntity.vote,
              currentVote: vote,
              ups: currentEntity.ups
            })
          }
        }
      };
    }
    case "addComment": {
      const { belongTo, comment } = action.payload;
      const parent = state.comments[belongTo];
      const newCommentId = Date.now().toString();

      return {
        ...state,
        comments: {
          ...state.comments,
          [parent.id]: {
            ...parent,
            replies: [...parent.replies, newCommentId]
          },
          [newCommentId]: {
            id: newCommentId,
            author: "usuario",
            body: comment,
            name: `t1_${newCommentId}`,
            created: getUnixTime(new Date()),
            depth: parent.depth + 1,
            ups: 0,
            vote: null,
            replies: [],
            more: undefined
          }
        }
      };
    }
    default:
      throw new Error("Action not supported");
  }
};

interface Props {
  data: ReturnType<typeof normalizeResponse>;
}
const PostPage: NextPage<Props> = ({ data }) => {
  const [state, dispatch] = React.useReducer(reducer, data);

  /**
   * vote a post
   */
  const setVotePost = React.useCallback((id: string, vote: voteOptions) => {
    dispatch({ type: "vote", payload: { id, vote, entity: "posts" } });
  }, []);

  /**
   * vote a comment
   */
  const setVoteComment = React.useCallback((id: string, vote: voteOptions) => {
    dispatch({ type: "vote", payload: { id, vote, entity: "comments" } });
  }, []);

  /**
   * vote a comment
   */
  const setComment = React.useCallback((belongTo: string, comment: string) => {
    dispatch({ type: "addComment", payload: { belongTo, comment } });
  }, []);

  return (
    <div className="app">
      <Head>
        <link rel="icon" type="image/png" href="/static/favicon.png" />
        <title>
          {Object.values(state.posts)
            .map(post => post.title)
            .join()}
        </title>
      </Head>
      <div style={{ background: "#fff" }}>
        {Object.values(state.posts).map(post => (
          <PostContent key={post.id} {...post} opened setVote={setVotePost} />
        ))}
        {state.rootComments.data.children.map(({ data: commentId }) => (
          <Comment
            key={commentId}
            comments={state.comments}
            setVote={setVoteComment}
            setComment={setComment}
            {...state.comments[commentId]}
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
