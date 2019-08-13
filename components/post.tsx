import React from "react";
import Link from "next/link";
import { parsePost } from "../schemas";
import { nFormatter } from "../utils";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import fromUnixTime from "date-fns/fromUnixTime";
import es from "date-fns/locale/es/index";

const ICONS = {
  image: "🗾",
  link: "🔗",
  "hosted:video": "📼",
  "rich:video": "📼",
  self: "📝"
};

const Post: React.FC<ReturnType<typeof parsePost>> = ({
  ups,
  title,
  subreddit,
  author,
  created,
  comments,
  postHint
}) => {
  return (
    <div className="container">
      <div className="actions">
        <button aria-label="upvote" className="vote">
          ⬆️
        </button>
        <span className="count">{nFormatter(ups)}</span>
        <button aria-label="downvote" className="vote">
          ⬇️
        </button>
      </div>
      <div className="content">
        <button className="preview">{ICONS[postHint] || "😱"}</button>
        <div className="info">
          <div>
            <h3 className="title">{title}</h3>
            <div>
              <Link href={`/r/${subreddit}`}>
                <a className="subreddit">{`r/${subreddit}`}</a>
              </Link>
              <span role="presentation"> . </span>
              <span>Posted by </span>
              <a>{`u/${author}`}</a>
              <span role="presentation"> . </span>
              <time dateTime={fromUnixTime(created).toLocaleString()}>
                {formatDistanceToNow(fromUnixTime(created), {
                  locale: es
                })}
              </time>
            </div>
          </div>
          <div>
            <span className="comments">
              <i>💬</i>
              {nFormatter(comments)}
            </span>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .container {
            overflow: hidden;
            background: #fff;
            color: rgb(135, 138, 140);
            cursor: pointer;
            height: 70px;
            display: flex;
            flex-direction: row;
          }
          .container:hover {
            border: 1px solid #898989;
          }

          .actions {
            background: #f8f9fa;
            flex: 0 0 36px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            border-right: 1px solid #edeff1;
          }

          .content {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            flex: 1 1 auto;
            padding: 3px 0;
            font-size: 0.8em;
            margin-left: 0.5em;
          }

          .preview {
            height: 24px;
            padding: 4px;
            width: 24px;
            flex: 0 0 24px;
            margin: 0 8px;
          }

          .info {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .count {
            color: rgb(26, 26, 27);
            text-align: center;
            font-size: 10px;
            font-weight: 700;
            word-break: normal;
            display: none;
            width: 32px;
          }

          .title {
            color: #222;
            margin: 0;
          }

          .subreddit {
            color: #222;
          }

          .comments {
            display: none;
            padding: 5px;
          }

          .vote {
            height: 24px;
            width: 24px;
          }
          button {
            background: transparent;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: initial;
          }
          a:hover {
            text-decoration: underline;
          }

          @media (min-width: 425px) {
            .actions {
              flex-direction: row;
            }
            .comments {
              display: initial;
            }
            .count {
              display: initial;
            }
            .content {
              flex-direction: row;
            }
          }
        `}
      </style>
    </div>
  );
};

export default React.memo<ReturnType<typeof parsePost>>(Post);
