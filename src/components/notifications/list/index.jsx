import NotificationsListItem from './item';

const NotificationsList = ({ notifications, token }) => {
  return notifications?.map((notification) => (
    <NotificationsListItem
      key={notification?._id}
      notification={notification}
      token={token}
    />
  ));
};

export default NotificationsList;
