import { Link } from 'react-router-dom';

const CustomNavLink = ({ path, styles, children }) => {
  return (
    <Link className={styles} to={path}>
      {children}
    </Link>
  );
};

export default CustomNavLink;
