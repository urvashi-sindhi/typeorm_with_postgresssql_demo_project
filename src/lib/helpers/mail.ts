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
  const { first_name, last_name, email, phone_number, message } = obj;
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
