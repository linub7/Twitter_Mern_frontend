import PostItem from 'components/shared/post-item';

const HomePagePosts = ({
  posts,
  userId,
  token,
  handleClickChatBubble = () => {},
}) => {
  return posts?.map((post) => {
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
      />
    );
  });
};

export default HomePagePosts;
