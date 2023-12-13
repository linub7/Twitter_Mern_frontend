import { useCallback, useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import CustomLoader from 'components/shared/custom-loader';
import MainLayout from 'components/shared/main-layout';
import {
  getNotificationsHandler,
  markAsOpenedAllNotificationHandler,
} from 'api/notification';
import NotificationsList from 'components/notifications/list';
import NoResult from 'components/shared/no-result';
import { makeNullOtherNotificationsCountAction } from 'redux-store/slices/notification';

const Notifications = () => {
  const [loading, setLoading] = useState(false);
  const [markedAllLoading, setMarkedAllLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isShowMarkedAllIcon, setIsShowMarkedAllIcon] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    handleGetNotifications();

    return () => {
      setNotifications([]);
    };
  }, []);

  useEffect(() => {
    if (!notifications) return;
    if (notifications?.length < 1) setIsShowMarkedAllIcon(false);
    else {
      setIsShowMarkedAllIcon(
        notifications?.find((item) => !item?.opened) !== undefined
          ? true
          : false
      );
    }

    return () => {};
  }, [notifications]);

  const handleGetNotifications = async () => {
    setLoading(true);

    const { err, data } = await getNotificationsHandler(undefined, user?.token);
    if (err) {
      console.log(err);
      setLoading(false);
      return toast?.error(err?.message);
    }
    setLoading(false);
    setNotifications(data?.data?.data);
  };

  const handleMarkAsOpenedAllNotification = useCallback(async () => {
    setMarkedAllLoading(true);
    const { err } = await markAsOpenedAllNotificationHandler(user?.token);
    if (err) {
      console.log(err);
      setMarkedAllLoading(false);
      return toast.error(err?.message);
    }
    setMarkedAllLoading(false);
    const tmpNots = [...notifications];
    for (const el of tmpNots) {
      el.opened = true;
    }
    setNotifications(tmpNots);
    await dispatch(makeNullOtherNotificationsCountAction());
  }, [user?.token, notifications, dispatch]);

  return (
    <MainLayout
      pageTitle={'Notifications'}
      isShowActionSection={isShowMarkedAllIcon}
      iconColor={'#1fa2f1'}
      iconSize={25}
      isLoading={markedAllLoading}
      Icon={IoCheckmarkDoneOutline}
      handleClickActionIcon={handleMarkAsOpenedAllNotification}
    >
      {loading ? (
        <CustomLoader>
          <HashLoader color={'#9bd1f9'} />
        </CustomLoader>
      ) : notifications?.length === 0 ? (
        <NoResult title={'Nothing to show.'} />
      ) : (
        <NotificationsList notifications={notifications} token={user?.token} />
      )}
    </MainLayout>
  );
};

export default Notifications;
