import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getImageSource } from 'utils/helper';
import styles from './styles.module.css';
import { updateNotificationHandler } from 'api/notification';
import { decrementOtherNotificationsCountAction } from 'redux-store/slices/notification';

const NotificationsListItem = ({ notification, token }) => {
  const { userFrom } = notification;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userFromImageSource = getImageSource(userFrom?.profilePic?.url);
  const displayName = `${userFrom?.firstName} ${userFrom?.lastName}`;

  const text = `${
    notification?.notificationType === 'retweet'
      ? `${displayName} retweeted one of your post`
      : notification?.notificationType === 'postLike'
      ? `${displayName} liked one of your post`
      : notification?.notificationType === 'reply'
      ? `${displayName} replied to one of your post`
      : notification?.notificationType === 'follow'
      ? `${displayName} followed you`
      : ''
  }`;

  const handleClickOnNotificationItem = useCallback(async () => {
    const url =
      notification?.notificationType === 'retweet' ||
      notification?.notificationType === 'postLike' ||
      notification?.notificationType === 'reply'
        ? `/posts/${notification?.entityId}`
        : notification?.notificationType === 'follow'
        ? `/profile/${userFrom?.username}`
        : ``;

    if (!notification.opened) {
      const { err } = await updateNotificationHandler(notification?._id, token);
      if (err) {
        console.log(err);
        return;
      }
      await dispatch(decrementOtherNotificationsCountAction());
    }

    url !== `` && navigate(url);
  }, [
    notification?._id,
    notification?.entityId,
    notification?.notificationType,
    notification?.opened,
    userFrom?.username,
    token,
    navigate,
  ]);

  return (
    <div
      className={`${styles.listItem} ${
        !notification?.opened ? styles.openedListItem : ''
      }`}
      onClick={handleClickOnNotificationItem}
    >
      <div className={styles.resultsImageContainer}>
        <img
          src={userFromImageSource}
          alt={'profile'}
          className={styles.profilePic}
        />
      </div>
      <div className={styles.resultDetailsContainer}>
        <span className={styles.subText}>{text}</span>
      </div>
    </div>
  );
};

export default NotificationsListItem;
