import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { normalize } from "normalizr";

import PostList from "../../../components/PostList";

import { schemaPosts } from "../../../schemas";
import { fetchPosts } from "../../../api";

import { PostsResponse } from "../../../types/reddit";
import { Post, voteOptions } from "../../../types/normalized";

const normalizeResponse = (data: PostsResponse): { [key: string]: Post } =>
  normalize<Post>(data, schemaPosts).entities.posts;

interface Props {
  data: ReturnType<typeof normalizeResponse>;
  subreddit: string | string[];
  after: string;
}

interface State {
  posts: ReturnType<typeof normalizeResponse>;
  after: string;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
}

type Action =
  | { type: "loadingPosts" }
  | { type: "endPosts" }
  | {
      type: "loadPosts";
      payload: { posts: ReturnType<typeof normalizeResponse>; after: string };
    }
  | { type: "vote"; payload: { id: string; vote: voteOptions } }
  | {
      type: "loadMorePosts";
      payload: {
        posts: ReturnType<typeof normalizeResponse>;
        after: string;
      };
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loadingPosts":
      return { ...state, isNextPageLoading: true };
    case "loadMorePosts":
      return {
        ...state,
        posts: { ...state.posts, ...action.payload.posts },
        isNextPageLoading: false,
        after: action.payload.after
      };
    case "loadPosts":
      return {
        posts: action.payload.posts,
        isNextPageLoading: false,
        hasNextPage: true,
        after: action.payload.after
      };
    case "endPosts":
      return {
        ...state,
        hasNextPage: false
      };
    case "vote": {
      const { id, vote } = action.payload;
      const post = state.posts[id];
      const undoVote = vote === post.vote;
      const count = vote === "downvote" ? -1 : 1;
      const newUps = post.ups + (undoVote ? -count : count);

      return {
        ...state,
        posts: {
          ...state.posts,
          [id]: {
            ...post,
            vote: undoVote ? null : vote,
            ups: newUps
          }
        }
      };
    }
    default:
      throw new Error("Not supported actions");
  }
}

const SubReddit: NextPage<Props> = ({ data, subreddit, after }) => {
  const firstUpdate = React.useRef(true);
  const [state, dispach] = React.useReducer(reducer, {
    posts: data,
    after,
    hasNextPage: true,
    isNextPageLoading: false
  });

  /**
   * load new subreddit when url change
   */
  const loadSubReddit = React.useCallback(async () => {
    const posts: PostsResponse = await fetchPosts({
      subreddit
    });

    dispach({
      type: "loadPosts",
      payload: { posts: normalizeResponse(posts), after: posts.data.after }
    });
  }, [subreddit]);

  /**
   * load more posts when scroll
   */
  const _loadNextPage = React.useCallback(async () => {
    dispach({ type: "loadingPosts" });

    const posts: PostsResponse = await fetchPosts({
      subreddit,
      after: state.after
    });
    const hasChildren = posts.data.children.length > 0;

    if (hasChildren) {
      dispach({
        type: "loadMorePosts",
        payload: { posts: normalizeResponse(posts), after: posts.data.after }
      });
    } else {
      dispach({ type: "endPosts" });
    }
  }, [state.after, subreddit]);

  React.useEffect(() => {
    if (!firstUpdate.current) {
      loadSubReddit();
    }
    firstUpdate.current = false;
  }, [loadSubReddit, subreddit]);

  const setVote = React.useCallback((id: string, vote: voteOptions) => {
    dispach({ type: "vote", payload: { id, vote } });
  }, []);

  return (
    <div className="app">
      <Head>
        <link rel="icon" type="image/png" href="/static/favicon.png" />
        <title>{`r/${subreddit}`}</title>
      </Head>
      <PostList
        hasNextPage={state.hasNextPage}
        isNextPageLoading={state.isNextPageLoading}
        items={Object.values(state.posts)}
        loadNextPage={_loadNextPage}
        setVote={setVote}
      />
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

SubReddit.getInitialProps = async ({ query }) => {
  const { subreddit, after = "" } = query;

  const posts = await fetchPosts({ subreddit, after });
  return {
    data: normalizeResponse(posts),
    subreddit,
    after: posts.data.after
  };
};

export default SubReddit;
