import "isomorphic-unfetch";
import { RedditResponse } from "../types/reddit";

interface Params {
  subreddit: string | string[];
  after: string | string[];
}
export const fetchPosts = async ({
  subreddit,
  after
}: Params): Promise<RedditResponse> => {
  const response = await fetch(
    `https://www.reddit.com/r/${subreddit}.json?after=${after}&dist=25`
  );

  const data = await response.json();

  return data;
};
