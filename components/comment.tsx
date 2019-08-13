import React from "react";

const Comment: React.FC<{
  child?: React.ReactNode | null;
}> = ({ child = null }) => {
  return (
    <div className="comment">
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
          <a className="user">u/ajp12290</a>
          <span role="presentation"> . </span>
          <span>17K points</span>
          <span role="presentation"> . </span>
          <span>3 hours ago</span>
        </div>
        <p className="text">
          Honestly I'm a banger of said drum. Linux is glorious. But you know
          what? I would recommend that very few people use Linux. In fact I use
          Windows daily. Why? Because sometimes I don't want to deal with shit.
          Sometimes I want to just turn a computer on and have it work and be
          compatible with everything and work very easily. Linux is great. But
          it has serious downsides just like every other OS. Anyone who ignores
          this is an idiot.
        </p>
        {child}
      </div>
      <style jsx>
        {`
          .comment {
            overflow: hidden;
            background: #fff;
            color: rgb(135, 138, 140);
            cursor: pointer;
            display: flex;
            flex-direction: row;
            margin-top: 16px;
            padding: 8px 4px 0 0;
          }

          .actions {
            margin: 0 6px;
            max-height: 40px;
            min-width: 24px;
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
