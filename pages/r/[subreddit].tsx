import React, { PureComponent } from "react";
import { NextPage } from "next";
import "isomorphic-unfetch";
import { normalize } from "normalizr";

import ListLoader from "../../components/InfinityLoader";
import Post from "../../components/post";
import { RedditResponse } from "../../types/reddit";

import { schemaPosts, parsePost } from "../../schemas";

type Post = ReturnType<typeof parsePost>;
const normalizeResponse = data =>
  Object.values(normalize<Post>(data, schemaPosts).entities.posts);

const SubReddit: NextPage<{ data: Post[] }> = ({ data }) => {
  const [isNextPageLoading, setIsNextPageLoading] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [items, setItems] = React.useState(data);

  const _loadNextPage = async () => {
    setIsNextPageLoading(true);
    const after = items[items.length - 1].name;

    const res = await fetch(
      `https://www.reddit.com/r/all.json?after=${after}&dist=25`
    );
    const json: RedditResponse = await res.json();
    const newItems = [...items, ...normalizeResponse(json)];

    setItems(newItems);

    setHasNextPage(true);
    setIsNextPageLoading(false);
  };

  return (
    <div className="app">
      <ListLoader
        hasNextPage={hasNextPage}
        isNextPageLoading={isNextPageLoading}
        items={items}
        loadNextPage={_loadNextPage}
      ></ListLoader>
      <style jsx>
        {`
          .app {
            padding: 0.5em;
          }
          @media (min-width: 425px) {
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
  const res = await fetch(`https://www.reddit.com/r/${query.subreddit}.json`);
  const json = await res.json();

  return { data: normalizeResponse(json) };
};

export default SubReddit;
