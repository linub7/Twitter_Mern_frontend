import { Link } from 'react-router-dom';

import styles from './styles.module.css';

const ProfilePageTabs = ({ username, colOneTitle, colTwoTitle, activeTab }) => {
  return (
    <div className={styles.container}>
      <Link
        to={`/profile/${username}`}
        className={`${styles.col} ${
          activeTab === colOneTitle ? styles?.active : ''
        }`}
      >
        <span className={styles.title}>{colOneTitle}</span>
      </Link>
      <Link
        to={`/profile/${username}/replies`}
        className={`${styles.col} ${
          activeTab === colTwoTitle ? styles?.active : ''
        }`}
      >
        <span className={styles.title}>{colTwoTitle}</span>
      </Link>
    </div>
  );
};

export default ProfilePageTabs;

// import styles from './styles.module.css';

// const ProfilePageTabs = ({
//   colOneTitle,
//   colTwoTitle,
//   activeTab,
//   setActiveTab = () => {},
// }) => {
//   return (
//     <div className={styles.container}>
//       <div
//         className={`${styles.col} ${
//           activeTab === colOneTitle ? styles?.active : ''
//         }`}
//       >
//         <span
//           className={styles.title}
//           onClick={() => setActiveTab(colOneTitle)}
//         >
//           {colOneTitle}
//         </span>
//       </div>
//       <div
//         className={`${styles.col} ${
//           activeTab === colTwoTitle ? styles?.active : ''
//         }`}
//       >
//         <span
//           className={styles.title}
//           onClick={() => setActiveTab(colTwoTitle)}
//         >
//           {colTwoTitle}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ProfilePageTabs;
