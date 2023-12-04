import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import MainLayout from 'components/shared/main-layout';
import { getMeHandler } from 'api/auth';
import {
  removePostAction,
  setPostsAction,
  setProfileData,
} from 'redux-store/slices/post';
import CustomLoader from 'components/shared/custom-loader';
import { getImageSource } from 'utils/helper';
import ProfilePageHeader from 'components/profile/header';
import ProfilePageTabs from 'components/profile/tabs';
import PostsList from 'components/shared/posts-list';
import ReplyModal from 'components/shared/modals/reply-modal';
import WarningModal from 'components/shared/modals/warning-modal';
import { deletePostHandler } from 'api/post';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [targetPost, setTargetPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [createReplyPostLoading, setCreateReplyPostLoading] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { posts, profileData } = useSelector((state) => state.post);

  const userProfileSource = getImageSource(profileData?.profilePic?.url);

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
    dispatch(setProfileData(data?.data?.data?.me));
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
            followersCount={profileData?.followers?.length}
          />
          <ProfilePageTabs
            colOneTitle={'Posts'}
            colTwoTitle={'Replies'}
            activeTab={'Posts'}
            username={profileData?.username}
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
          loading={deletePostLoading}
          setIsWarningModalOpen={setIsWarningModalOpen}
          setTargetPost={setTargetPost}
          onSubmit={handleDeletePost}
        />
      )}
    </MainLayout>
  );
};

export default Profile;
