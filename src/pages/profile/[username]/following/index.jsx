import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HashLoader } from 'react-spinners';
import toast from 'react-hot-toast';

import MainLayout from 'components/shared/main-layout';
import { getUserFollowingHandler, toggleUserFollowHandler } from 'api/user';
import CustomLoader from 'components/shared/custom-loader';
import NoResult from 'components/shared/no-result';
import ProfilePageTabs from 'components/profile/tabs';
import UsersList from 'components/shared/users-list';
import { updateFollowingListAction } from 'redux-store/slices/user';
import SocketContext from 'context/SocketContext';

const UserProfileFollowing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userNotFoundError, setUserNotFoundError] = useState('');
  const [result, setResult] = useState({});

  const socket = useContext(SocketContext);
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    handleGetUserFollowing();

    return () => {
      setResult({});
    };
  }, [params?.username]);

  const handleGetUserFollowing = async () => {
    setIsLoading(true);
    const { err, data } = await getUserFollowingHandler(
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
      await dispatch(updateFollowingListAction(payload));
      // if (data?.data?.data?.user?._id?.toString() === user?.id?.toString())
      //   return;
      // socket.emit('follow-notification-received', {
      //   data: data?.data?.data,
      //   user,
      // });
    },
    [user, dispatch, socket]
  );

  return (
    <MainLayout pageTitle={`${params?.username} Following`}>
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
            activeTab={'Following'}
            colOnePath={`/profile/${result?.username}/followers`}
            colTwoPath={`/profile/${result?.username}/following`}
          />
          {result?.following?.length < 1 ? (
            <NoResult title={'Nothing to show.'} />
          ) : (
            <UsersList
              users={result?.following}
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

export default UserProfileFollowing;
