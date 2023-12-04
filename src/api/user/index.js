import client from 'api/client';

export const getUserHandler = async (replyToMode = '', username, token) => {
  try {
    const { data } = await client.get(
      `/users/${username}?replyToMode=${replyToMode}`,
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
