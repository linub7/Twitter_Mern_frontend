import { Link } from 'react-router-dom';
import {
  IoChatbubbleOutline,
  IoRepeatOutline,
  IoHeartOutline,
} from 'react-icons/io5';

import { getImageSource, timeDifference } from 'utils/helper';
import styles from './styles.module.css';
import PostItemFooterButton from './footer-button';

const PostItem = ({
  profilePicUrl,
  username,
  content,
  displayName,
  createdAt,
}) => {
  const source = getImageSource(profilePicUrl);
  const date = timeDifference(new Date(), new Date(createdAt));
  return (
    <div className={styles.post}>
      <div className={styles.mainContentContainer}>
        <div className={styles.userImageContainer}>
          <img src={source} alt={username} />
        </div>
        <div className={styles.postContentContainer}>
          <div className={styles.header}>
            <Link className={styles.displayName} to={`/profile/${username}`}>
              {displayName}
            </Link>
            <span className={styles.username}>@{username}</span>
            <span className={styles.date}>{date}</span>
          </div>
          <div className={styles.postBody}>
            <span>{content}</span>
          </div>
          <div className={styles.postFooter}>
            <div className={styles.postButtonContainer}>
              <PostItemFooterButton>
                <IoChatbubbleOutline size={20} />
              </PostItemFooterButton>
            </div>
            <div className={styles.postButtonContainer}>
              <PostItemFooterButton>
                <IoRepeatOutline size={20} />
              </PostItemFooterButton>
            </div>
            <div className={styles.postButtonContainer}>
              <PostItemFooterButton>
                <IoHeartOutline size={20} />
              </PostItemFooterButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
