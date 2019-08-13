import React from "react";
import Router from "next/router";

class Index extends React.Component {
  static async getInitialProps({ res }) {
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
