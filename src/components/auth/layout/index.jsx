import styles from './styles.module.css';

const AuthLayout = ({ title, children }) => {
  return (
    <div className={styles.body}>
      <div className={styles.wrapper}>
        <div className={styles.loginContainer}>
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
