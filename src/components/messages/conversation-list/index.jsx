import MessagesConversationsListItem from './item';
import styles from './styles.module.css';

const MessagesConversationsList = ({ conversations, loggedInUserId }) => {
  return (
    <div className={styles.conversationsListContainer}>
      {conversations?.map((conversation, index) => (
        <MessagesConversationsListItem
          key={conversation?._id}
          // key={index}
          conversation={conversation}
          loggedInUserId={loggedInUserId}
        />
      ))}
    </div>
  );
};

export default MessagesConversationsList;
