export const user = {
  login: {
    email: 'admin@gmail.com',
    password: 'Admin@1234',
  },

  requiredValidation: {
    email: 'admin@gmail.com',
  },

  requiredValidationForForgotPassword: {
    email: 'admin@gmail.com',
    otp: 890890,
    confirmPassword: 'Admin@1234',
  },

  requiredValidationForResetPassword: {
    oldPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  checkValidationType: {
    email: 'admin@gmail.com',
    password: 12345,
  },

  checkValidationTypeForForgotPassword: {
    email: 'admin@gmail.com',
    otp: 890890,
    newPassword: 12345,
    confirmPassword: 'Admin@1234',
  },

  checkValidationTypeForResetPassword: {
    oldPassword: 'Admin@1234',
    newPassword: 12345,
    confirmPassword: 'Admin@1234',
  },

  checkEmailValidationFormat: {
    email: 'admin12gmail.com',
    password: 'Admin@1234'
  },

  checkEmailValidationFormatForForgotPassword: {
    email: 'admin12gmail.com',
    otp: 890890,
    newPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  incorrectCredential: {
    email: 'admin@gmail.com',
    password: 'Admin@123',
  },

  incorrectEmail: {
    email: 'urvashi@gmail.com',
    password: 'Admin@123',
  },

  checkValidationTypeForVerifyEmail: {
    email: 123,
  },

  verifyEmail: {
    otp: 837673,
    email: 'admin@gmail.com',
  },

  updatePassword: {
    otp: 701612,
    email: 'admin@gmail.com',
    newPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  otpExpired: {
    otp: 494352,
    email: 'admin@gmail.com',
    newPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  findOtp: {
    otp: 401811,
    email: 'admin@gmail.com',
    newPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  findEmail: {
    otp: 999255,
    email: 'admin1@gmail.com',
    newPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  resetPassword: {
    oldPassword: 'Admin@1234',
    newPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  oldPasswordValidation: {
    oldPassword: 'Admin@123',
    newPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  passwordValidation: {
    oldPassword: 'Admin@1234',
    newPassword: 'Admin@12345',
    confirmPassword: 'Admin@1234',
  },
};
