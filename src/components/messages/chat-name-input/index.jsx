import styles from './styles.module.css';

const ChangeNameInput = ({ value, onChange = () => {} }) => {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Chat name..."
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
};

export default ChangeNameInput;
