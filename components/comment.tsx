import React from "react";
import Link from "next/link";

import { parseComment } from "../schemas";

import { voteOptions, Comment as CommentType } from "../types/normalized";
import CommentContent from "./CommentContent";

type Props = {
  comments: { [key: string]: CommentType };
  setVote: (id: string, vote: voteOptions) => void;
  setComment: (belongTo: string, comment: string) => void;
} & CommentType;

const Comment: React.FC<Props> = ({
  comments,
  setVote,
  setComment,
  replies,
  more,
  ...comment
}) => {
  const [openThread, setOpenThread] = React.useState(comment.depth < 3);

  const toggleReplies = React.useCallback(() => {
    setOpenThread(open => !open);
  }, []);

  return (
    <div className="comment" data-testid={`comment-${comment.id}`}>
      {more ? (
        <Link href={comment.id}>
          <a className="showMore" style={{ marginLeft: comment.depth * 16 }}>
            Ver más ({more.length})
          </a>
        </Link>
      ) : (
        <>
          <CommentContent
            {...comment}
            isOpenReplies={openThread}
            toggleReplies={toggleReplies}
            hasReplies={replies.length > 0}
            setVote={setVote}
            setComment={setComment}
          />
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
        </>
      )}

      <style jsx>
        {`
          .comment {
            overflow: hidden;
            background: #fff;
            color: rgb(135, 138, 140);
            margin-top: 16px;
            padding: 8px 4px 0 0;
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
