import { Link } from 'react-router-dom';

import styles from './styles.module.css';

const AuthRedirectLink = ({ linkText, path }) => {
  return (
    <div className={styles.link}>
      <Link to={path}>{linkText}</Link>
    </div>
  );
};

export default AuthRedirectLink;
