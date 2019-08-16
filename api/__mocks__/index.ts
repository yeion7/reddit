import subredditResponse from "../__fixtures__/subreddit.json";
import postResponse from "../__fixtures__/post.json";

export const fetchPosts = jest.fn(async () => {
  return subredditResponse;
});

export const fetchPost = jest.fn(async () => {
  return postResponse;
});
