import { getImageSource } from 'utils/helper';
import styles from './styles.module.css';

const MessagesChatLayoutChatImage = ({ users }) => {
  const maxImagesToShow = 3;
  const remainingUsers = users?.length - maxImagesToShow;
  const renderGroupChatImage = () => {
    return users?.slice(0, maxImagesToShow).map((user, index) => {
      const source = getImageSource(user?.profilePic?.url);
      return (
        <img
          src={source}
          key={index}
          alt="profile"
          className={styles.groupChatImg}
        />
      );
    });
  };

  return (
    <div className={styles.chatImagesContainer}>
      {remainingUsers > 0 && (
        <div className={styles.userCount}>
          <span>+{remainingUsers}</span>
        </div>
      )}
      {renderGroupChatImage()}
    </div>
  );
};

export default MessagesChatLayoutChatImage;
