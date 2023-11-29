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
