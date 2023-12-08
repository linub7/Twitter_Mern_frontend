import { useEffect, useState } from 'react';
import { IoCheckmarkOutline } from 'react-icons/io5';

import { getImageSource } from 'utils/helper';
import styles from './styles.module.css';

const NewMessagesUserItem = ({
  user,
  displayName,
  isShowIcon = false,
  groupChatUsers,
  onClick = () => {},
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const source = getImageSource(user?.profilePic?.url);

  useEffect(() => {
    const idx = groupChatUsers?.findIndex((el) => el?._id === user?._id);
    setIsChecked(idx !== -1 ? true : false);

    return () => {
      setIsChecked(false);
    };
  }, [groupChatUsers, user?._id]);

  return (
    <div className={styles.user} onClick={() => onClick(user)}>
      <div className={styles.userImageContainer}>
        <img src={source} alt={user?.username} />
      </div>
      <div className={styles.userDetailsContainer}>
        <div className={styles.header}>
          <span className={styles.displayName}>{displayName}</span>
          <span className={styles.username}>@{user?.username}</span>
        </div>
      </div>
      {isShowIcon && isChecked && (
        <div className={styles.iconContainer}>
          <IoCheckmarkOutline size={20} color="#1fa2f1" />
        </div>
      )}
    </div>
  );
};

export default NewMessagesUserItem;
