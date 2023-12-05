import { useState } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';

import AuthButton from 'components/auth/button';
import AuthInput from 'components/auth/input';
import AuthLayout from 'components/auth/layout';
import AuthRedirectLink from 'components/auth/redirect-link';
import CustomFormComponent from 'components/shared/custom-form';
import { registerValidation } from 'utils/validations/auth';
import { signupHandler } from 'api/auth';
import { authenticationAction } from 'redux-store/slices/user';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const { firstName, lastName, username, email, password, passwordConfirm } =
    user;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const {
      target: { value, name },
    } = e;
    setUser({ ...user, [name]: value });
  };

  const handleSignup = async () => {
    setIsLoading(true);

    const values = {
      firstName,
      lastName,
      username,
      email,
      password,
      passwordConfirm,
    };
    const { err, data } = await signupHandler(values);
    if (err) {
      setIsLoading(false);
      console.log(err);
      return err?.message === 'Duplicate fields value entered'
        ? toast.error('Email already is taken, please select another!')
        : toast.error(err?.message);
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
    toast.success('Signed up successfully 👌');
    navigate('/');
  };

  return (
    <AuthLayout title={'Register'}>
      <CustomFormComponent
        initialValues={{
          firstName,
          lastName,
          username,
          email,
          password,
          passwordConfirm,
        }}
        validationSchema={registerValidation}
        onSubmit={handleSignup}
      >
        <AuthInput
          type="text"
          name="firstName"
          value={firstName}
          icon={'user'}
          placeholder={'Enter First name'}
          onChange={handleChangeInput}
        />
        <AuthInput
          type="text"
          name="lastName"
          value={lastName}
          icon={'user'}
          placeholder={'Enter Last name'}
          onChange={handleChangeInput}
        />
        <AuthInput
          type="text"
          name="username"
          value={username}
          icon={'user'}
          placeholder={'Enter Username'}
          onChange={handleChangeInput}
        />
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
        <AuthInput
          type="password"
          name="passwordConfirm"
          value={passwordConfirm}
          icon={'passwordConfirm'}
          placeholder={'Password Confirm'}
          onChange={handleChangeInput}
        />
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BounceLoader color="#9bd1f9" />
          </div>
        ) : (
          <AuthButton btnTitle={'Sign up'} type={'submit'} />
        )}
      </CustomFormComponent>
      <AuthRedirectLink
        linkText={'Already have an account? Sign in'}
        path={'/auth/signin'}
      />
    </AuthLayout>
  );
};

export default Signup;
