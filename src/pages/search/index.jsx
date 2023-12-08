import { useCallback, useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import ProfilePageTabs from 'components/profile/tabs';
import SearchBarContainer from 'components/search/search-bar-container';
import MainLayout from 'components/shared/main-layout';
import {
  deletePostHandler,
  searchPostsHandler,
  updatePostHandler,
} from 'api/post';
import CustomLoader from 'components/shared/custom-loader';
import NoResult from 'components/shared/no-result';
import PostsList from 'components/shared/posts-list';
import {
  makeEmptyPostsAction,
  removePostAction,
  setPostsAction,
  updatePostStatusAction,
} from 'redux-store/slices/post';
import ReplyModal from 'components/shared/modals/reply-modal';
import WarningModal from 'components/shared/modals/warning-modal';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [noResultFound, setNoResultFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPost, setTargetPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [createReplyPostLoading, setCreateReplyPostLoading] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [isPinMessageModalOpen, setIsPinMessageModalOpen] = useState(false);
  const [pinMessageLoading, setPinMessageLoading] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      handleMakeEmptyAction();
      if (!searchTerm || searchTerm?.trim() === '') {
        handleMakeEmptyAction();
        setNoResultFound(false);
        return;
      }
      setLoading(true);
      const { err, data } = await searchPostsHandler(searchTerm, user?.token);
      if (err) {
        setLoading(false);
        console.log(err);
        return;
      }
      if (data?.status === 'success') {
        if (data?.data?.data?.length < 1) {
          setLoading(false);
          setNoResultFound(true);
        } else {
          setLoading(false);
          setNoResultFound(false);
          dispatch(setPostsAction(data?.data?.data));
        }
      }
      return () => {
        handleMakeEmptyAction();
      };
    }, 500);
    return () => {
      clearTimeout(delaySearch);
    };
  }, [searchTerm, user?.token, dispatch]);

  const handleMakeEmptyAction = () => dispatch(makeEmptyPostsAction());

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
    <MainLayout pageTitle={'Search'}>
      <SearchBarContainer
        placeholder={'Search for posts'}
        value={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ProfilePageTabs
        colOneTitle={'Posts'}
        colTwoTitle={'Users'}
        activeTab={'Posts'}
        colOnePath={`/search`}
        colTwoPath={`/search/users`}
      />
      {loading && (
        <CustomLoader>
          <BounceLoader color={'#9bd1f9'} />
        </CustomLoader>
      )}

      {!loading && noResultFound && <NoResult title={'No Posts Found.'} />}
      {posts && !noResultFound && (
        <PostsList
          posts={posts}
          token={user?.token}
          userId={user?.id}
          handleClickChatBubble={handleClickChatBubble}
          handleOpenWarningModal={handleOpenWarningModal}
          handleOpenPostPinModal={handleOpenPostPinModal}
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

export default Search;
