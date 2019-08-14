import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import { parseComment } from "../schemas";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import { nFormatter } from "../utils";

type CommentType = ReturnType<typeof parseComment>;

const Comment: React.FC<
  {
    comments: { [key: string]: CommentType };
  } & CommentType
> = ({ comments, id, body, ups, created, author, children, replies }) => {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="comment">
      {children ? (
        <Link href={id}>
          <a className="showMore">Ver más ({children.length})</a>
        </Link>
      ) : (
        <>
          <div className="actions">
            <button aria-label="upvote" className="vote">
              ⬆️
            </button>
            <button aria-label="downvote" className="vote">
              ⬇️
            </button>
          </div>
          <div className="content">
            <div className="info">
              {replies && (
                <button onClick={() => setOpen(!open)}>
                  [{`${open ? "-" : "+"}`}]
                </button>
              )}
              <a className="user">{author}</a>
              <span role="presentation"> . </span>
              <span>{`${nFormatter(ups)} points`}</span>
              <span role="presentation"> . </span>
              <span>
                {formatDistanceToNow(fromUnixTime(created), {
                  locale: es
                })}
              </span>
            </div>
            <div className="text">
              <ReactMarkdown source={body} />
            </div>
            {typeof replies === "object" &&
              open &&
              replies.data.children.map(({ data }) => (
                <Comment key={data} comments={comments} {...comments[data]} />
              ))}
          </div>
        </>
      )}

      <style jsx>
        {`
          .comment {
            overflow: hidden;
            background: #fff;
            color: rgb(135, 138, 140);
            display: flex;
            flex-direction: row;
            margin-top: 16px;
            padding: 8px 4px 0 0;
          }

          .actions {
            margin: 0 6px;
            max-height: 40px;
            min-width: 24px;
            display: flex;
            flex-direction: column;
          }

          .showMore {
            margin-left: 0.3em;
            font-size: 0.9em;
            font-weight: 700;
            color: inherit;
            text-decoration: none;
          }

          .showMore:hover {
            text-decoration: underline;
          }

          .vote {
            height: 20px;
            width: 24px;
          }

          .info {
            font-size: 0.8em;
          }

          .user {
            font-weight: 400;
            color: rgb(26, 26, 27);
          }

          .text {
            color: rgb(26, 26, 27);
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
        `}
      </style>
    </div>
  );
};

export default Comment;
