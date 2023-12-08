import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

import MainLayout from 'components/shared/main-layout';
import { getChatByUserIdHandler } from 'api/chat';
import CustomLoader from 'components/shared/custom-loader';

const UserMessages = () => {
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    handleGetChatByUserId();

    return () => {};
  }, [params?.userId]);

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

export default UserMessages;
