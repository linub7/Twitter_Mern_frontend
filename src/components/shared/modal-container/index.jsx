import { useEffect, useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import gsap from 'gsap';

import styles from './styles.module.css';

const ModalContainer = ({ header, children, onClose = () => {} }) => {
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
      </div>
    </div>
  );
};

export default ModalContainer;
