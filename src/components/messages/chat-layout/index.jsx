import { IoPaperPlane } from 'react-icons/io5';

import styles from './styles.module.css';
import MessagesChatLayoutChatImage from './header-image';
import { getChatName } from 'utils/helper';

const MessagesChatLayout = ({
  conversation,
  loggedInUserId,
  children,
  onClick = () => {},
}) => {
  const chatPreName = getChatName(conversation, loggedInUserId);
  return (
    <div className={styles.chatPageContainer}>
      <div className={styles.chatTitleBarContainer}>
        <MessagesChatLayoutChatImage users={conversation?.users} />
        <span className={styles.chatName} onClick={onClick}>
          {conversation?.chatName ? conversation?.chatName : chatPreName}
        </span>
      </div>
      <div className={styles.mainContentContainer}>
        <div className={styles.chatContainer}>
          <div className={styles.chatMessages}>{children}</div>
          <div className={styles.footer}>
            <textarea
              className={styles.textArea}
              placeholder="Type a message..."
            ></textarea>
            <button className={styles.sendMessageButton}>
              <IoPaperPlane size={24} color="#1fa2f1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesChatLayout;
