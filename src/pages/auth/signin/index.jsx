import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BounceLoader from 'react-spinners/BounceLoader';
import Cookie from 'js-cookie';
import toast from 'react-hot-toast';

import AuthInput from 'components/auth/input';
import AuthLayout from 'components/auth/layout';
import CustomFormComponent from 'components/shared/custom-form';
import { loginValidation } from 'utils/validations/auth';
import AuthButton from 'components/auth/button';
import AuthRedirectLink from 'components/auth/redirect-link';
import { signinHandler } from 'api/auth';
import { authenticationAction } from 'redux-store/slices/user';

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { email, password } = user;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const {
      target: { value, name },
    } = e;
    setUser({ ...user, [name]: value });
  };

  const handleSignin = async () => {
    setIsLoading(true);

    const values = {
      email,
      password,
    };
    const { err, data } = await signinHandler(values);
    if (err) {
      setIsLoading(false);
      console.log(err);
      return toast.error(err?.message);
    }
    Cookie.set('token', JSON.stringify(data?.token));
    setIsLoading(false);
    const payload = {
      id: data?.data?.user?._id,
      firstName: data?.data?.user?.firstName,
      lastName: data?.data?.user?.lastName,
      username: data?.data?.user?.username,
      email: data?.data?.user?.email,
      profilePic: data?.data?.user?.profilePic?.url,
      following: data?.data?.user?.following,
      followers: data?.data?.user?.followers,
      token: data?.token,
    };
    dispatch(authenticationAction(payload));
    toast.success('Signed in successfully 👌');
    navigate('/');
  };
  return (
    <AuthLayout title={'Login'}>
      <CustomFormComponent
        initialValues={{ email, password }}
        validationSchema={loginValidation}
        onSubmit={handleSignin}
      >
        <AuthInput
          type="email"
          name="email"
          value={email}
          icon={'email'}
          placeholder={'Enter Email Address'}
          onChange={handleChangeInput}
        />
        <AuthInput
          type="password"
          name="password"
          value={password}
          icon={'password'}
          placeholder={'Password'}
          onChange={handleChangeInput}
        />
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BounceLoader color="#9bd1f9" />
          </div>
        ) : (
          <AuthButton btnTitle={'Sign in'} type={'submit'} />
        )}
      </CustomFormComponent>
      <AuthRedirectLink
        linkText={'Need an account? Register here.'}
        path={'/auth/signup'}
      />
    </AuthLayout>
  );
};

export default Signin;
