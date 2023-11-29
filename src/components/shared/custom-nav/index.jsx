import {
  IoLogoTwitter,
  IoHomeOutline,
  IoSearchOutline,
  IoNotificationsOutline,
  IoMailOutline,
  IoPersonOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import styles from './styles.module.css';
import CustomNavLink from '../custom-nav-link';
import { signoutHandler } from 'api/auth';
import { logoutAction } from 'redux-store/slices/user';

const CustomNav = ({ navStyles, navRef }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleSignout = async () => {
    const { err } = await signoutHandler();

    if (err) {
      console.log(err);
      return toast.error(err?.message);
    }
    dispatch(logoutAction());
    window.location.pathname = '/auth/signin';
  };
  return (
    <nav className={navStyles} ref={navRef}>
      <CustomNavLink path={'/'} styles={styles.navLink}>
        <IoLogoTwitter size={35} color="#1fa2f1" />
      </CustomNavLink>
      <CustomNavLink path={'/'} styles={styles.navLink}>
        <IoHomeOutline
          size={35}
          color={location?.pathname === '/' ? '#1fa2f1' : '#657786'}
        />
      </CustomNavLink>
      <CustomNavLink path={'/search'} styles={styles.navLink}>
        <IoSearchOutline
          size={35}
          color={location?.pathname === '/search' ? '#1fa2f1' : '#657786'}
        />
      </CustomNavLink>
      <CustomNavLink path={'/notifications'} styles={styles.navLink}>
        <IoNotificationsOutline
          size={35}
          color={
            location?.pathname === '/notifications' ? '#1fa2f1' : '#657786'
          }
        />
      </CustomNavLink>
      <CustomNavLink path={'/messages'} styles={styles.navLink}>
        <IoMailOutline
          size={35}
          color={location?.pathname === '/messages' ? '#1fa2f1' : '#657786'}
        />
      </CustomNavLink>
      <CustomNavLink path={'/account'} styles={styles.navLink}>
        <IoPersonOutline
          size={35}
          color={location?.pathname === '/account' ? '#1fa2f1' : '#657786'}
        />
      </CustomNavLink>
      <div className={styles.navLink} onClick={handleSignout}>
        <IoLogOutOutline size={35} />
      </div>
    </nav>
  );
};

export default CustomNav;
