import { useParams } from 'react-router-dom';

import MainLayout from 'components/shared/main-layout';

const ChatMessages = () => {
  const params = useParams();
  return (
    <MainLayout pageTitle={'Messages'}>chat messages{params?.id}</MainLayout>
  );
};

export default ChatMessages;
