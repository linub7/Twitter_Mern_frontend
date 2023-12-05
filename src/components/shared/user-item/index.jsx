import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.module.css';
import { getImageSource } from 'utils/helper';
import FollowButton from '../buttons/follow-button';

const UserItem = ({
  user,
  isShowFollowButton = false,
  loggedInUser,
  handleToggleFollow = () => {},
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const source = getImageSource(user?.profilePic?.url);
  const displayName = `${user?.firstName} ${user?.lastName}`;

  useEffect(() => {
    setIsFollowing(loggedInUser?.following?.includes(user?._id));
    return () => {
      setIsFollowing(false);
    };
  }, [user?._id, loggedInUser]);

  return (
    <div className={styles.user}>
      <div className={styles.userImageContainer}>
        <img src={source} alt={user?.username} />
      </div>
      <div className={styles.userDetailsContainer}>
        <div className={styles.header}>
          <Link
            to={`/profile/${user?.username}`}
            className={styles.displayName}
          >
            {displayName}
          </Link>
          <span className={styles.username}>@{user?.username}</span>
        </div>
      </div>
      {isShowFollowButton && user?._id !== loggedInUser?.id && (
        <FollowButton
          isFollowing={isFollowing}
          onClick={() => handleToggleFollow(user?._id)}
        />
      )}
    </div>
  );
};

export default UserItem;
