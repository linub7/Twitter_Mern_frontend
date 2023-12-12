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
import typingDots from 'assets/images/dots.gif';

const MessagesChat = ({
  conversation,
  loggedInUserId,
  token,
  getMessagesLoading = false,
  messages,
  isTyping = false,
  socket,
  onClick = () => {},
  setIsTyping = () => {},
}) => {
  const [content, setContent] = useState('');
  const [sendMessageLoading, setSendMessageLoading] = useState(false);

  const dispatch = useDispatch();
  const chatPreName = getChatName(conversation, loggedInUserId);

  const handleChangeInput = (e) => {
    setContent(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', conversation?._id);
    }
    const lastTypingTime = new Date().getTime(); // getTime() returns in ms
    const timer = 3000;
    setTimeout(() => {
      const now = new Date().getTime();
      if (now - lastTypingTime >= timer && isTyping) {
        socket.emit('stop-typing', conversation?._id);
        setIsTyping(false);
      }
    }, timer);
  };

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

    setContent('');
    setSendMessageLoading(false);
    socket.emit('send-message', data?.data?.data);

    await dispatch(addMessageToActiveConversationAction(data?.data?.data));
  }, [content, conversation?._id, token, dispatch, socket]);

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
          <ul className={`${styles.chatMessages} ${styles.customScrollbar}`}>
            {getMessagesLoading ? (
              <MessagesSkeletons />
            ) : (
              <MessagesList
                messages={messages}
                loggedInUserId={loggedInUserId}
                isTyping={isTyping}
              />
            )}
          </ul>
          {isTyping && (
            <div className={styles.typingDots}>
              <img src={typingDots} alt="dots" />
            </div>
          )}
          <div className={styles.footer}>
            <textarea
              className={styles.textArea}
              placeholder="Type a message..."
              value={content}
              onChange={handleChangeInput}
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
