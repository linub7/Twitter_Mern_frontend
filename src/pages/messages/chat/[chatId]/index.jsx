import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import MainLayout from 'components/shared/main-layout';
import { getChatHandler } from 'api/chat';
import CustomLoader from 'components/shared/custom-loader';
import MessagesChatLayout from 'components/messages/chat-layout';
import { setActiveConversationAction } from 'redux-store/slices/chat';
import ChangeChatNameModal from 'components/shared/modals/change-chat-name';

const ChatMessages = () => {
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState('');
  const [changeChatNameLoading, setChangeChatNameLoading] = useState(false);
  const [isChangeChatNameModalOpen, setIsChangeChatNameModalOpen] =
    useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);

  const handleOpenChangeChatNameModal = () =>
    setIsChangeChatNameModalOpen(true);

  useEffect(() => {
    handleGetChat();

    return () => {};
  }, [params?.chatId]);

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
    dispatch(setActiveConversationAction(data?.data?.data));
  };

  return (
    <MainLayout pageTitle={'Chat'}>
      {loading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : (
        <MessagesChatLayout
          conversation={activeConversation}
          loggedInUserId={user?.id}
          onClick={handleOpenChangeChatNameModal}
        ></MessagesChatLayout>
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
