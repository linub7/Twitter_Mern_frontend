import {
  IoChatbubbleOutline,
  IoHeartOutline,
  IoRepeatOutline,
} from 'react-icons/io5';
import PostItemFooterButton from '../footer-button';
import styles from './styles.module.css';

const PostItemFooter = ({
  post,
  isRetweeted = false,
  isLiked = false,
  handleToggleLike = () => {},
  handleClickChatBubble = () => {},
  handleClickRetweet = () => {},
}) => {
  return (
    <div className={styles.postFooter}>
      <div className={styles.postButtonContainer}>
        <PostItemFooterButton onClick={() => handleClickChatBubble(post)}>
          <IoChatbubbleOutline size={20} />
        </PostItemFooterButton>
      </div>
      <div
        className={`${styles.postButtonContainer} ${
          isRetweeted ? styles.activeRetweeted : undefined
        }`}
      >
        <PostItemFooterButton onClick={handleClickRetweet}>
          <IoRepeatOutline size={20} color={isRetweeted ? '#17bf63' : ''} />
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
            <span style={{ color: isLiked ? '#e22255' : '', fontSize: 14 }}>
              {post?.likes?.length}
            </span>
          )}
        </PostItemFooterButton>
      </div>
    </div>
  );
};

export default PostItemFooter;
