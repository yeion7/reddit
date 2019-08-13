import React from "react";
import Router from "next/router";
import { NextPageContext } from "next";

class Index extends React.Component {
  public static async getInitialProps({ res }: NextPageContext) {
    if (res) {
      res.writeHead(302, {
        Location: "/r/all"
      });
      res.end();
    } else {
      Router.push("/r/all");
    }
    return {};
  }
}

export default Index;
