import React from "react";
import { NextPage } from "next";
import Item from "../components/item";

const Home: NextPage = () => {
  return (
    <div style={{ padding: "1em" }}>
      <Item></Item>
      <Item></Item>
      <Item></Item>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          background: #dae0e6;
          font-size: 16px;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
