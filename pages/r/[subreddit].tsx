import React from "react";
import "isomorphic-unfetch";
import { NextPage } from "next";
import Post from "../../components/post";
import { RedditResponse } from "../../types/reddit";
import { schemaPosts, parsePost } from "../../schemas";
import { normalize } from "normalizr";

const SubReddit: NextPage<{ data: RedditResponse }> = ({ data }) => {
  const { entities } = normalize<ReturnType<typeof parsePost>>(
    data,
    schemaPosts
  );

  return (
    <div className="app">
      {Object.values(entities.posts).map(post => (
        <Post key={post.id} {...post} />
      ))}
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
  const config: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };

  const res = await fetch(
    `https://www.reddit.com/r/${query.subreddit}.json`,
    config
  );
  const json = await res.json();

  return { data: json };
};

export default SubReddit;
