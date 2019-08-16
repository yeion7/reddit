import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import { parseComment } from "../schemas";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";
import { nFormatter } from "../utils";

import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { voteOptions } from "../types/normalized";

type CommentType = ReturnType<typeof parseComment>;
type Props = {
  comments: { [key: string]: CommentType };
  setVote: (id: string, vote: voteOptions) => void;
  setComment: (belongTo: string, comment: string) => void;
} & CommentType;

const Comment: React.FC<Props> = ({
  comments,
  id,
  body,
  ups,
  created,
  author,
  more,
  replies,
  vote,
  setVote,
  setComment
}) => {
  const [openThread, setOpenThread] = React.useState(true);
  const [openComment, setOpenComment] = React.useState(false);

  const addComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    const { value } = e.target.elements.comment;
    setOpenComment(false);
    setComment(id, value);
  };

  return (
    <div className="comment" data-testid={`comment-${id}`}>
      {more ? (
        <Link href={id}>
          <a className="showMore">Ver más ({more.length})</a>
        </Link>
      ) : (
        <>
          <div className="actions">
            <button
              aria-label="upvote"
              className="vote"
              onClick={() => setVote(id, "upvote")}
            >
              <FaArrowCircleUp
                size={14}
                role="presentation"
                color={vote === "upvote" ? "#ff895f" : "currentColor"}
              />
            </button>
            <button
              aria-label="downvote"
              className="vote"
              onClick={() => setVote(id, "downvote")}
            >
              <FaArrowCircleDown
                color={vote === "downvote" ? "#ff895f" : "currentColor"}
                size={14}
                role="presentation"
              />
            </button>
          </div>
          <div className="content">
            <div className="info">
              {replies.length > 0 && (
                <button
                  onClick={() => setOpenThread(!openThread)}
                  aria-label={
                    openThread ? "ver menos comentarios" : "ver más comentarios"
                  }
                >
                  [{`${openThread ? "-" : "+"}`}]
                </button>
              )}
              <a className="user">{author}</a>
              <span role="presentation"> . </span>
              <span aria-label={`puntos ${ups}`}>{`${nFormatter(
                ups
              )} points`}</span>
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
            <div>
              {openComment ? (
                <form onSubmit={addComment}>
                  <textarea
                    data-testid={`inputcomment-${id}`}
                    placeholder="añade una respuesta"
                    className="inputComment"
                    name="comment"
                  />

                  <div style={{ marginTop: 5 }}>
                    <button
                      data-testid={`cancelcomment-${id}`}
                      type="button"
                      className="action_button"
                      style={{ marginRight: 5, background: "#e14242" }}
                      onClick={() => setOpenComment(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      data-testid={`savecomment-${id}`}
                      type="submit"
                      className="action_button"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  data-testid={`addcomment-${id}`}
                  className="action_button"
                  onClick={() => setOpenComment(true)}
                >
                  Comentar
                </button>
              )}
            </div>
            {openThread &&
              replies.map(replyId => (
                <Comment
                  key={replyId}
                  comments={comments}
                  setVote={setVote}
                  setComment={setComment}
                  {...comments[replyId]}
                />
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

          .inputComment {
            width: 100%;
            height: 150px;
            max-width: 500px;
            display: block;
          }

          .action_button {
            color: #fff;
            background-color: #4299e1;
            padding: 0.5em 1em;
            border: 0 solid #e2e8f0;
            border-radius: 0.25rem;
          }

          .action_button:hover {
            background-color: #2b6cb0;
            border: 0 solid #2b6cb0;
          }

          a:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  );
};

export default React.memo<Props>(Comment);
