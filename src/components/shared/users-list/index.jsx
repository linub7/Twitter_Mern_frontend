import styles from './styles.module.css';
import UserItem from '../user-item';

const UsersList = ({
  users,
  loggedInUser,
  isShowFollowButton,
  handleToggleFollow = () => {},
}) => {
  return (
    <div className={styles.resultsContainer}>
      {users?.map((user) => (
        <UserItem
          key={user?._id}
          user={user}
          loggedInUser={loggedInUser}
          isShowFollowButton={isShowFollowButton}
          handleToggleFollow={handleToggleFollow}
        />
      ))}
    </div>
  );
};

export default UsersList;
