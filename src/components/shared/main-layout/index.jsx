import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

import CustomNav from '../custom-nav';
import styles from './styles.module.css';
import { getNotificationCountsHandler } from 'api/notification';
import {
  setNewMessageNotificationsCountAction,
  setOtherNotificationsCountAction,
} from 'redux-store/slices/notification';

const MainLayout = ({
  isShowActionSection = false,
  pageTitle,
  Icon,
  iconColor,
  iconSize = 35,
  isLoading = false,
  children,
  handleClickActionIcon = () => {},
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const navRef = useRef();
  const mainRef = useRef();
  const thirdRef = useRef();
  const TL = gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'power4.out',
    },
  });

  useLayoutEffect(() => {
    TL.fromTo(navRef.current, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0 })
      .fromTo(
        thirdRef.current,
        { autoAlpha: 0, x: 20 },
        { autoAlpha: 1, x: 0 },
        '<'
      )
      .fromTo(
        mainRef.current,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0 },
        '-=0.5'
      );
    return () => {};
  }, []);

  useEffect(() => {
    handleGetNotificationCounts();
    return () => {};
  }, [user?.token]);

  const handleGetNotificationCounts = async () => {
    const { err, data } = await getNotificationCountsHandler(user?.token);
    if (err) {
      console.log(err);
      return toast.error(err?.message);
    }
    await dispatch(
      setNewMessageNotificationsCountAction(
        data?.data?.data?.newMessageNotificationsCount
      )
    );
    await dispatch(
      setOtherNotificationsCountAction(
        data?.data?.data?.otherNotificationsCount
      )
    );
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <CustomNav navStyles={styles.navContainer} navRef={navRef} />
        <div className={styles.mainSectionContainer} ref={mainRef}>
          <div className={styles.titleContainer}>
            <h1>{pageTitle}</h1>
            {isShowActionSection && (
              <>
                {isLoading ? (
                  <ClipLoader size={22} color="#1fa2f1" />
                ) : (
                  <span
                    onClick={handleClickActionIcon}
                    className={styles.actionIcon}
                  >
                    <Icon size={iconSize} color={iconColor} />
                  </span>
                )}
              </>
            )}
          </div>
          {children}
        </div>
        <div className={styles.thirdColumn} ref={thirdRef}>
          <span>thirdColumn</span>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
