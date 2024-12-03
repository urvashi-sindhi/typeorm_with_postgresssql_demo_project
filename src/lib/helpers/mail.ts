import * as nodemailer from 'nodemailer';
import { handleResponse } from './handleResponse';
import { HttpStatus, Logger } from '@nestjs/common';
import { Messages } from '../utils/messages';
import { ResponseStatus } from '../utils/enum';
import * as dotenv from 'dotenv';
dotenv.config();

const transporter: any = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export const emailSend = async (obj: any) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    message,
    otp,
    firstName,
    lastName,
    picture,
    id,
    username,
    displayName,
    photo,
    accessToken,
    accountType,
  } = obj;
  let mailOptions: any;

  if (email && first_name) {
    mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: Messages.SUBJECT,
      text: `${Messages.TEXT} 

            First Name: ${first_name}
            Last Name: ${last_name}
            Email: ${email}
            Phone Number: ${phone_number}
            Message: ${message}`,
    };
  }

  if (email && otp) {
    mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: Messages.OTP_SUBJECT,
      text: `${Messages.OTP_SUBJECT} is ${otp}`,
    };
  }

  if (email && picture) {
    mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: Messages.GOOGLE_SIGN_IN,
      text: `${Messages.EMAIL_TEXT} 

            First Name: ${firstName}
            Last Name: ${lastName}
            Email: ${email}
            Picture: ${picture}`,
    };
  }

  if (email && accessToken) {
    mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: Messages.FACEBOOK_SIGN_IN,
      text: `${Messages.EMAIL_TEXT} 

            First Name: ${firstName}
            Last Name: ${lastName}
            Email: ${email}`,
    };
  }

  if (id && username) {
    mailOptions = {
      from: process.env.EMAIL,
      to: 'urvashi.shivinfotech@gmail.com',
      subject: Messages.INSTAGRAM_SIGN_IN,
      text: `${Messages.EMAIL_TEXT} 

            Id: ${id}
            Username: ${username}
            Account Type: ${accountType}`,
    };
  }

  if (id && username && displayName) {
    mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: Messages.TWITTER_SIGN_IN,
      text: `${Messages.EMAIL_TEXT} 

            Id: ${id}
            Username: ${username}
            DisplayName: ${displayName}
            Email: ${email}
            photo: ${photo}`,
    };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    Logger.log('Email sent: ' + info.response);
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      'Email sent: ' + info.response,
    );
  } catch (error) {
    Logger.error('Failed to send email: ' + error.message);
    throw new Error('Email sending failed');
  }
};
