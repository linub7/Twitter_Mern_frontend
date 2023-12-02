import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HashLoader, BounceLoader } from 'react-spinners';

import styles from './styles.module.css';
import HomePageCreatePost from 'components/home/create-post';
import MainLayout from 'components/shared/main-layout';
import { getImageSource } from 'utils/helper';
import { createPostHandler, getPostsHandler } from 'api/post';
import { addPostToPostsAction, getPostsAction } from 'redux-store/slices/post';
import CustomLoader from 'components/shared/custom-loader';
import HomePagePosts from 'components/home/posts';
import NoResult from 'components/shared/no-result';
import CustomModal from 'components/shared/modal';
import PostItem from 'components/shared/post-item';

const Home = () => {
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [createReplyPostLoading, setCreateReplyPostLoading] = useState(false);
  const [getPostsLoading, setGetPostsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPost, setTargetPost] = useState(null);

  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);

  const dispatch = useDispatch();

  const userImage = getImageSource(user?.profilePic);

  useEffect(() => {
    handleGetPosts();

    return () => {
      setTargetPost(null);
    };
  }, []);

  const handleChangeInput = (e) => setContent(e.target.value);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTargetPost(null);
    setReplyContent('');
  };

  const handleClickChatBubble = (post) => {
    setIsModalOpen(true);
    setTargetPost(post);
  };

  const handleGetPosts = async () => {
    setGetPostsLoading(true);
    const { err, data } = await getPostsHandler(user?.token);
    if (err) {
      console.log(err);
      setGetPostsLoading(false);
      return toast.error(err?.message);
    }
    setGetPostsLoading(false);
    dispatch(getPostsAction(data?.data?.data));
  };

  const handleCreatePost = useCallback(async () => {
    setCreatePostLoading(true);
    const values = { content };
    const { err, data } = await createPostHandler(values, user?.token);
    if (err) {
      console.log(err);
      setCreatePostLoading(false);
      setContent('');
      return toast.error(err?.message);
    }
    setContent('');
    setCreatePostLoading(false);
    dispatch(addPostToPostsAction(data?.data?.data));
  }, [content, dispatch, user?.token, createPostLoading]);

  const handleSendReply = useCallback(async () => {
    setCreateReplyPostLoading(true);
    const values = { content: replyContent, replyTo: targetPost?._id };
    const { err, data } = await createPostHandler(values, user?.token);
    if (err) {
      console.log(err);
      setCreateReplyPostLoading(false);
      setReplyContent('');
      return toast.error(err?.message);
    }
    setReplyContent('');
    setCreateReplyPostLoading(false);
    setIsModalOpen(false);
    dispatch(addPostToPostsAction(data?.data?.data));
  }, [
    targetPost?._id,
    replyContent,
    dispatch,
    user?.token,
    createReplyPostLoading,
  ]);

  return (
    <MainLayout pageTitle={'Home'}>
      {getPostsLoading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : (
        <>
          <HomePageCreatePost
            source={userImage}
            username={user?.username}
            value={content}
            disabled={!content?.trim() || createPostLoading}
            onChange={handleChangeInput}
            onClick={handleCreatePost}
          />
          {posts?.length === 0 ? (
            <NoResult />
          ) : (
            <HomePagePosts
              posts={posts}
              userId={user?.id}
              token={user?.token}
              handleClickChatBubble={handleClickChatBubble}
            />
          )}
        </>
      )}
      {isModalOpen && (
        <CustomModal header={'Reply'} onClose={handleCloseModal}>
          <PostItem
            isInReplyMode={true}
            retweetedBy={
              targetPost?.retweetData !== undefined ||
              targetPost?.retweetData?._id !== undefined
                ? targetPost?.postedBy?.username
                : null
            }
            post={
              targetPost?.retweetData !== undefined ||
              targetPost?.retweetData?._id !== undefined
                ? targetPost?.retweetData
                : targetPost
            }
            userId={user?.id}
            token={user?.token}
            isRetweetedPost={
              targetPost?.retweetData !== undefined ||
              targetPost?.retweetData?._id !== undefined
            }
            handleClickChatBubble={handleClickChatBubble}
          />
          {createReplyPostLoading ? (
            <CustomLoader>
              <BounceLoader color="#9bd1f9" />
            </CustomLoader>
          ) : (
            <>
              <HomePageCreatePost
                source={userImage}
                username={user?.username}
                value={replyContent}
                disabled={!replyContent?.trim() || createReplyPostLoading}
                isInReplyMode={true}
                onChange={(e) => setReplyContent(e.target.value)}
                onClick={() => console.log(replyContent)}
              />
              <div className={styles.modalFooter}>
                <button
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className={styles.replyButton}
                  disabled={!replyContent.trim() || createReplyPostLoading}
                  onClick={handleSendReply}
                >
                  Send Reply
                </button>
              </div>
            </>
          )}
        </CustomModal>
      )}
    </MainLayout>
  );
};

export default Home;
