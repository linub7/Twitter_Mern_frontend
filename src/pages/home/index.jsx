import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

import CreatePost from 'components/shared/create-post';
import MainLayout from 'components/shared/main-layout';
import { getImageSource } from 'utils/helper';
import {
  createPostHandler,
  deletePostHandler,
  getPostsHandler,
  updatePostHandler,
} from 'api/post';
import {
  addPostToPostsAction,
  setPostsAction,
  removePostAction,
  updatePostStatusAction,
} from 'redux-store/slices/post';
import CustomLoader from 'components/shared/custom-loader';
import PostsList from 'components/shared/posts-list';
import NoResult from 'components/shared/no-result';
import ReplyModal from 'components/shared/modals/reply-modal';
import WarningModal from 'components/shared/modals/warning-modal';
import SocketContext from 'context/SocketContext';

const Home = () => {
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [createReplyPostLoading, setCreateReplyPostLoading] = useState(false);
  const [getPostsLoading, setGetPostsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [targetPost, setTargetPost] = useState(null);
  const [isPinMessageModalOpen, setIsPinMessageModalOpen] = useState(false);
  const [pinMessageLoading, setPinMessageLoading] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);

  const socket = useContext(SocketContext);

  const dispatch = useDispatch();

  const userImage = getImageSource(user?.profilePic);

  useEffect(() => {
    socket.emit('join', user?.id);

    return () => {};
  }, []);

  useEffect(() => {
    handleGetPosts();

    return () => {
      setTargetPost(null);
    };
  }, []);

  const handleChangeInput = (e) => setContent(e.target.value);

  const handleClickChatBubble = (post) => {
    setIsModalOpen(true);
    setTargetPost(post);
  };

  const handleOpenWarningModal = (post) => {
    setIsWarningModalOpen(true);
    setTargetPost(post);
  };

  const handleOpenPostPinModal = (post) => {
    setIsPinMessageModalOpen(true);
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
    dispatch(setPostsAction(data?.data?.data));
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

  const handleDeletePost = useCallback(async () => {
    setDeletePostLoading(true);
    const { err, data } = await deletePostHandler(targetPost?._id, user?.token);
    if (err) {
      console.log(err);
      setDeletePostLoading(false);
      return toast.error(err?.message);
    }

    setDeletePostLoading(false);
    setIsWarningModalOpen(false);
    dispatch(removePostAction(data?.data?.data));
  }, [targetPost?._id, dispatch, user?.token, deletePostLoading]);

  const handleTogglePostPin = useCallback(async () => {
    setPinMessageLoading(true);
    // TODO: Create 2 separate route for pin and unpin post -> if pinned: true ? unpin : pin
    const values = { pinned: targetPost?.pinned ? false : true };
    const { err, data } = await updatePostHandler(
      targetPost?._id,
      values,
      user?.token
    );

    if (err) {
      console.log(err);
      setPinMessageLoading(false);
      return toast.error(err?.message);
    }
    setPinMessageLoading(false);
    setIsPinMessageModalOpen(false);
    dispatch(updatePostStatusAction(data?.data?.data));
  }, [targetPost?._id, targetPost?.pinned, dispatch, user?.token]);

  return (
    <MainLayout pageTitle={'Home'}>
      {getPostsLoading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : (
        <>
          <CreatePost
            source={userImage}
            username={user?.username}
            value={content}
            disabled={!content?.trim() || createPostLoading}
            onChange={handleChangeInput}
            onClick={handleCreatePost}
          />
          {posts?.length === 0 ? (
            <NoResult title={'Nothing to show.'} />
          ) : (
            <PostsList
              posts={posts}
              userId={user?.id}
              token={user?.token}
              handleClickChatBubble={handleClickChatBubble}
              handleOpenWarningModal={handleOpenWarningModal}
              handleOpenPostPinModal={handleOpenPostPinModal}
            />
          )}
        </>
      )}
      {isModalOpen && (
        <ReplyModal
          replyContent={replyContent}
          targetPost={targetPost}
          user={user}
          createReplyPostLoading={createReplyPostLoading}
          setCreateReplyPostLoading={setCreateReplyPostLoading}
          setIsModalOpen={setIsModalOpen}
          setReplyContent={setReplyContent}
          setTargetPost={setTargetPost}
        />
      )}

      {isWarningModalOpen && (
        <WarningModal
          warnMessage="Are you Sure?"
          loading={deletePostLoading}
          setIsWarningModalOpen={setIsWarningModalOpen}
          setTargetPost={setTargetPost}
          onSubmit={handleDeletePost}
        />
      )}

      {isPinMessageModalOpen && (
        <WarningModal
          warnMessage={
            targetPost?.pinned
              ? 'Unpin this post?'
              : 'This post will appear at the top of your profile'
          }
          loading={pinMessageLoading}
          setTargetPost={setTargetPost}
          setIsWarningModalOpen={setIsPinMessageModalOpen}
          onSubmit={handleTogglePostPin}
        />
      )}
    </MainLayout>
  );
};

export default Home;
