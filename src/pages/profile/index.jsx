import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import MainLayout from 'components/shared/main-layout';
import { getMeHandler } from 'api/auth';
import {
  removePostAction,
  setPostsAction,
  setProfileDataAction,
  updatePostStatusAction,
} from 'redux-store/slices/post';
import CustomLoader from 'components/shared/custom-loader';
import { getImageSource } from 'utils/helper';
import ProfilePageHeader from 'components/profile/header';
import ProfilePageTabs from 'components/profile/tabs';
import PostsList from 'components/shared/posts-list';
import ReplyModal from 'components/shared/modals/reply-modal';
import WarningModal from 'components/shared/modals/warning-modal';
import { deletePostHandler, updatePostHandler } from 'api/post';
import UploadImageModal from 'components/shared/modals/upload-image-modal';
import UploadCoverPhotoModal from 'components/shared/modals/upload-cover-photo-modal';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [targetPost, setTargetPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [createReplyPostLoading, setCreateReplyPostLoading] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [isUploadCoverPhotoModalOpen, setIsUploadCoverPhotoModalOpen] =
    useState(false);
  const [uploadCoverPhotoLoading, setUploadCoverPhotoLoading] = useState(false);
  const [isPinMessageModalOpen, setIsPinMessageModalOpen] = useState(false);
  const [pinMessageLoading, setPinMessageLoading] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { posts, profileData } = useSelector((state) => state.post);

  const userProfileSource =
    user?.id === profileData?._id
      ? getImageSource(user?.profilePic)
      : getImageSource(profileData?.profilePic?.url);

  const userCoverSource =
    user?.id === profileData?._id
      ? user?.coverPhoto
      : profileData?.coverPhoto?.url;

  useEffect(() => {
    handleGetMe();

    return () => {};
  }, []);

  const handleGetMe = async () => {
    setIsLoading(true);
    const { err, data } = await getMeHandler('', user?.token);
    if (err) {
      console.log(err);
      setIsLoading(false);
      return toast.error(err?.message);
    }
    setIsLoading(false);
    dispatch(setProfileDataAction(data?.data?.data?.me));
    dispatch(setPostsAction(data?.data?.data?.posts));
  };

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
    <MainLayout pageTitle={profileData?.username?.toUpperCase()}>
      {isLoading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
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
            userCoverSource={userCoverSource}
            setIsUploadImageModalOpen={setIsUploadImageModalOpen}
            setIsUploadCoverPhotoModalOpen={setIsUploadCoverPhotoModalOpen}
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
            handleOpenPostPinModal={handleOpenPostPinModal}
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

      {isUploadImageModalOpen && (
        <UploadImageModal
          loading={uploadImageLoading}
          user={user}
          setIsUploadImageModalOpen={setIsUploadImageModalOpen}
          setUploadImageLoading={setUploadImageLoading}
        />
      )}

      {isUploadCoverPhotoModalOpen && (
        <UploadCoverPhotoModal
          loading={uploadCoverPhotoLoading}
          user={user}
          setIsUploadCoverPhotoModalOpen={setIsUploadCoverPhotoModalOpen}
          setUploadCoverPhotoLoading={setUploadCoverPhotoLoading}
        />
      )}
      {isPinMessageModalOpen && (
        <WarningModal
          warnMessage={
            targetPost?.pinned
              ? 'Unpin this post?'
              : 'This post will appear at the top of your profile.'
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

export default Profile;
