import { useNavigate } from 'react-router-dom';
import { LiaCommentMedicalSolid } from 'react-icons/lia';

import MainLayout from 'components/shared/main-layout';

const Messages = () => {
  const navigate = useNavigate();
  const handleClickActionIcon = () => navigate('/messages/new');
  return (
    <MainLayout
      pageTitle={'Inbox'}
      isShowActionSection={true}
      iconColor={'rgba(0,0,0,.6)'}
      Icon={LiaCommentMedicalSolid}
      handleClickActionIcon={handleClickActionIcon}
    ></MainLayout>
  );
};

export default Messages;
