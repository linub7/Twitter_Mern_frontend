import { IoArrowForwardOutline } from 'react-icons/io5';

import styles from './styles.module.css';

const AuthButton = ({ btnTitle, type }) => {
  return (
    <button type={type} className={styles.button}>
      {btnTitle}
      <div className={styles.svg__wrap}>
        <IoArrowForwardOutline />
      </div>
    </button>
  );
};

export default AuthButton;
