import { Link, useNavigate } from 'react-router-dom';
import { IoMailOutline } from 'react-icons/io5';

import styles from './styles.module.css';
import FollowButton from 'components/shared/buttons/follow-button';

const ProfilePageHeader = ({
  profileDataId,
  currentUserId,
  username,
  userProfileSource,
  displayName,
  followingCount,
  followers,
  handleToggleUserFollow = () => {},
}) => {
  const navigate = useNavigate();
  const handleNavigateToUserMessages = () =>
    navigate(`/messages/${profileDataId}`);

  const isFollowing = followers?.includes(currentUserId);
  return (
    <div className={styles.profileHeaderContainer}>
      <div className={styles.coverPhotoContainer}>
        <div className={styles.userImageContainer}>
          <img src={userProfileSource} alt={username} />
        </div>
      </div>
      {profileDataId !== currentUserId ? (
        <div className={styles.profileButtonsContainer}>
          <button
            className={styles.profileButton}
            onClick={handleNavigateToUserMessages}
          >
            <IoMailOutline size={20} />
          </button>
          <FollowButton
            isFollowing={isFollowing}
            onClick={handleToggleUserFollow}
          />
        </div>
      ) : (
        <div className={styles.profileButtonsContainer}>
          {/* Because of styling -> we have to add empty div */}
        </div>
      )}
      <div className={styles.userDetailsContainer}>
        <span className={styles.displayName}>{displayName}</span>
        <span className={styles.username}>@{username}</span>
        <div className={styles.followingsContainer}>
          <Link to={`/profile/${username}/following`} className={styles.value}>
            <span className={styles.count}>{followingCount}</span>
            <span className={styles.text}>Following</span>
          </Link>

          <Link to={`/profile/${username}/followers`} className={styles.value}>
            <span className={styles.count}>{followers?.length}</span>
            <span className={styles.text}>Followers</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageHeader;
