export const user = {
  login: {
    email: 'admin@gmail.com',
    password: 'Admin@1234',
  },

  incorrectCredential: {
    email: 'admin@gmail.com',
    password: 'Admin@123',
  },

  incorrectEmail: {
    email: 'urvashi@gmail.com',
    password: 'Admin@123',
  },

  verifyEmail: {
    otp: 837673,
    email: 'admin@gmail.com',
    expiration_time: '2024-11-07T16:44:45+05:30',
  },

  updatePassword: {
    otp: 701612,
    email: 'admin@gmail.com',
    newPassword: 'Admin@1234',
    confirmPassword: 'Admin@1234',
  },

  otpExpired: {
    otp: 861438,
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
