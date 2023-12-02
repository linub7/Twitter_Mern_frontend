import styles from './styles.module.css';

const PostItemFooterButton = ({ children, onClick = () => {} }) => {
  return (
    <button className={styles.container} onClick={onClick}>
      {children}
    </button>
  );
};

export default PostItemFooterButton;
