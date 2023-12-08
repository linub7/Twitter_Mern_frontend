import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

import CustomNav from '../custom-nav';
import styles from './styles.module.css';

const MainLayout = ({
  isShowActionSection = false,
  pageTitle,
  Icon,
  iconColor,
  children,
  handleClickActionIcon = () => {},
}) => {
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
    TL.fromTo(navRef.current, { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0 })
      .fromTo(
        thirdRef.current,
        { autoAlpha: 0, x: 50 },
        { autoAlpha: 1, x: 0 },
        '<'
      )
      .fromTo(
        mainRef.current,
        { autoAlpha: 0, y: +10 },
        { autoAlpha: 1, y: 0 },
        '-=0.75'
      );
    return () => {};
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <CustomNav navStyles={styles.navContainer} navRef={navRef} />
        <div className={styles.mainSectionContainer} ref={mainRef}>
          <div className={styles.titleContainer}>
            <h1>{pageTitle}</h1>
            {isShowActionSection && (
              <span
                onClick={handleClickActionIcon}
                className={styles.actionIcon}
              >
                <Icon size={35} color={iconColor} />
              </span>
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
