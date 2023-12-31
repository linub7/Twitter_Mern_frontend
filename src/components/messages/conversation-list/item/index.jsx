import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';
import {
  getChatImageElements,
  getChatName,
  getChatOtherUserId,
} from 'utils/helper';
import SocketContext from 'context/SocketContext';
import { setActiveConversationAction } from 'redux-store/slices/chat';
import { decrementUnreadMessagesCountAction } from 'redux-store/slices/notification';

const MessagesConversationsListItem = ({ conversation, loggedInUserId }) => {
  const conversationName = getChatName(conversation, loggedInUserId);
  const images = getChatImageElements(conversation, loggedInUserId);

  const chatOtherUserId = getChatOtherUserId(
    conversation?.users,
    loggedInUserId
  );

  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();

  const handleNavigate = async () => {
    socket.emit('join-conversation', conversation?._id);
    await dispatch(setActiveConversationAction(conversation));
    if (
      conversation?.latestMessage?.sender?._id?.toString() !==
      loggedInUserId?.toString()
    ) {
      await dispatch(decrementUnreadMessagesCountAction());
    }
    navigate(
      !conversation?.isGroup && conversation?.users?.length === 2
        ? `/messages/${chatOtherUserId}`
        : `/messages/chat/${conversation?._id}`
    );
  };

  return (
    <div
      className={`${styles.listItem} ${
        conversation?.latestMessage?.sender?._id?.toString() !==
          loggedInUserId?.toString() &&
        !conversation?.latestMessage?.readBy?.includes(loggedInUserId)
          ? styles.openedListItem
          : ''
      }`}
      onClick={handleNavigate}
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
        {conversation?.latestMessage ? (
          <span className={styles.subText}>
            {conversation?.latestMessage?.sender?.username}:{' '}
            {conversation?.latestMessage?.content}
          </span>
        ) : (
          <span className={styles.subText}>New Chat</span>
        )}
      </div>
    </div>
  );
};

export default MessagesConversationsListItem;
