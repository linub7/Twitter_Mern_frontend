import { BounceLoader } from 'react-spinners';

import CustomLoader from '../../custom-loader';
import ModalContainer from '../modal-container';

const WarningModal = ({
  loading = false,
  setIsWarningModalOpen = () => {},
  setTargetPost = () => {},
  onSubmit = () => {},
}) => {
  const handleCloseModal = () => {
    setIsWarningModalOpen(false);
    setTargetPost(null);
  };

  return (
    <ModalContainer
      header={'Warning'}
      onClose={handleCloseModal}
      submitButtonTitle={"Yes I'm sure"}
      disabled={loading}
      onSubmit={onSubmit}
      loading={loading}
    >
      {loading ? (
        <CustomLoader>
          <BounceLoader color="#9bd1f9" />
        </CustomLoader>
      ) : (
        <>
          <h1>Are you Sure?</h1>
        </>
      )}
    </ModalContainer>
  );
};

export default WarningModal;
