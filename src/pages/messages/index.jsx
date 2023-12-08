import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LiaCommentMedicalSolid } from 'react-icons/lia';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import MainLayout from 'components/shared/main-layout';
import { getChatsHandler } from 'api/chat';
import { setConversationsAction } from 'redux-store/slices/chat';
import CustomLoader from 'components/shared/custom-loader';
import NoResult from 'components/shared/no-result';
import MessagesConversationsList from 'components/messages/conversation-list';

const Messages = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.chat);

  const navigate = useNavigate();
  const handleClickActionIcon = () => navigate('/messages/new');

  useEffect(() => {
    handleGetChats();

    return () => {};
  }, []);

  const handleGetChats = async () => {
    setLoading(true);
    const { err, data } = await getChatsHandler(user?.token);
    if (err) {
      console.log(err);
      setLoading(false);
      return toast.error(err?.message);
    }
    setLoading(false);
    console.log(data?.data?.data);
    dispatch(setConversationsAction(data?.data?.data));
  };

  return (
    <MainLayout
      pageTitle={'Inbox'}
      isShowActionSection={true}
      iconColor={'rgba(0,0,0,.6)'}
      Icon={LiaCommentMedicalSolid}
      handleClickActionIcon={handleClickActionIcon}
    >
      {loading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : (
        <>
          {conversations?.length < 1 ? (
            <NoResult title={'Nothing to show.'} />
          ) : (
            <MessagesConversationsList
              conversations={conversations}
              loggedInUserId={user?.id}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default Messages;
