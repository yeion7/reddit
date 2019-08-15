import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { parsePost } from "../schemas";
import { nFormatter, decodeHTML, cleanUrl } from "../utils";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { es } from "date-fns/locale";

const ICONS = {
  image: "🗾",
  link: "🔗",
  "hosted:video": "📼",
  "rich:video": "📼",
  self: "📝"
};

const UnknowHint = ({ title, selftext, permalink }: PostType) => {
  return (
    <div>
      <Link href={permalink}>
        <a>
          <h4>{title}</h4>
        </a>
      </Link>
      <ReactMarkdown>{selftext}</ReactMarkdown>
    </div>
  );
};

const SelfPost = ({ selftext }: PostType) => {
  return (
    <div style={{ overflowY: "scroll", height: 400, padding: 10 }}>
      <ReactMarkdown>{selftext}</ReactMarkdown>;
    </div>
  );
};

const LinkPost = ({ title, url, thumbnail }: PostType) => (
  <Fragment>
    <div>
      <h3 className="title">{title}</h3>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    </div>
    <a href={url} target="_blank" rel="noopener noreferrer">
      <img src={thumbnail} alt={title} style={{ borderRadius: 4 }} />
    </a>
  </Fragment>
);

const ImagePost = ({ permalink, previews, title, url }: PostType) => {
  const isGif = url && url.includes("gif");

  return (
    <Link href={permalink}>
      <a style={{ margin: "auto" }}>
        <picture>
          {previews.images.map(preview => (
            <Fragment key={preview.id}>
              <img
                style={{ height: 400 }}
                src={isGif ? url : cleanUrl(preview.source.url)}
                alt={title}
              />
              {preview.resolutions.map(prev => (
                <source
                  media={`(min-width: ${prev.width}px)`}
                  key={prev.url}
                  src={`${cleanUrl(prev.url)}`}
                />
              ))}
            </Fragment>
          ))}
        </picture>
      </a>
    </Link>
  );
};

const VideoPost = ({ previews, media, url }: PostType) => {
  if (media && media.reddit_video) {
    return (
      <video
        poster={cleanUrl(previews.images[0].source.url)}
        src={media.reddit_video.fallback_url}
        controls
        muted={false}
        height={400}
        style={{ margin: "auto" }}
      >
        <source src={media.reddit_video.dash_url} />
        <source src={media.reddit_video.hls_url} />
      </video>
    );
  }

  return (
    <div
      style={{ height: 400, margin: "auto" }}
      dangerouslySetInnerHTML={{
        __html: decodeHTML(media.oembed.html)
      }}
    ></div>
  );
};

const PREVIEW = {
  image: ImagePost,
  link: LinkPost,
  "hosted:video": VideoPost,
  "rich:video": VideoPost,
  self: SelfPost
};

type PostType = ReturnType<typeof parsePost>;
type Props = PostType & { togglePost?: any; opened?: boolean; index?: number };
const Post: React.FC<Props> = ({ opened, togglePost, index, ...post }) => {
  const {
    id,
    ups,
    title,
    subreddit,
    author,
    created,
    comments,
    postHint,
    permalink
  } = post;
  const Preview = PREVIEW[postHint] || UnknowHint;
  const iconPreview = ICONS[postHint] || "📑";

  return (
    <div className="container">
      <div className="postRow">
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
          <button className="preview" onClick={() => togglePost(id, index)}>
            {iconPreview}
          </button>
          <div className="info">
            <div>
              <Link href={permalink}>
                <h3 className="title">{title}</h3>
              </Link>
              <div>
                <Link href={`/r/${subreddit}`}>
                  <a className="subreddit">{`r/${subreddit}`}</a>
                </Link>
                <span role="presentation"> . </span>
                <span>Posted by </span>
                <span>{`u/${author}`}</span>
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
      </div>
      {opened && (
        <div
          className="view"
          style={{
            display: "flex",
            padding: "1em",
            justifyContent: "space-between"
          }}
        >
          <Preview {...post} />
        </div>
      )}
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

export default React.memo<Props>(Post);
