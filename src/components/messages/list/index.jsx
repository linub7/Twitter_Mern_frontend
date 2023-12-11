import { useEffect, useRef } from 'react';
import NoResult from 'components/shared/no-result';
import MessagesListItem from './item';

const MessagesList = ({ messages, loggedInUserId, isTyping }) => {
  const endRef = useRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () =>
    endRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });

  return messages?.length < 1 ? (
    <NoResult title={'Nothing to show.'} />
  ) : (
    <>
      {messages?.map((message, index) => (
        <MessagesListItem
          key={message?._id}
          message={message}
          loggedInUserId={loggedInUserId}
          messages={messages}
          index={index}
        />
      ))}
      <div ref={endRef}></div>
    </>
  );
};

export default MessagesList;
