import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { decodeHTML, cleanUrl } from "../utils";
import { Post } from "../types/normalized";

export const UnknowHint = ({ title, selftext, permalink }: Post) => {
  return (
    <div>
      <Link href="/r/[subreddit]/comments/[user]/[postId]" as={permalink}>
        <a>
          <h4>{title}</h4>
        </a>
      </Link>
      <ReactMarkdown>{selftext}</ReactMarkdown>
    </div>
  );
};

export const SelfPost = ({ selftext }: Post) => {
  return (
    <div style={{ overflowY: "scroll", height: 400, padding: 10 }}>
      <ReactMarkdown>{selftext}</ReactMarkdown>;
    </div>
  );
};

export const LinkPost = ({ title, url, thumbnail }: Post) => (
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

export const ImagePost = ({ permalink, previews, title, url }: Post) => {
  const isGif = url && url.includes("gif");
  return (
    <Link href="/r/[subreddit]/comments/[user]/[postId]" as={permalink}>
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

export const VideoPost = ({ previews, media }: Post) => {
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
