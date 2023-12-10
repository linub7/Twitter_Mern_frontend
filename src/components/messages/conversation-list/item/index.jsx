import { Link } from 'react-router-dom';

import styles from './styles.module.css';
import {
  getChatImageElements,
  getChatName,
  getChatOtherUserId,
} from 'utils/helper';

const MessagesConversationsListItem = ({ conversation, loggedInUserId }) => {
  const conversationName = getChatName(conversation, loggedInUserId);
  const images = getChatImageElements(conversation, loggedInUserId);

  const chatOtherUserId = getChatOtherUserId(
    conversation?.users,
    loggedInUserId
  );

  return (
    <Link
      to={
        !conversation?.isGroup && conversation?.users?.length === 2
          ? `/messages/${chatOtherUserId}`
          : `/messages/chat/${conversation?._id}`
      }
      className={styles.listItem}
    >
      <div
        className={`${styles.resultsImageContainer} ${
          images?.length > 1 ? styles.groupChatImage : ''
        }`}
      >
        {images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={'profile'}
            className={styles.profilePic}
          />
        ))}
      </div>
      <div className={styles.resultDetailsContainer}>
        <span className={styles.heading}>{conversationName}</span>
        {conversation?.latestMessage && (
          <span className={styles.subText}>
            {conversation?.latestMessage?.sender?.username}:{' '}
            {conversation?.latestMessage?.content}
          </span>
        )}
      </div>
    </Link>
  );
};

export default MessagesConversationsListItem;
