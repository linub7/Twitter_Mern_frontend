import { useCallback, useState } from 'react';
import { IoPaperPlane } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import styles from './styles.module.css';
import MessagesChatLayoutChatImage from './header-image';
import { getChatName } from 'utils/helper';
import { sendMessageHandler } from 'api/messages';
import { addMessageToActiveConversationAction } from 'redux-store/slices/chat';
import MessagesSkeletons from 'components/shared/messages-skeletons';
import MessagesList from '../list';

const MessagesChat = ({
  conversation,
  loggedInUserId,
  token,
  getMessagesLoading = false,
  messages,
  onClick = () => {},
}) => {
  const [content, setContent] = useState('');
  const [sendMessageLoading, setSendMessageLoading] = useState(false);

  const dispatch = useDispatch();
  const chatPreName = getChatName(conversation, loggedInUserId);

  const handleSendMessage = useCallback(async () => {
    setSendMessageLoading(true);
    const values = { content, chatId: conversation?._id };
    const { err, data } = await sendMessageHandler(values, token);
    if (err) {
      console.log(err);
      setContent('');
      setSendMessageLoading(false);
      return toast.error(err?.message);
    }
    console.log(data?.data?.data);
    setContent('');
    setSendMessageLoading(false);
    await dispatch(addMessageToActiveConversationAction(data?.data?.data));
    // TODO: add socket
  }, [content, conversation?._id, token, dispatch]);

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
          <div className={styles.chatMessages}>
            {getMessagesLoading ? (
              <MessagesSkeletons />
            ) : (
              <MessagesList messages={messages} />
            )}
          </div>
          <div className={styles.footer}>
            <textarea
              className={styles.textArea}
              placeholder="Type a message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            {content && content?.trim() !== '' && (
              <button
                className={styles.sendMessageButton}
                onClick={handleSendMessage}
                disabled={!content || content?.trim() === ''}
              >
                {!sendMessageLoading ? (
                  <IoPaperPlane size={24} color="#1fa2f1" />
                ) : (
                  <ClipLoader size={24} color="#1fa2f1" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesChat;
