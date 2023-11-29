import { useState } from 'react';

import AuthButton from 'components/auth/button';
import AuthInput from 'components/auth/input';
import AuthLayout from 'components/auth/layout';
import AuthRedirectLink from 'components/auth/redirect-link';
import CustomFormComponent from 'components/shared/custom-form';
import { registerValidation } from 'utils/validations/auth';

const Signup = () => {
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

  const handleChangeInput = (e) => {
    const {
      target: { value, name },
    } = e;
    setUser({ ...user, [name]: value });
  };

  const handleSignin = async () => {
    console.log({
      firstName,
      lastName,
      username,
      email,
      password,
      passwordConfirm,
    });
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
        onSubmit={handleSignin}
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
        <AuthButton btnTitle={'Sign up'} type={'submit'} />
      </CustomFormComponent>
      <AuthRedirectLink
        linkText={'Already have an account? Sign in'}
        path={'/auth/signin'}
      />
    </AuthLayout>
  );
};

export default Signup;
