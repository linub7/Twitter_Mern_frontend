import client from 'api/client';

export const getNotificationsHandler = async (unreadOnly, token) => {
  try {
    const { data } = await client.get(
      `/notifications?unreadOnly=${unreadOnly}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const getNotificationCountsHandler = async (token) => {
  try {
    const { data } = await client.get(`/notifications/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const updateNotificationHandler = async (id, token) => {
  try {
    const { data } = await client.put(
      `/notifications/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const markAsOpenedAllNotificationHandler = async (token) => {
  try {
    const { data } = await client.put(
      `/notifications/opened-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};
