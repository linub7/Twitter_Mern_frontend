import { BounceLoader } from 'react-spinners';
import { useCallback, useContext } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import CustomLoader from '../../custom-loader';
import ModalContainer from '../modal-container';
import PostItem from '../../post-item';
import CreatePost from 'components/shared/create-post';
import { getImageSource } from 'utils/helper';
import { createPostHandler } from 'api/post';
import { addPostToPostsAction } from 'redux-store/slices/post';
import SocketContext from 'context/SocketContext';

const ReplyModal = ({
  user,
  targetPost,
  createReplyPostLoading = false,
  replyContent,
  setIsModalOpen = () => {},
  setTargetPost = () => {},
  setReplyContent = () => {},
  setCreateReplyPostLoading = () => {},
}) => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const userImage = getImageSource(user?.profilePic);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTargetPost(null);
    setReplyContent('');
  };

  const handleClickChatBubble = (post) => {
    setIsModalOpen(true);
    setTargetPost(post);
  };

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
    await dispatch(addPostToPostsAction(data?.data?.data));
    // send socket notification
    // if (data?.data?.data?.postedBy?._id?.toString() === user?.id?.toString())
    //   return;
    // socket.emit('reply-notification-received', {
    //   data: data?.data?.data,
    //   user,
    // });
  }, [
    targetPost?._id,
    replyContent,
    dispatch,
    createReplyPostLoading,
    user,
    socket,
  ]);
  return (
    <ModalContainer
      header={'Reply'}
      onClose={handleCloseModal}
      submitButtonTitle={'Send Reply'}
      disabled={!replyContent.trim() || createReplyPostLoading}
      onSubmit={handleSendReply}
      loading={createReplyPostLoading}
    >
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
          <CreatePost
            source={userImage}
            username={user?.username}
            value={replyContent}
            disabled={!replyContent?.trim() || createReplyPostLoading}
            isInReplyMode={true}
            onChange={(e) => setReplyContent(e.target.value)}
            onClick={() => console.log(replyContent)}
          />
        </>
      )}
    </ModalContainer>
  );
};

export default ReplyModal;
