import React from "react";
import Home from "../pages/r/[subreddit]";
import { render } from "@testing-library/react";

describe("index", () => {
  test("should render element", () => {
    const { queryByText } = render(<Home />);

    expect(queryByText("Reddit clone!")).toBeTruthy();
  });
});
