import { useCallback, useEffect, useState } from 'react';
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
} from 'api/post';
import {
  addPostToPostsAction,
  setPostsAction,
  removePostAction,
} from 'redux-store/slices/post';
import CustomLoader from 'components/shared/custom-loader';
import PostsList from 'components/shared/posts-list';
import NoResult from 'components/shared/no-result';
import ReplyModal from 'components/shared/modals/reply-modal';
import WarningModal from 'components/shared/modals/warning-modal';

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

  const handleClickChatBubble = (post) => {
    setIsModalOpen(true);
    setTargetPost(post);
  };

  const handleOpenWarningModal = (post) => {
    setIsWarningModalOpen(true);
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
          loading={deletePostLoading}
          setIsWarningModalOpen={setIsWarningModalOpen}
          setTargetPost={setTargetPost}
          onSubmit={handleDeletePost}
        />
      )}
    </MainLayout>
  );
};

export default Home;
