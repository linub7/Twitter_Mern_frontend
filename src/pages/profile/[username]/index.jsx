import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import MainLayout from 'components/shared/main-layout';
import { getUserHandler, toggleUserFollowHandler } from 'api/user';
import {
  removePostAction,
  setPostsAction,
  setProfileDataAction,
} from 'redux-store/slices/post';
import CustomLoader from 'components/shared/custom-loader';
import NoResult from 'components/shared/no-result';
import ProfilePageHeader from 'components/profile/header';
import { getImageSource } from 'utils/helper';
import ProfilePageTabs from 'components/profile/tabs';
import PostsList from 'components/shared/posts-list';
import ReplyModal from 'components/shared/modals/reply-modal';
import WarningModal from 'components/shared/modals/warning-modal';
import { deletePostHandler } from 'api/post';
import SocketContext from 'context/SocketContext';

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userNotFoundError, setUserNotFoundError] = useState('');
  const [targetPost, setTargetPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [createReplyPostLoading, setCreateReplyPostLoading] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);

  const params = useParams();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const { user } = useSelector((state) => state.user);
  const { posts, profileData } = useSelector((state) => state.post);

  const userProfileSource = getImageSource(profileData?.profilePic?.url);

  useEffect(() => {
    if (!params?.username) return;

    handleGetUser();

    return () => {};
  }, [params?.username]);

  const handleClickChatBubble = (post) => {
    setIsModalOpen(true);
    setTargetPost(post);
  };

  const handleOpenWarningModal = (post) => {
    setIsWarningModalOpen(true);
    setTargetPost(post);
  };

  const handleGetUser = async () => {
    setIsLoading(true);
    const { err, data } = await getUserHandler(
      '',
      params?.username,
      user?.token
    );
    if (err) {
      console.log(err);
      setIsLoading(false);
      setUserNotFoundError(err?.message);
      return;
    }
    setIsLoading(false);
    dispatch(setProfileDataAction(data?.data?.data?.user));
    dispatch(setPostsAction(data?.data?.data?.posts));
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

  const handleToggleUserFollow = useCallback(async () => {
    const { err, data } = await toggleUserFollowHandler(
      profileData?._id,
      user?.token
    );

    if (err) {
      console.log(err);
      return toast.error(err?.message);
    }

    await dispatch(setProfileDataAction(data?.data?.data?.user));
    // if (data?.data?.data?.user?._id?.toString() === user?.id?.toString())
    //   return;
    // socket.emit('follow-notification-received', {
    //   data: data?.data?.data,
    //   user,
    // });
  }, [dispatch, profileData?._id, socket, user]);

  return (
    <MainLayout pageTitle={params?.username}>
      {isLoading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : userNotFoundError !== '' ? (
        <NoResult title={userNotFoundError} />
      ) : (
        <>
          <ProfilePageHeader
            userProfileSource={userProfileSource}
            username={profileData?.username}
            currentUserId={user?.id}
            profileDataId={profileData?._id}
            displayName={`${profileData?.firstName} ${profileData?.lastName}`}
            followingCount={profileData?.following?.length}
            followers={profileData?.followers}
            userCoverSource={profileData?.coverPhoto?.url}
            handleToggleUserFollow={handleToggleUserFollow}
          />
          <ProfilePageTabs
            colOneTitle={'Posts'}
            colTwoTitle={'Replies'}
            activeTab={'Posts'}
            colOnePath={`/profile/${profileData?.username}`}
            colTwoPath={`/profile/${profileData?.username}/replies`}
          />
          <PostsList
            posts={posts}
            token={user?.token}
            userId={user?.id}
            handleClickChatBubble={handleClickChatBubble}
            handleOpenWarningModal={handleOpenWarningModal}
          />
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
    </MainLayout>
  );
};

export default UserProfile;
