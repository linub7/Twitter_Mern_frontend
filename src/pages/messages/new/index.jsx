import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import NewMessagesSearchBar from 'components/messages/search-bar';
import MainLayout from 'components/shared/main-layout';
import NewMessageCreateChatButton from 'components/messages/create-button';
import { searchUsersHandler } from 'api/user';
import CustomLoader from 'components/shared/custom-loader';
import NoResult from 'components/shared/no-result';
import NewMessagesUserItem from 'components/messages/user-item';
import {
  makeEmptySelectedUsersForGroupChatAction,
  toggleSelectedUsersForGroupChatAction,
} from 'redux-store/slices/chat';
import { createChatHandler } from 'api/chat';

const NewMessage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noResultFound, setNoResultFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createChatLoading, setCreateChatLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { groupChatUsers } = useSelector((state) => state.chat);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      setUsers();
      if (!searchTerm || searchTerm?.trim() === '') {
        setUsers();
        setNoResultFound(false);
        return;
      }

      setLoading(true);
      const { err, data } = await searchUsersHandler(searchTerm, user?.token);
      if (err) {
        setLoading(false);
        console.log(err);
        return;
      }
      if (data?.status === 'success') {
        if (data?.data?.data?.length < 1) {
          setLoading(false);
          setNoResultFound(true);
        } else {
          setLoading(false);
          setNoResultFound(false);
          setUsers(data?.data?.data);
        }
      }
      return () => {
        setUsers();
      };
    }, 500);
    return () => {
      clearTimeout(delaySearch);
      handleEmptyGroupChatUsers();
    };
  }, [searchTerm, user?.token]);

  const handleEmptyGroupChatUsers = () =>
    dispatch(makeEmptySelectedUsersForGroupChatAction());

  const handleAddToSelectedUsers = (user) => {
    dispatch(toggleSelectedUsersForGroupChatAction(user));
  };

  const handleRemoveGroupChatUsers = (user) => {
    dispatch(toggleSelectedUsersForGroupChatAction(user));
  };

  const handleCreateChat = useCallback(async () => {
    const userIds = [];
    for (const item of groupChatUsers) {
      userIds.push(item?._id);
    }
    const values = { users: userIds };
    setCreateChatLoading(true);
    const { err, data } = await createChatHandler(values, user?.token);
    if (err) {
      console.log(err);
      setCreateChatLoading(false);
      return toast.error(err?.message);
    }
    setCreateChatLoading(false);
    handleEmptyGroupChatUsers();
    navigate(`/messages/chat/${data?.data?.data?._id}`);
  }, [groupChatUsers, user?.token, navigate]);

  return (
    <MainLayout pageTitle={'New Message'}>
      <NewMessagesSearchBar
        placeholder={'Type name of the person'}
        value={searchTerm}
        groupChatUsers={groupChatUsers}
        setSearchTerm={setSearchTerm}
        handleRemoveUserFromGroupChatUsers={handleRemoveGroupChatUsers}
      />
      {loading && (
        <CustomLoader>
          <BounceLoader color={'#9bd1f9'} />
        </CustomLoader>
      )}

      {!loading && noResultFound && <NoResult title={'No Users Found.'} />}
      {users && !noResultFound && (
        <>
          {users?.map((user) => (
            <NewMessagesUserItem
              key={user?._id}
              user={user}
              displayName={`${user?.firstName} ${user?.lastName}`}
              groupChatUsers={groupChatUsers}
              isShowIcon={true}
              onClick={handleAddToSelectedUsers}
            />
          ))}
        </>
      )}
      {groupChatUsers?.length > 0 && (
        <NewMessageCreateChatButton
          loading={createChatLoading}
          btnTitle={'Create Chat'}
          disabled={createChatLoading || groupChatUsers?.length < 1}
          onClick={handleCreateChat}
        />
      )}
    </MainLayout>
  );
};

export default NewMessage;
