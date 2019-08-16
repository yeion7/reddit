import React from "react";
import { render, within, fireEvent } from "@testing-library/react";
import SubReddit from "../pages/r/[subreddit]";
import postsResponse from "../api/__fixtures__/subreddit.json";

jest.mock("../api");

describe("subreddit", () => {
  beforeEach(jest.clearAllMocks);

  test("should render posts with info", async () => {
    const post = postsResponse.data.children[0].data;
    const props = await SubReddit.getInitialProps({
      query: { subreddit: "all" }
    } as any);

    const { queryAllByTestId, queryByText, queryByLabelText } = render(
      <SubReddit {...props} />
    );
    // render items on current space
    expect(queryAllByTestId(/post-/g)).toHaveLength(2);

    // render info
    expect(queryByText(post.title)).toBeTruthy();
    expect(queryByText(`r/${post.subreddit}`)).toBeTruthy();
    expect(queryByText(`Publicado por u/${post.author}`)).toBeTruthy();
    expect(queryByLabelText(`Votos positivos ${post.ups}`)).toBeTruthy();
  });

  test("should up vote", async () => {
    const post = postsResponse.data.children[0].data;
    const props = await SubReddit.getInitialProps({
      query: { subreddit: "all" }
    } as any);

    const getVotesLabel = ups => `Votos positivos ${ups}`;
    const { getByTestId, queryByLabelText } = render(<SubReddit {...props} />);

    expect(queryByLabelText(getVotesLabel(post.ups)).textContent).toBe(
      String(post.ups)
    );

    fireEvent.click(
      within(getByTestId(`post-${post.id}`)).queryByLabelText("upvote")
    );

    // up vote
    expect(queryByLabelText(getVotesLabel(post.ups + 1)).textContent).toBe(
      String(post.ups + 1)
    );

    // up vote again
    fireEvent.click(
      within(getByTestId(`post-${post.id}`)).queryByLabelText("upvote")
    );

    expect(queryByLabelText(getVotesLabel(post.ups)).textContent).toBe(
      String(post.ups)
    );
  });

  test("should down vote", async () => {
    const post = postsResponse.data.children[0].data;
    const props = await SubReddit.getInitialProps({
      query: { subreddit: "all" }
    } as any);

    const getVotesLabel = ups => `Votos positivos ${ups}`;
    const { getByTestId, queryByLabelText } = render(<SubReddit {...props} />);

    expect(queryByLabelText(getVotesLabel(post.ups)).textContent).toBe(
      String(post.ups)
    );

    fireEvent.click(
      within(getByTestId(`post-${post.id}`)).queryByLabelText("downvote")
    );

    // down vote
    expect(queryByLabelText(getVotesLabel(post.ups - 1)).textContent).toBe(
      String(post.ups - 1)
    );

    // down vote again
    fireEvent.click(
      within(getByTestId(`post-${post.id}`)).queryByLabelText("downvote")
    );

    expect(queryByLabelText(getVotesLabel(post.ups)).textContent).toBe(
      String(post.ups)
    );
  });

  test("should click down and up vote", async () => {
    const post = postsResponse.data.children[0].data;
    const props = await SubReddit.getInitialProps({
      query: { subreddit: "all" }
    } as any);

    const getVotesLabel = ups => `Votos positivos ${ups}`;
    const { getByTestId, queryByLabelText } = render(<SubReddit {...props} />);

    expect(queryByLabelText(getVotesLabel(post.ups)).textContent).toBe(
      String(post.ups)
    );

    fireEvent.click(
      within(getByTestId(`post-${post.id}`)).queryByLabelText("upvote")
    );

    // up vote
    expect(queryByLabelText(getVotesLabel(post.ups + 1)).textContent).toBe(
      String(post.ups + 1)
    );

    // downvote
    fireEvent.click(
      within(getByTestId(`post-${post.id}`)).queryByLabelText("downvote")
    );

    expect(queryByLabelText(getVotesLabel(post.ups - 1)).textContent).toBe(
      String(post.ups - 1)
    );
  });
});
