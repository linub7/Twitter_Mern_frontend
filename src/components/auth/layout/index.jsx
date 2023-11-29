import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import styles from './styles.module.css';

const AuthLayout = ({ title, children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { autoAlpha: 0, y: -100 },
      { autoAlpha: 1, y: 0, duration: 1 }
    );

    return () => {};
  }, []);
  return (
    <div className={styles.body}>
      <div className={styles.wrapper}>
        <div className={styles.loginContainer} ref={containerRef}>
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
