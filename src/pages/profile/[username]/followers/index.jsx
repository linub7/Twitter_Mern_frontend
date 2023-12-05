import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import { getUserFollowersHandler, toggleUserFollowHandler } from 'api/user';
import ProfilePageTabs from 'components/profile/tabs';
import CustomLoader from 'components/shared/custom-loader';
import MainLayout from 'components/shared/main-layout';
import NoResult from 'components/shared/no-result';
import UsersList from 'components/shared/users-list';
import { updateFollowingListAction } from 'redux-store/slices/user';

const UserProfileFollowers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userNotFoundError, setUserNotFoundError] = useState('');
  const [result, setResult] = useState({});

  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    handleGetUserFollowers();

    return () => {
      setResult({});
    };
  }, [params?.username]);

  const handleGetUserFollowers = async () => {
    setIsLoading(true);
    const { err, data } = await getUserFollowersHandler(
      params?.username,
      user?.token
    );
    if (err) {
      console.log(err);
      setUserNotFoundError(err?.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setResult(data?.data?.data);
  };

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
    <MainLayout pageTitle={`${params?.username} Followers`}>
      {isLoading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : userNotFoundError !== '' ? (
        <NoResult title={userNotFoundError} />
      ) : (
        <>
          <ProfilePageTabs
            colOneTitle={'Followers'}
            colTwoTitle={'Following'}
            activeTab={'Followers'}
            colOnePath={`/profile/${result?.username}/followers`}
            colTwoPath={`/profile/${result?.username}/following`}
          />
          {result?.followers?.length < 1 ? (
            <NoResult title={'Nothing to show.'} />
          ) : (
            <UsersList
              users={result?.followers}
              loggedInUser={user}
              isShowFollowButton={true}
              handleToggleFollow={handleToggleFollow}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default UserProfileFollowers;
