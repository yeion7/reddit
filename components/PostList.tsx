import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import Post from "./post";

function PostList({ hasNextPage, isNextPageLoading, items, loadNextPage }) {
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const isItemLoaded = index => !hasNextPage || index < items.length;

  const Item = ({ index, style }) => {
    let content;

    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      content = <Post {...items[index]} />;
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          itemSize={70}
          height={70 * 25}
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width="100%"
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}

export default PostList;
