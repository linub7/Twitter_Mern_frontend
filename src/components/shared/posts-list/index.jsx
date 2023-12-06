import { useEffect, useState } from 'react';
import PostItem from 'components/shared/post-item';
import { sortItems } from 'utils/helper';

const PostsList = ({
  posts,
  userId,
  token,
  isInReplyMode,
  handleClickChatBubble = () => {},
  handleOpenWarningModal = () => {},
  handleOpenPostPinModal = () => {},
}) => {
  const [isPinnedExisted, setIsPinnedExisted] = useState(false);
  useEffect(() => {
    for (const post of posts) {
      post?.pinned ? setIsPinnedExisted(true) : setIsPinnedExisted(false);
    }
    return () => {
      setIsPinnedExisted(false);
    };
  }, [posts]);

  const sortedPosts = sortItems(posts, isPinnedExisted);

  return sortedPosts?.map((post) => {
    const isRetweetedPost =
      post?.retweetData !== undefined || post?.retweetData?._id !== undefined;
    return (
      <PostItem
        key={post?._id}
        retweetedBy={isRetweetedPost ? post?.postedBy?.username : null}
        post={isRetweetedPost ? post?.retweetData : post}
        userId={userId}
        token={token}
        isRetweetedPost={isRetweetedPost}
        handleClickChatBubble={handleClickChatBubble}
        isInReplyMode={isInReplyMode}
        handleOpenWarningModal={handleOpenWarningModal}
        handleOpenPostPinModal={handleOpenPostPinModal}
      />
    );
  });
};

export default PostsList;
