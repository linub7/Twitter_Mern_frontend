import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import MainLayout from 'components/shared/main-layout';
import { getChatHandler } from 'api/chat';
import CustomLoader from 'components/shared/custom-loader';
import MessagesChat from 'components/messages/chat-layout';
import {
  makeEmptyActiveConversationAction,
  makeEmptyActiveConversationMessagesAction,
  setActiveConversationAction,
  setActiveConversationMessagesAction,
} from 'redux-store/slices/chat';
import ChangeChatNameModal from 'components/shared/modals/change-chat-name';
import { getChatMessagesHandler } from 'api/messages';

const ChatMessages = () => {
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState('');
  const [changeChatNameLoading, setChangeChatNameLoading] = useState(false);
  const [isChangeChatNameModalOpen, setIsChangeChatNameModalOpen] =
    useState(false);
  const [isActiveConversationSet, setIsActiveConversationSet] = useState(false);
  const [conversationId, setConversationId] = useState();
  const [getMessagesLoading, setGetMessagesLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation, messages } = useSelector((state) => state.chat);

  const handleOpenChangeChatNameModal = () =>
    setIsChangeChatNameModalOpen(true);

  useEffect(() => {
    handleGetChat();

    return () => {
      handleMakeEmptyActiveConversation();
      handleMakeEmptyActiveConversationMessages();
    };
  }, [params?.chatId]);

  useEffect(() => {
    if (isActiveConversationSet) handleGetChatMessages();

    return () => {};
  }, [activeConversation?._id, isActiveConversationSet]);

  const handleMakeEmptyActiveConversation = () =>
    dispatch(makeEmptyActiveConversationAction());

  const handleMakeEmptyActiveConversationMessages = () =>
    dispatch(makeEmptyActiveConversationMessagesAction());

  const handleGetChat = async () => {
    setLoading(true);
    const { err, data } = await getChatHandler(params?.chatId, user?.token);
    if (err) {
      console.log(err);
      setLoading(false);
      navigate('/messages');
      return toast.error(err?.message);
    }
    setLoading(false);
    setIsActiveConversationSet(true);
    setConversationId(data?.data?.data?._id);
    dispatch(setActiveConversationAction(data?.data?.data));
  };

  const handleGetChatMessages = async () => {
    setGetMessagesLoading(true);
    const { err, data } = await getChatMessagesHandler(
      conversationId,
      user?.token
    );
    if (err) {
      console.log(err);
      setGetMessagesLoading(false);
      navigate('/');
      return toast.error(err?.message);
    }
    setGetMessagesLoading(false);
    dispatch(setActiveConversationMessagesAction(data?.data?.data));
  };

  return (
    <MainLayout pageTitle={'Chat'}>
      {loading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : (
        <MessagesChat
          conversation={activeConversation}
          loggedInUserId={user?.id}
          token={user?.token}
          messages={messages}
          getMessagesLoading={getMessagesLoading}
          onClick={handleOpenChangeChatNameModal}
        />
      )}

      {isChangeChatNameModalOpen && (
        <ChangeChatNameModal
          chatName={chatName}
          changeChatNameLoading={changeChatNameLoading}
          chatId={activeConversation?._id}
          token={user?.token}
          setIsModalOpen={setIsChangeChatNameModalOpen}
          setChangeChatNameLoading={setChangeChatNameLoading}
          setChatName={setChatName}
        />
      )}
    </MainLayout>
  );
};

export default ChatMessages;
