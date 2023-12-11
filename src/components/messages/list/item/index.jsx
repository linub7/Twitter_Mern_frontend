import styles from './styles.module.css';

const MessagesListItem = ({ message, loggedInUserId, messages, index }) => {
  const lastSenderId = message?.sender?._id;
  const isMineMessage = lastSenderId === loggedInUserId;

  const prevSenderId = index === 0 ? null : messages[index - 1]?.sender?._id;
  const nextSenderId =
    index === messages?.length - 1 ? null : messages[index + 1]?.sender?._id;

  const isFirst =
    prevSenderId === null || prevSenderId !== message?.sender?._id;
  const isLast =
    index === messages?.length ||
    nextSenderId === null ||
    message?.sender?._id !== nextSenderId;

  const displayName = `${message?.sender?.firstName} ${message?.sender?.lastName}`;

  return (
    <li
      className={`${styles.message} ${
        isMineMessage ? styles.mine : styles.their
      } ${isFirst ? styles.first : ''} ${
        !isFirst && !isLast ? styles.middle : ''
      } ${isLast ? styles.last : ''}`}
    >
      <div className={styles.messageContainer}>
        {!isMineMessage && isFirst && (
          <span className={styles.senderName}>{displayName}</span>
        )}
        <div className={styles.contentContainer}>
          {!isMineMessage && isLast ? (
            <img
              src={message?.sender?.profilePic?.url}
              alt="profile"
              className={styles.theirProfileImage}
            />
          ) : (
            <div className={styles.theirProfileImage}></div>
          )}
          <span
            className={`${
              isMineMessage ? styles.mineMessageBody : styles.messageBody
            } ${
              isFirst && isMineMessage
                ? styles.firstMessageBody
                : isFirst && !isMineMessage
                ? styles.firstTheirMessageBody
                : ''
            } ${
              !isFirst && !isLast && isMineMessage
                ? styles.middleMessageBody
                : !isFirst && !isLast && !isMineMessage
                ? styles.middleTheirMessageBody
                : ''
            } ${
              isLast && isMineMessage
                ? styles.lastMessageBody
                : isLast && !isMineMessage
                ? styles.lastTheirMessageBody
                : ''
            }`}
          >
            {message?.content}
          </span>
        </div>
      </div>
    </li>
  );
};

export default MessagesListItem;
