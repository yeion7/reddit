import "isomorphic-unfetch";
import { PostsResponse, CommentsResponse } from "../types/reddit";

interface Params {
  subreddit: string | string[];
  after?: string | string[];
}
/**
 * get subreddit posts
 * @param queries
 */
export const fetchPosts = async ({
  subreddit,
  after = ""
}: Params): Promise<PostsResponse> => {
  const response = await fetch(
    `https://www.reddit.com/r/${subreddit}.json?after=${after}&dist=25`
  );

  const data = await response.json();

  return data;
};

/**
 * get post and comments post
 * @param url - comments post url
 */
export const fetchPost = async (
  url
): Promise<[PostsResponse, CommentsResponse]> => {
  const response = await fetch(`https://www.reddit.com/${url}.json`);

  const data = await response.json();

  return data;
};
