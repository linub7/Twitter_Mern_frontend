import styles from './styles.module.css';

const CreatePost = ({
  source,
  username,
  disabled = false,
  value,
  isInReplyMode = false,
  onChange = () => {},
  onClick = () => {},
}) => {
  return (
    <div className={styles.postFormContainer}>
      <div className={styles.userImageContainer}>
        <img src={source} alt={username} />
      </div>
      <div className={styles.textAreaContainer}>
        <textarea
          placeholder="What's happening?"
          onChange={onChange}
          value={value}
        />
        {!isInReplyMode && (
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={disabled}
              className={styles.submitPostButton}
              onClick={onClick}
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
