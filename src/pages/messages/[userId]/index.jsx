/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

import MainLayout from 'components/shared/main-layout';
import { getChatByUserIdHandler } from 'api/chat';
import CustomLoader from 'components/shared/custom-loader';
import MessagesChat from 'components/messages/chat-layout';
import {
  makeEmptyActiveConversationAction,
  makeEmptyActiveConversationMessagesAction,
  setActiveConversationAction,
  setActiveConversationMessagesAction,
  updateActiveConversationAndItsMessagesAction,
} from 'redux-store/slices/chat';
import ChangeChatNameModal from 'components/shared/modals/change-chat-name';
import { getChatMessagesHandler } from 'api/messages';
import SocketContext from 'context/SocketContext';

const UserMessages = () => {
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState('');
  const [changeChatNameLoading, setChangeChatNameLoading] = useState(false);
  const [isChangeChatNameModalOpen, setIsChangeChatNameModalOpen] =
    useState(false);
  const [isActiveConversationSet, setIsActiveConversationSet] = useState(false);
  // const [conversationId, setConversationId] = useState();
  const [getMessagesLoading, setGetMessagesLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const socket = useContext(SocketContext);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation, messages } = useSelector((state) => state.chat);

  // user join to socket
  useEffect(() => {
    socket.emit('join', user?.id);

    return () => {};
  }, []);

  // typing / receive message
  useEffect(() => {
    socket.on('receive-message', (message) =>
      dispatch(updateActiveConversationAndItsMessagesAction(message))
    );

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop-typing', () => setIsTyping(false));

    return () => {};
  }, []);

  // get chat
  useEffect(() => {
    handleGetChatByUserId();

    return () => {
      handleMakeEmptyActiveConversation();
      handleMakeEmptyActiveConversationMessages();
    };
  }, [params?.userId]);

  // get chat messages
  useEffect(() => {
    if (isActiveConversationSet) handleGetChatMessages();

    return () => {};
  }, [activeConversation?._id, isActiveConversationSet]);

  const handleMakeEmptyActiveConversation = () =>
    dispatch(makeEmptyActiveConversationAction());

  const handleMakeEmptyActiveConversationMessages = () =>
    dispatch(makeEmptyActiveConversationMessagesAction());

  // const handleUpdateActiveConversationMessages = (message) =>
  //   dispatch(updateActiveConversationAndItsMessagesAction(message));

  const handleOpenChangeChatNameModal = () =>
    setIsChangeChatNameModalOpen(true);

  const handleGetChatByUserId = async () => {
    setLoading(true);
    const { err, data } = await getChatByUserIdHandler(
      params?.userId,
      user?.token
    );
    if (err) {
      console.log(err);
      setLoading(false);
      navigate('/');
      return toast.error(err?.message);
    }
    setLoading(false);
    setIsActiveConversationSet(true);
    // setConversationId(data?.data?.data?._id);
    dispatch(setActiveConversationAction(data?.data?.data));
  };

  const handleGetChatMessages = async () => {
    setGetMessagesLoading(true);
    const { err, data } = await getChatMessagesHandler(
      activeConversation?._id,
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
          isTyping={isTyping}
          socket={socket}
          setIsTyping={setIsTyping}
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
          setChatName={setChatName}
          setChangeChatNameLoading={setChangeChatNameLoading}
        />
      )}
    </MainLayout>
  );
};

export default UserMessages;
