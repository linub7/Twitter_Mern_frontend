import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

import { deletePostHandler, getSinglePostAndRepliesHandler } from 'api/post';
import CustomLoader from 'components/shared/custom-loader';
import MainLayout from 'components/shared/main-layout';
import PostsList from 'components/shared/posts-list';
import { setPostsAction, removePostAction } from 'redux-store/slices/post';
import ReplyModal from 'components/shared/modals/reply-modal';
import WarningModal from 'components/shared/modals/warning-modal';
import NoResult from 'components/shared/no-result';

const Post = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPost, setTargetPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [createReplyPostLoading, setCreateReplyPostLoading] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);

  const { posts } = useSelector((state) => state.post);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!id) return navigate('/');
    handleGetSinglePostAndReplies();

    return () => {
      setIsLoading(false);
    };
  }, [id]);

  const handleClickChatBubble = (post) => {
    setIsModalOpen(true);
    setTargetPost(post);
  };
  const handleOpenWarningModal = (post) => {
    setIsWarningModalOpen(true);
    setTargetPost(post);
  };

  const handleGetSinglePostAndReplies = async () => {
    setIsLoading(true);
    const { err, data } = await getSinglePostAndRepliesHandler(id, user?.token);
    if (err) {
      console.log(err);
      setIsLoading(false);
      toast.error(err?.message);
      return navigate('/');
    }
    setIsLoading(false);
    dispatch(setPostsAction(data?.data?.data));
  };

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
    <MainLayout pageTitle={`View Post`}>
      {isLoading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : posts?.length < 1 ? (
        <NoResult title={'Nothing to show.'} />
      ) : (
        <PostsList
          posts={posts}
          token={user?.token}
          userId={user?.id}
          handleClickChatBubble={handleClickChatBubble}
          handleOpenWarningModal={handleOpenWarningModal}
        />
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
    </MainLayout>
  );
};

export default Post;
