import { Link } from 'react-router-dom';

import styles from './styles.module.css';
import notFoundImage from 'assets/images/404.jpg';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <img src={notFoundImage} alt="not-found" className={styles.img} />
      <div>
        <div className={styles.text}>Page not Found</div>
        <div className={styles.link}>
          <Link to={'/'}>Back to home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
