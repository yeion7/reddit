import React from "react";
import PostPage from "../pages/r/[subreddit]/comments/[user]/[postId]";
import { render, within, fireEvent } from "@testing-library/react";

jest.mock("../api");

describe("post/comments", () => {
  test("should render post and comments", async () => {
    const props = await PostPage.getInitialProps({
      query: {
        subreddit: "EarthPorn",
        user: "cr5ac1",
        postId: "there_is_nothing_like_a_peaceful_night_on_a_lake"
      }
    } as any);

    const { queryByText } = render(<PostPage {...props} />);

    // post title
    expect(
      queryByText(
        /There is nothing like a peaceful night on a lake in the Adirondacks/
      )
    ).toBeTruthy();

    // comment
    expect(
      queryByText(
        /to start out by stating that there is no way the human eye can see the/
      )
    ).toBeTruthy();

    // nested comment
    expect(
      queryByText(
        / spent time growing up at both Long Lake and Blue Mountain Lake./
      )
    ).toBeTruthy();
  });

  test("should vote a comment", async () => {
    const props = await PostPage.getInitialProps({
      query: {
        subreddit: "EarthPorn",
        user: "cr5ac1",
        postId: "there_is_nothing_like_a_peaceful_night_on_a_lake"
      }
    } as any);

    const { getByTestId } = render(<PostPage {...props} />);

    expect(
      within(getByTestId("comment-ex1y5d0")).queryByText("6 points")
    ).toBeTruthy();

    fireEvent.click(
      within(getByTestId("comment-ex1y5d0")).getByLabelText("upvote")
    );

    expect(
      within(getByTestId("comment-ex1y5d0")).queryByText("7 points")
    ).toBeTruthy();

    fireEvent.click(
      within(getByTestId("comment-ex1y5d0")).getByLabelText("downvote")
    );

    expect(
      within(getByTestId("comment-ex1y5d0")).queryByText("5 points")
    ).toBeTruthy();

    fireEvent.click(
      within(getByTestId("comment-ex1y5d0")).getByLabelText("downvote")
    );

    expect(
      within(getByTestId("comment-ex1y5d0")).queryByText("6 points")
    ).toBeTruthy();
  });

  test("should add a reply", async () => {
    const props = await PostPage.getInitialProps({
      query: {
        subreddit: "EarthPorn",
        user: "cr5ac1",
        postId: "there_is_nothing_like_a_peaceful_night_on_a_lake"
      }
    } as any);

    const { getByTestId, getByText } = render(<PostPage {...props} />);

    fireEvent.click(
      within(getByTestId("comment-ex1y5d0")).getByText("Comentar")
    );

    fireEvent.change(
      within(getByTestId("comment-ex1y5d0")).getByPlaceholderText(
        "añade una respuesta"
      ),
      {
        target: {
          value: "hola"
        }
      }
    );

    fireEvent.click(
      within(getByTestId("comment-ex1y5d0")).getByText("Guardar")
    );

    expect(getByText("hola")).toBeTruthy();
  });

  test("should cancel a reply", async () => {
    const props = await PostPage.getInitialProps({
      query: {
        subreddit: "EarthPorn",
        user: "cr5ac1",
        postId: "there_is_nothing_like_a_peaceful_night_on_a_lake"
      }
    } as any);

    const { getByTestId } = render(<PostPage {...props} />);

    fireEvent.click(
      within(getByTestId("comment-ex1y5d0")).getByText("Comentar")
    );

    fireEvent.click(
      within(getByTestId("comment-ex1y5d0")).getByText("Cancelar")
    );

    expect(
      within(getByTestId("comment-ex1y5d0")).queryByPlaceholderText(
        "añade una respuesta"
      )
    ).toBeFalsy();
  });

  test("should add a nested reply", async () => {
    const props = await PostPage.getInitialProps({
      query: {
        subreddit: "EarthPorn",
        user: "cr5ac1",
        postId: "there_is_nothing_like_a_peaceful_night_on_a_lake"
      }
    } as any);

    const { getByTestId, getByText } = render(<PostPage {...props} />);

    fireEvent.click(getByTestId("addcomment-ex2fu1f"));

    fireEvent.change(getByTestId("inputcomment-ex2fu1f"), {
      target: {
        value: "hola"
      }
    });

    fireEvent.click(getByTestId("savecomment-ex2fu1f"));

    expect(getByText("hola")).toBeTruthy();
  });
});
