import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IoChatbubbleOutline,
  IoRepeatOutline,
  IoHeartOutline,
  IoArrowForwardOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { BsPin } from 'react-icons/bs';

import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { getImageSource, timeDifference } from 'utils/helper';
import styles from './styles.module.css';
import PostItemFooterButton from './footer-button';
import { togglePostLikeHandler, postRetweetHandler } from 'api/post';
import {
  addPostToPostsAction,
  removePostAction,
  updatePostStatus,
} from 'redux-store/slices/post';

const PostItem = ({
  userId,
  token,
  post,
  retweetedBy,
  isRetweetedPost,
  isInReplyMode = false,
  handleClickChatBubble = () => {},
  handleOpenWarningModal = () => {},
}) => {
  const { pathname } = useLocation();
  const potentialExistedPostId = pathname?.split('/')[2];

  const [isRetweeted, setIsRetweeted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postId = post?._id;

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
    dispatch(updatePostStatus(post));
  }, [postId, dispatch, token]);

  const handleToggleLike = useCallback(async () => {
    const { err, data } = await togglePostLikeHandler(postId, token);
    if (err) {
      console.log(err);
      return toast.error(err?.message);
    }

    dispatch(updatePostStatus(data?.data?.data));
  }, [postId, dispatch, token]);

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
          <div className={styles.header}>
            <div className={styles.header__left}>
              <Link
                className={styles.displayName}
                // post?.replyTo?.postedBy?._id === userId
                //     ? `/profile`
                //     : `/profile/${post?.replyTo?.postedBy?.username}`
                to={
                  post?.postedBy?._id === userId
                    ? `/profile`
                    : `/profile/${post?.postedBy?.username}`
                }
              >
                {post?.postedBy?.firstName} {post?.postedBy?.lastName}
              </Link>
              <span className={styles.username}>
                @{post?.postedBy?.username}
              </span>
              <span className={styles.date}>{date}</span>
            </div>

            <div className={styles.header__right}>
              <PostItemFooterButton>
                <BsPin size={17} color="#34495e" />
              </PostItemFooterButton>
              {userId === post?.postedBy?._id && (
                <PostItemFooterButton
                  onClick={() => handleOpenWarningModal(post)}
                >
                  <IoCloseOutline size={17} color="#e22252" />
                </PostItemFooterButton>
              )}
            </div>
          </div>
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
            <div className={styles.postFooter}>
              <div className={styles.postButtonContainer}>
                <PostItemFooterButton
                  onClick={() => handleClickChatBubble(post)}
                >
                  <IoChatbubbleOutline size={20} />
                </PostItemFooterButton>
              </div>
              <div
                className={`${styles.postButtonContainer} ${
                  isRetweeted ? styles.activeRetweeted : undefined
                }`}
              >
                <PostItemFooterButton onClick={handleClickRetweet}>
                  <IoRepeatOutline
                    size={20}
                    color={isRetweeted ? '#17bf63' : ''}
                  />
                  {post?.retweetUsers?.length > 0 && (
                    <span
                      style={{
                        color: isRetweeted ? '#17bf63' : '',
                        fontSize: 14,
                      }}
                    >
                      {post?.retweetUsers?.length}
                    </span>
                  )}
                </PostItemFooterButton>
              </div>
              <div
                className={`${styles.postButtonContainer} ${
                  isLiked ? styles.activeLike : undefined
                }`}
              >
                <PostItemFooterButton onClick={handleToggleLike}>
                  <IoHeartOutline size={20} color={isLiked ? '#e22255' : ''} />
                  {post?.likes?.length > 0 && (
                    <span
                      style={{ color: isLiked ? '#e22255' : '', fontSize: 14 }}
                    >
                      {post?.likes?.length}
                    </span>
                  )}
                </PostItemFooterButton>
              </div>
            </div>
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
