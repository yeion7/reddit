import React from "react";
import { NextPage } from "next";
import { normalize } from "normalizr";

import PostList from "../../components/PostList";
import Post from "../../components/post";
import { RedditResponse } from "../../types/reddit";

import { schemaPosts, parsePost } from "../../schemas";
import { fetchPosts } from "../../api";

type Post = ReturnType<typeof parsePost>;

const normalizeResponse = (data: RedditResponse): Post[] =>
  Object.values(normalize<Post>(data, schemaPosts).entities.posts);

const SubReddit: NextPage<{ data: Post[]; subreddit: string | string[] }> = ({
  data,
  subreddit
}) => {
  const [isNextPageLoading, setIsNextPageLoading] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [items, setItems] = React.useState(data);

  /**
   * use for load new posts when user scroll down
   */
  const _loadNextPage = async () => {
    setIsNextPageLoading(true);
    const after = items[items.length - 1].name;

    const posts: RedditResponse = await fetchPosts({ subreddit, after });
    const hasChildren = posts.data.children.length > 0;
    let newItems = items;

    if (hasChildren) {
      newItems = [...items, ...normalizeResponse(posts)];
    }

    setItems(newItems);

    setHasNextPage(hasChildren);
    setIsNextPageLoading(false);
  };

  return (
    <div className="app">
      <PostList
        hasNextPage={hasNextPage}
        isNextPageLoading={isNextPageLoading}
        items={items}
        loadNextPage={_loadNextPage}
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
  return { data: normalizeResponse(posts), subreddit };
};

export default SubReddit;
