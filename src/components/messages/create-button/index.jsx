import { BeatLoader } from 'react-spinners';

import styles from './styles.module.css';

const NewMessageCreateChatButton = ({
  loading = false,
  btnTitle,
  disabled,
  onClick = () => {},
}) => {
  return (
    <div className={styles.container}>
      {!loading ? (
        <button disabled={disabled} onClick={onClick} className={styles.button}>
          {btnTitle}
        </button>
      ) : (
        <div className={styles.icon}>
          <BeatLoader color={'#9bd1f9'} />
        </div>
      )}
    </div>
  );
};

export default NewMessageCreateChatButton;
