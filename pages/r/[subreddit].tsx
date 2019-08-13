import React from "react";
import { NextPage } from "next";
import Item from "../../components/item";
import Comment from "../../components/comment";

const Home: NextPage = () => {
  return (
    <div className="app">
      <Item></Item>
      <div style={{ margin: "1em" }}>
        <Comment child={<Comment child={<Comment />} />} />
      </div>
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

export default Home;
