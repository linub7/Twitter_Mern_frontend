import client from 'api/client';

export const createChatHandler = async (values, token) => {
  try {
    const { data } = await client.post(
      `/chats`,
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

export const getChatsHandler = async (token) => {
  try {
    const { data } = await client.get(`/chats`, {
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

export const getChatHandler = async (id, token) => {
  try {
    const { data } = await client.get(`/chats/${id}`, {
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

export const getChatByUserIdHandler = async (id, token) => {
  try {
    const { data } = await client.get(`/chats/users/${id}`, {
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
