import { useDispatch } from 'react-redux';

import styles from './styles.module.css';
import { toggleSelectedUsersForGroupChatAction } from 'redux-store/slices/chat';

const NewMessagesSearchBar = ({
  groupChatUsers,
  placeholder,
  value,
  setSearchTerm = () => {},
  handleRemoveUserFromGroupChatUsers = () => {},
}) => {
  const dispatch = useDispatch();
  const handleChangeInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (
      groupChatUsers?.length > 0 &&
      value.length === 0 &&
      event.key === 'Backspace'
    ) {
      dispatch(
        toggleSelectedUsersForGroupChatAction(
          groupChatUsers[groupChatUsers?.length - 1]
        )
      );
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.searchBarContainer}>
        <span>To:</span>
        {groupChatUsers?.length > 0 && (
          <div className={styles.selectedUsersContainer}>
            {groupChatUsers?.map((user) => (
              <span
                key={user?._id}
                className={styles.selectedUser}
                onClick={() => handleRemoveUserFromGroupChatUsers(user)}
              >
                {user?.username}
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          value={value}
          className={styles.searchBox}
          placeholder={placeholder}
          onChange={handleChangeInput}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default NewMessagesSearchBar;
