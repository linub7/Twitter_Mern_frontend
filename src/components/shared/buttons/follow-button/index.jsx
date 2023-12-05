import { IoCheckmarkCircleOutline  } from 'react-icons/io5';

import styles from './styles.module.css';

const FollowButton = ({ isFollowing = false, onClick = () => {} }) => {
  return (
    <button
      className={
        isFollowing
          ? `${styles.followButton} ${styles.following}`
          : styles.followButton
      }
      onClick={onClick}
    >
      {isFollowing ? 'Following' : 'Follow'}
      {isFollowing && <IoCheckmarkCircleOutline  size={20} />}
    </button>
  );
};

export default FollowButton;
