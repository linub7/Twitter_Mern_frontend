import { useEffect, useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import gsap from 'gsap';

import styles from './styles.module.css';

const ModalContainer = ({
  isShowModalFooter = true,
  header,
  disabled = true,
  submitButtonTitle,
  children,
  loading = false,
  onClose = () => {},
  onSubmit = () => {},
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { autoAlpha: 0, x: -10 },
      { autoAlpha: 1, x: 0 }
    );

    return () => {};
  }, []);

  return (
    <div className={styles.modalContainer} ref={modalRef}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{header}</h2>
          <span className={styles.modalCloseButton} onClick={onClose}>
            <IoCloseOutline />
          </span>
        </div>
        {children}
        {!loading && isShowModalFooter && (
          <div className={styles.modalFooter}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.replyButton}
              disabled={disabled}
              // disabled={!replyContent.trim() || createReplyPostLoading}
              onClick={onSubmit}
              // onClick={handleSendReply}
            >
              {submitButtonTitle}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalContainer;
