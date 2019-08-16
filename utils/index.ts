import { voteOptions } from "../types/normalized";

/**
 * convert a compat format number
 * @example nFormatter(1000) === '1K'
 * @param num
 */
export function nFormatter(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }

  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return String(num);
}

/**
 * decode string
 * @param html
 */
export function decodeHTML(html: string) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/**
 * decode url
 * @param url
 */
export const cleanUrl = (url: string) => url.replace(/&amp;/g, "&");

/**
 * calculate new ups
 */
export function calculateNewVotes({
  lastVote,
  currentVote,
  ups
}: {
  lastVote: voteOptions;
  currentVote: voteOptions;
  ups: number;
}): number {
  const COUNTS = {
    downvote: -1,
    upvote: 1
  };

  const undoVote = lastVote === currentVote;
  const changeVote = lastVote !== null && !undoVote;
  const count = COUNTS[currentVote];
  return ups + (changeVote ? count + count : undoVote ? -count : count);
}
