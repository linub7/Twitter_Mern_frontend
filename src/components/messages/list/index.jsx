import NoResult from 'components/shared/no-result';

const MessagesList = ({ messages }) => {
  return (
    <div>
      {messages?.length < 1 ? (
        <NoResult title={'Nothing to show.'} />
      ) : (
        <div>{messages?.length}</div>
      )}
    </div>
  );
};

export default MessagesList;
