import client from 'api/client';

export const signupHandler = async (values) => {
  try {
    const { data } = await client.post(`/auth/signup`, { ...values });
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const signinHandler = async (values) => {
  try {
    const { data } = await client.post(`/auth/signin`, { ...values });
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const signoutHandler = async () => {
  try {
    const { data } = await client.get(`/auth/signout`);
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};

export const getMeHandler = async (replyToMode = '', token) => {
  try {
    const { data } = await client.get(`/auth/me?replyToMode=${replyToMode}`, {
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

export const updateProfilePhotoHandler = async (formData, token) => {
  try {
    const { data } = await client.put(`/auth/me`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data };
  } catch (error) {
    const { response } = error;
    return { err: response?.data };
  }
};
