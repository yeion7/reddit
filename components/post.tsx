import React from "react";
import Link from "next/link";
import { nFormatter } from "../utils";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";

import {
  FaArrowCircleUp,
  FaArrowCircleDown,
  FaRegFileAlt,
  FaRegImage,
  FaRegFileVideo,
  FaRegBookmark,
  FaRegCommentAlt,
  FaRegNewspaper
} from "react-icons/fa";

import {
  ImagePost,
  LinkPost,
  VideoPost,
  SelfPost,
  UnknowHint
} from "./PostComponents";
import { Post } from "../types/normalized";

const ICONS = {
  image: FaRegImage,
  link: FaRegBookmark,
  "hosted:video": FaRegFileVideo,
  "rich:video": FaRegFileVideo,
  self: FaRegFileAlt
};

const PREVIEW = {
  image: ImagePost,
  link: LinkPost,
  "hosted:video": VideoPost,
  "rich:video": VideoPost,
  self: SelfPost
};

type Props = Post & {
  setVote: any;
  togglePost?: any;
  opened?: boolean;
  index?: number;
};

const PostContent: React.FC<Props> = ({
  setVote,
  opened,
  togglePost,
  index,
  ...post
}) => {
  const {
    id,
    ups,
    title,
    subreddit,
    author,
    created,
    comments,
    postHint,
    permalink,
    vote
  } = post;
  const previewRef = React.useRef<HTMLDivElement>(null);
  const Preview = PREVIEW[postHint] || UnknowHint;
  const IconPreview = ICONS[postHint] || FaRegNewspaper;

  return (
    <article className="container">
      <div className="postRow">
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
          <span className="count">{nFormatter(ups)}</span>
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
          <button
            className="preview"
            aria-haspopup
            aria-expanded={opened}
            aria-controls={`preview-${id}`}
            onClick={() => {
              if (previewRef.current) {
                previewRef.current.focus();
              }
              togglePost(id, index);
            }}
          >
            <IconPreview
              size={14}
              aria-label={
                opened ? "ocultar contenido del post" : "ver contenido del post"
              }
            />
          </button>
          <div className="info">
            <div>
              <Link
                href="/r/[subreddit]/comments/[user]/[postId]"
                as={permalink}
              >
                <h3 className="title">{title}</h3>
              </Link>
              <div>
                <Link href="/r/[subreddit]" as={`/r/${subreddit}`}>
                  <a
                    aria-label={`subreddit ${subreddit}`}
                    className="subreddit"
                  >{`r/${subreddit}`}</a>
                </Link>
                <span role="presentation"> . </span>
                <span>Publicado por {`u/${author}`}</span>
                <span role="presentation"> . </span>
                <time dateTime={fromUnixTime(created).toLocaleString()}>
                  {formatDistanceToNow(fromUnixTime(created), {
                    locale: es
                  })}
                </time>
              </div>
            </div>
            <div>
              <span
                className="comments"
                aria-label={`número comentarios: ${comments}`}
              >
                <FaRegCommentAlt
                  size={12}
                  style={{ marginRight: 5 }}
                  role="presentation"
                />
                {nFormatter(comments)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        id={`preview-${id}`}
        className="view"
        style={{
          display: "flex",
          padding: "1em",
          justifyContent: "space-between"
        }}
        ref={previewRef}
        aria-live="assertive"
      >
        {opened && <Preview {...post} />}
      </div>
      <style jsx>
        {`
          .container {
            overflow: hidden;
            background: #fff;
            color: rgb(135, 138, 140);
            cursor: pointer;
            height: 100%;
          }
          .postRow {
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
            text-decoration: none;
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

          .subreddit:hover {
            text-decoration: underline;
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

          @media (min-width: 425px) {
            .actions {
              flex-direction: row;
            }
            .comments {
              display: flex;
              align-items: center;
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
    </article>
  );
};

export default React.memo<Props>(PostContent);
