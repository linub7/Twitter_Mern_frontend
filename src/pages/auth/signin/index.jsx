import { useState } from 'react';

import AuthInput from 'components/auth/input';
import AuthLayout from 'components/auth/layout';
import CustomFormComponent from 'components/shared/custom-form';
import { loginValidation } from 'utils/validations/auth';
import AuthButton from 'components/auth/button';
import AuthRedirectLink from 'components/auth/redirect-link';

const Signin = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { email, password } = user;

  const handleChangeInput = (e) => {
    const {
      target: { value, name },
    } = e;
    setUser({ ...user, [name]: value });
  };

  const handleSignin = async () => {
    console.log({ email, password });
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
        <AuthButton btnTitle={'Sign in'} type={'submit'} />
      </CustomFormComponent>
      <AuthRedirectLink
        linkText={'Need an account? Register here.'}
        path={'/auth/signup'}
      />
    </AuthLayout>
  );
};

export default Signin;
