import styles from './styles.module.css';

const CustomLoader = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default CustomLoader;
