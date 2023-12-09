import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

import MainLayout from 'components/shared/main-layout';
import { getChatByUserIdHandler } from 'api/chat';
import CustomLoader from 'components/shared/custom-loader';
import MessagesChatLayout from 'components/messages/chat-layout';
import { setActiveConversationAction } from 'redux-store/slices/chat';
import ChangeChatNameModal from 'components/shared/modals/change-chat-name';

const UserMessages = () => {
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

  useEffect(() => {
    handleGetChatByUserId();

    return () => {};
  }, [params?.userId]);

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
          setChatName={setChatName}
          setChangeChatNameLoading={setChangeChatNameLoading}
        />
      )}
    </MainLayout>
  );
};

export default UserMessages;
