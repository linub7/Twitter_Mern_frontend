import { createRef, useCallback, useRef, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { IoAttachOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import styles from './styles.module.css';
import CustomLoader from 'components/shared/custom-loader';
import ModalContainer from '../modal-container';
import { IMAGE_TYPES } from 'constants';
import AttachmentInput from 'components/shared/inputs/attachment';
import { IMAGE_SIZE } from 'constants';
import { dataURLtoFile } from 'utils/helper';
import { updateCoverPhotoHandler } from 'api/auth';
import { authenticationAction } from 'redux-store/slices/user';
import CustomCropper from 'components/shared/custom-cropper';

const UploadCoverPhotoModal = ({
  loading = true,
  user,
  setUploadCoverPhotoLoading = () => {},
  setIsUploadCoverPhotoModalOpen = () => {},
}) => {
  const [photo, setPhoto] = useState();
  const [cropData, setCropData] = useState('#');
  const [isShowModalFooter, setIsShowModalFooter] = useState(false);

  const inputRef = useRef();
  const cropperRef = createRef();
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setIsUploadCoverPhotoModalOpen(false);
    setPhoto({});
  };

  const handleOpen = () => inputRef.current.click();

  const handleChange = (e) => {
    let file = e.target.files[0];
    if (
      file?.type !== 'image/png' &&
      file?.type !== 'image/jpg' &&
      file?.type !== 'image/jpeg' &&
      file?.type !== 'image/webp' &&
      file?.type !== 'image/gif'
    ) {
      return toast.error('OOPS! Please choose image');
    }

    if (file?.size >= IMAGE_SIZE * 1024 * 1024) {
      return toast.error(`OOPS! Please select image less than ${IMAGE_SIZE}MB`);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setPhoto({ file, imgData: e.target.result });
    };
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      setIsShowModalFooter(true);
    }
  };

  const handleSendImage = useCallback(async () => {
    const file = dataURLtoFile(cropData, photo?.file?.name);
    const formData = new FormData();
    formData.append('coverPhoto', file);
    setUploadCoverPhotoLoading(true);
    const { err, data } = await updateCoverPhotoHandler(formData, user?.token);
    if (err) {
      console.log(err);
      setUploadCoverPhotoLoading(false);
      return toast.error(err?.message);
    }
    setUploadCoverPhotoLoading(false);
    setIsUploadCoverPhotoModalOpen(false);
    setPhoto({});
    const { token, ...rest } = user;
    const payload = { token, ...data?.data?.data };
    dispatch(authenticationAction(payload));
  }, [cropData, photo?.file, user, dispatch]);

  return (
    <ModalContainer
      header={'Upload cover photo'}
      onClose={handleCloseModal}
      submitButtonTitle={'Upload My Cover Photo'}
      disabled={loading}
      onSubmit={handleSendImage}
      loading={loading}
      isShowModalFooter={isShowModalFooter}
    >
      {loading ? (
        <CustomLoader>
          <BounceLoader color="#9bd1f9" />
        </CustomLoader>
      ) : (
        <>
          {photo?.imgData ? (
            <div className={styles.imagePreviewContainer}>
              <CustomCropper
                cropperRef={cropperRef}
                src={photo?.imgData}
                initialAspectRatio={16 / 9}
              />
              {!isShowModalFooter && (
                <button onClick={getCropData} className={styles.cropButton}>
                  Crop
                </button>
              )}
            </div>
          ) : (
            <>
              <span onClick={handleOpen} className={styles.attachIconContainer}>
                <IoAttachOutline size={40} color="#1fa2f1" />
              </span>
              <AttachmentInput
                inputRef={inputRef}
                accept={IMAGE_TYPES}
                handleChange={handleChange}
              />
            </>
          )}
        </>
      )}
    </ModalContainer>
  );
};

export default UploadCoverPhotoModal;
