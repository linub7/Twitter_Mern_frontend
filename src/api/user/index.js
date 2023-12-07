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

export const getUserFollowingHandler = async (username, token) => {
  try {
    const { data } = await client.get(`/users/${username}/following`, {
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

export const getUserFollowersHandler = async (username, token) => {
  try {
    const { data } = await client.get(`/users/${username}/followers`, {
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

export const toggleUserFollowHandler = async (id, token) => {
  try {
    const { data } = await client.put(
      `/users/${id}/follow`,
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

export const searchUsersHandler = async (query, token) => {
  try {
    const { data } = await client.get(`/users/search?name=${query}`, {
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
