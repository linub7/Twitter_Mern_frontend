import { useParams } from 'react-router-dom';

import MainLayout from 'components/shared/main-layout';

const UserMessages = () => {
  const params = useParams();
  return <MainLayout pageTitle={'Messages'}>{params?.id}</MainLayout>;
};

export default UserMessages;
