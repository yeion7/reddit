import React from "react";
import { VariableSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import Post from "./post";

function PostList({
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
  setVote
}) {
  const [openendPosts, setOpenendPosts] = React.useState({});
  const listRef = React.useRef<List | null>(null);

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  const isItemLoaded = index => !hasNextPage || index < items.length;
  const getSize = index => {
    const item = items[index];
    if (item && openendPosts[item.id]) {
      return 500;
    }

    return 70;
  };

  const togglePost = React.useCallback(
    (postId: string, index: number) => {
      setOpenendPosts(opended => ({
        ...opended,
        [postId]: !opended[postId]
      }));

      // reset heigth
      if (listRef.current) {
        listRef.current.resetAfterIndex(index, true);
      }
    },
    [listRef]
  );

  const Item = ({ index, style }) => {
    let content;
    if (!isItemLoaded(index)) {
      content = "Loading...";
    } else {
      const item = items[index];

      content = (
        <Post
          {...item}
          setVote={setVote}
          index={index}
          opened={openendPosts[item.id]}
          togglePost={togglePost}
        />
      );
    }

    return <div style={style}>{content}</div>;
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => {
        return (
          <List
            itemSize={getSize}
            height={70 * 20}
            itemCount={itemCount}
            onItemsRendered={onItemsRendered}
            ref={node => {
              // @ts-ignore
              ref(node);
              listRef.current = node;
            }}
            width="100%"
          >
            {Item}
          </List>
        );
      }}
    </InfiniteLoader>
  );
}

export default PostList;
