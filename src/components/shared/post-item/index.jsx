import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoRepeatOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { BsFillPinFill } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { getImageSource, timeDifference } from 'utils/helper';
import styles from './styles.module.css';
import { togglePostLikeHandler, postRetweetHandler } from 'api/post';
import {
  addPostToPostsAction,
  removePostAction,
  updatePostStatusAction,
} from 'redux-store/slices/post';
import PostItemHeader from './header';
import PostItemFooter from './footer';
import SocketContext from 'context/SocketContext';

const PostItem = ({
  userId,
  token,
  post,
  retweetedBy,
  isRetweetedPost,
  isInReplyMode = false,
  isShowHeaderRight = true,
  handleClickChatBubble = () => {},
  handleOpenWarningModal = () => {},
  handleOpenPostPinModal = () => {},
}) => {
  const { pathname } = useLocation();
  const potentialExistedPostId = pathname?.split('/')[2];

  const [isRetweeted, setIsRetweeted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postId = post?._id;

  const socket = useContext(SocketContext);
  const source = getImageSource(post?.postedBy?.profilePic?.url);
  const date = timeDifference(new Date(), new Date(post?.createdAt));

  const isLiked = post?.likes?.includes(userId);

  useEffect(() => {
    if (!post?.retweetUsers || post?.retweetUsers?.length < 1) return;
    for (const item of post.retweetUsers) {
      if (item?._id !== undefined) {
        item?._id === userId && setIsRetweeted(true);
      } else {
        item === userId && setIsRetweeted(true);
      }
    }

    return () => {
      setIsRetweeted(false);
    };
  }, [userId, post?.retweetUsers]);

  const handleNavigateToPostPage = () => navigate(`/posts/${postId}`);

  const handleClickRetweet = useCallback(async () => {
    const { err, data } = await postRetweetHandler(postId, token);
    if (err) {
      console.log(err);
      return toast.error(err?.message);
    }

    const {
      data: {
        data: { post, rePost, option },
      },
    } = data;
    // if option === '$addToSet' -> rePost added to posts
    if (option === '$addToSet') {
      const payload = {
        ...rePost,
        retweetData: post,
      };
      dispatch(addPostToPostsAction(payload));
    } else if (option === '$pull') {
      // if option === '$pull' -> rePost removed posts
      dispatch(removePostAction(rePost));
    }
    // update main post
    await dispatch(updatePostStatusAction(post));
    // send socket notification
    // if (
    //   data?.data?.data?.post?.postedBy?._id?.toString() === userId?.toString()
    // )
    //   return;
    // socket.emit('retweet-notification-received', {
    //   data: data?.data?.data,
    //   user: userId,
    // });
  }, [postId, dispatch, token, userId, socket]);

  const handleToggleLike = useCallback(async () => {
    const { err, data } = await togglePostLikeHandler(postId, token);
    if (err) {
      console.log(err);
      return toast.error(err?.message);
    }

    await dispatch(updatePostStatusAction(data?.data?.data));
    // send socket notification
    if (data?.data?.data?.postedBy?._id?.toString() === userId?.toString())
      return;
    socket.emit('like-notification-received', {
      data: data?.data?.data,
      user: userId,
    });
  }, [postId, dispatch, token, socket, userId]);

  return (
    <div
      className={`${styles.post} ${
        potentialExistedPostId === postId ? styles.activePost : ''
      }`}
    >
      {isRetweetedPost && (
        <div className={styles.postActionContainer}>
          <IoRepeatOutline size={15} />
          <span>
            Retweeted By{' '}
            <Link to={`/profile/${retweetedBy}`}>@{retweetedBy}</Link>
          </span>
        </div>
      )}

      <div className={styles.mainContentContainer}>
        <div className={styles.userImageContainer}>
          <img src={source} alt={post?.postedBy?.username} />
        </div>
        <div className={styles.postContentContainer}>
          {post?.pinned && (
            <div className={styles.pinnedPostText}>
              <BsFillPinFill size={12} color="#34495e" />
              <span>Pinned post</span>
            </div>
          )}
          <PostItemHeader
            date={date}
            post={post}
            userId={userId}
            isShowHeaderRight={isShowHeaderRight}
            handleOpenPostPinModal={handleOpenPostPinModal}
            handleOpenWarningModal={handleOpenWarningModal}
          />
          {post?.replyTo?._id && (
            <div className={styles.replyFlag}>
              Replying to{' '}
              <Link
                to={
                  post?.replyTo?.postedBy?._id === userId
                    ? `/profile`
                    : `/profile/${post?.replyTo?.postedBy?.username}`
                }
              >
                @{post?.replyTo?.postedBy?.username}
              </Link>
            </div>
          )}
          <div className={styles.postBody}>
            <span>{post?.content}</span>
          </div>
          {!isInReplyMode && !isRetweetedPost && (
            <PostItemFooter
              post={post}
              isLiked={isLiked}
              isRetweeted={isRetweeted}
              handleClickChatBubble={handleClickChatBubble}
              handleClickRetweet={handleClickRetweet}
              handleToggleLike={handleToggleLike}
            />
          )}
        </div>

        {!isInReplyMode &&
          !isRetweetedPost &&
          potentialExistedPostId !== postId && (
            <div
              onClick={handleNavigateToPostPage}
              className={styles.navigateButton}
            >
              <IoArrowForwardOutline color="#1fa2f1" size={20} />
            </div>
          )}
      </div>
    </div>
  );
};

export default PostItem;
