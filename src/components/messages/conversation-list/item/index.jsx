import { Link } from 'react-router-dom';

import styles from './styles.module.css';
import { getChatImageElements, getChatName } from 'utils/helper';

const MessagesConversationsListItem = ({ conversation, loggedInUserId }) => {
  const conversationName = getChatName(conversation, loggedInUserId);
  const images = getChatImageElements(conversation, loggedInUserId);
  const latestMessage = 'This is the latest message'; // TODO

  return (
    <Link
      to={`/messages/chat/${conversation?._id}`}
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
        <span className={styles.subText}>{latestMessage}</span>
      </div>
    </Link>
  );
};

export default MessagesConversationsListItem;
