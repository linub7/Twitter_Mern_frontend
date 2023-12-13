import client from 'api/client';

export const sendMessageHandler = async (values, token) => {
  try {
    const { data } = await client.post(
      `/messages`,
      { ...values },
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

export const getChatMessagesHandler = async (id, token) => {
  try {
    const { data } = await client.get(`/messages/${id}`, {
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

export const getChatsUnreadMessagesHandler = async (token) => {
  try {
    const { data } = await client.get(`/chats/unread-messages`, {
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
