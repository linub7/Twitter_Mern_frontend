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
    </button>
  );
};

export default FollowButton;
