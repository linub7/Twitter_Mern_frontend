import styles from './styles.module.css';

const NoResult = ({ title }) => {
  return <span className={styles.noResult}>{title}</span>;
};

export default NoResult;
