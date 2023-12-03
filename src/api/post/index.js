import client from 'api/client';

export const createPostHandler = async (values, token) => {
  try {
    const { data } = await client.post(
      `/posts`,
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

export const getPostsHandler = async (token) => {
  try {
    const { data } = await client.get(`/posts?sort=-createdAt`, {
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

export const getSinglePostAndRepliesHandler = async (id, token) => {
  try {
    const { data } = await client.get(`/posts/${id}`, {
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

export const deletePostHandler = async (id, token) => {
  try {
    const { data } = await client.delete(`/posts/${id}`, {
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

export const togglePostLikeHandler = async (id, token) => {
  try {
    const { data } = await client.put(
      `/posts/${id}/like`,
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

export const postRetweetHandler = async (id, token) => {
  try {
    const { data } = await client.put(
      `/posts/${id}/retweet`,
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
