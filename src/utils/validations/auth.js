import * as Yup from 'yup';

export const loginValidation = Yup.object({
  email: Yup.string()
    .required('Email Address is required.')
    .email('Please enter a valid email address.'),
  password: Yup.string()
    .required('Password is required.')
    .min(8, 'Password must be at least 8 character'),
});

export const registerValidation = Yup.object({
  firstName: Yup.string()
    .required('What is your first name?')
    .min(2, 'First Name must be between 2 and 16 characters.')
    .max(16, 'First Name must be between 2 and 16 characters.')
    .matches(/^[aA-zZ]/, 'Number and special characters are not allowed'),
  lastName: Yup.string()
    .required('What is your last name?')
    .min(2, 'Last Name must be between 2 and 16 characters.')
    .max(16, 'Last Name must be between 2 and 16 characters.')
    .matches(/^[aA-zZ]/, 'Number and special characters are not allowed'),
  username: Yup.string()
    .required('What is your username?')
    .min(2, 'username must be between 2 and 16 characters.')
    .max(16, 'username must be between 2 and 16 characters.'),
  email: Yup.string()
    .required('Email Address is required.')
    .email('Please enter a valid email address.'),
  password: Yup.string()
    .required('Password is required.')
    .min(8, 'Password must be between 8 and 25 characters')
    .max(25, 'Password must be between 8 and 25 characters'),
  passwordConfirm: Yup.string()
    .required('Password Confirmation is required.')
    .oneOf([Yup.ref('password')], 'Password must match.'),
});

export const forgotPasswordValidation = Yup.object({
  email: Yup.string()
    .required('Email Address is required.')
    .email('Please enter a valid email address.'),
});

export const changePasswordValidation = Yup.object({
  currentPassword: Yup.string()
    .required('Current Password is required.')
    .min(8, 'Current Password must be between 8 and 25 characters')
    .max(25, 'Current Password must be between 8 and 25 characters'),
  password: Yup.string()
    .required('Password is required.')
    .min(8, 'Password must be between 8 and 25 characters')
    .max(25, 'Password must be between 8 and 25 characters'),
  passwordConfirm: Yup.string()
    .required('Password Confirmation is required.')
    .oneOf([Yup.ref('password')], 'Password must match.'),
});

export const resetPasswordValidation = Yup.object({
  password: Yup.string()
    .required('Password is required.')
    .min(8, 'Password must be between 8 and 25 characters')
    .max(25, 'Password must be between 8 and 25 characters'),
  passwordConfirm: Yup.string()
    .required('Password Confirmation is required.')
    .oneOf([Yup.ref('password')], 'Password must match.'),
});
