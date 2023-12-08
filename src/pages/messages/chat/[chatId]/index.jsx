import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import MainLayout from 'components/shared/main-layout';
import { getChatHandler } from 'api/chat';
import CustomLoader from 'components/shared/custom-loader';

const ChatMessages = () => {
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

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
    console.log(data?.data?.data);
  };
  return (
    <MainLayout pageTitle={'Chat'}>
      {loading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : (
        <div>hi</div>
      )}
    </MainLayout>
  );
};

export default ChatMessages;
