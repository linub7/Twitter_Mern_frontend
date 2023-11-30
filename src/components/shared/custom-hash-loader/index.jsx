import HashLoader from 'react-spinners/HashLoader';

import styles from './styles.module.css';

const CustomHashLoader = ({ color = '#9bd1f9' }) => {
  return (
    <div className={styles.container}>
      <HashLoader color={color} />
    </div>
  );
};

export default CustomHashLoader;
