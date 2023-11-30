import PostItem from 'components/shared/post-item';

const HomePagePosts = ({ posts, message }) => {
  return posts?.map((post) => (
    <PostItem
      key={post?._id}
      profilePicUrl={post?.postedBy?.profilePic?.url}
      displayName={`${post?.postedBy?.firstName} ${post?.postedBy?.lastName}`}
      content={post?.content}
      username={post?.postedBy?.username}
      createdAt={post?.createdAt}
      message={message}
    />
  ));
};

export default HomePagePosts;
