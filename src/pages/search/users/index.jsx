import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { BounceLoader } from 'react-spinners';

import ProfilePageTabs from 'components/profile/tabs';
import SearchBarContainer from 'components/search/search-bar-container';
import MainLayout from 'components/shared/main-layout';
import { searchUsersHandler, toggleUserFollowHandler } from 'api/user';
import CustomLoader from 'components/shared/custom-loader';
import NoResult from 'components/shared/no-result';
import UsersList from 'components/shared/users-list';
import { updateFollowingListAction } from 'redux-store/slices/user';

const SearchUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noResultFound, setNoResultFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      setUsers();
      if (!searchTerm || searchTerm === '') {
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
    };
  }, [searchTerm, user?.token]);

  const handleToggleFollow = useCallback(
    async (id) => {
      const { err, data } = await toggleUserFollowHandler(id, user?.token);

      if (err) {
        console.log(err);
        return toast.error(err?.message);
      }
      const payload = { userId: id, option: data?.data?.data?.option };
      dispatch(updateFollowingListAction(payload));
    },
    [user, dispatch]
  );

  return (
    <MainLayout pageTitle={'Search'}>
      <SearchBarContainer
        placeholder={'Search for users'}
        value={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ProfilePageTabs
        colOneTitle={'Posts'}
        colTwoTitle={'Users'}
        activeTab={'Users'}
        colOnePath={`/search`}
        colTwoPath={`/search/users`}
      />
      {loading && (
        <CustomLoader>
          <BounceLoader color={'#9bd1f9'} />
        </CustomLoader>
      )}

      {!loading && noResultFound && <NoResult title={'No Users Found.'} />}
      {users && !noResultFound && (
        <UsersList
          users={users}
          loggedInUser={user}
          isShowFollowButton={true}
          handleToggleFollow={handleToggleFollow}
        />
      )}
    </MainLayout>
  );
};

export default SearchUsers;
