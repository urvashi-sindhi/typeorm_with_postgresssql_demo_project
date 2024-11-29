import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ResponseStatus, Token } from '../lib/utils/enum';
import { Messages } from '../lib/utils/messages';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../lib/entities/user.entity';
import { Otp } from '../lib/entities/otp.entity';
import { JwtStrategy } from '../lib/services/auth/strategy/jwt.strategy';
import { user } from './userVariable';
import { UserModule } from './user.module';
import { AppModule } from '../app.module';
import * as request from 'supertest';
import * as chai from 'chai';

const expect = chai.expect;

describe('UserController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let otp: number;
  let server: any;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        UserModule,
        AppModule,
        TypeOrmModule.forFeature([User, Otp]),
        JwtModule.register({
          secret: process.env.JWTSecretKey,
          signOptions: { expiresIn: '24h' },
        }),
      ],
      controllers: [UserController],
      providers: [UserService, JwtStrategy],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/admin/login', () => {
    it('should be give validation error if pass empty payload ', async () => {
      const login = await request(server)
        .post('/admin/login')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(login.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(login.body.message).to.deep.equal([
        'email should not be empty',
        'email must be a string',
        'email must be an email',
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should be give validation error if password is not valid type', async () => {
      const createInquiry = await request(server)
        .post('/admin/login')
        .send(user.checkValidationType)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(createInquiry.body.message).to.deep.equal([
        'password must be a string',
      ]);
    });

    it('should be give validation error if email is not valid format', async () => {
      const createInquiry = await request(server)
        .post('/admin/login')
        .send(user.checkEmailValidationFormat)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(createInquiry.body.message).to.deep.equal([
        'email must be an email',
      ]);
    });

    it('should be give required validation error if password is not provide', async () => {
      const createInquiry = await request(server)
        .post('/admin/login')
        .send(user.requiredValidation)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(createInquiry.body.message).to.deep.equal([
        'password should not be empty',
        'password must be a string',
      ]);
    });

    it('should be give error message credential does not match ', async () => {
      const login = await request(server)
        .post('/admin/login')
        .send(user.incorrectCredential)
        .expect(HttpStatus.OK);

      expect(login.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(login.body.status).to.equal(ResponseStatus.ERROR);
      expect(login.body.message).to.include(Messages.CREDENTIALS_NOT_MATCH);
    });

    it('should be give error message credential does not match when email is incorrect ', async () => {
      const login = await request(server)
        .post('/admin/login')
        .send(user.incorrectEmail)
        .expect(HttpStatus.OK);

      expect(login.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(login.body.status).to.equal(ResponseStatus.ERROR);
      expect(login.body.message).to.include(Messages.CREDENTIALS_NOT_MATCH);
    });

    it('should be give success message login successfully', async () => {
      const login = await request(server)
        .post('/admin/login')
        .send(user.login)
        .expect(HttpStatus.OK);

      expect(login.body.statusCode).to.equal(HttpStatus.OK);
      expect(login.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(login.body.message).to.include(Messages.LOGIN_SUCCESS);
    });
  });

  describe('POST /api/admin/verifyEmail', () => {
    it('should be give validation error if pass empty payload ', async () => {
      const login = await request(server)
        .post('/admin/verifyEmail')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(login.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(login.body.message).to.deep.equal([
        'email should not be empty',
        'email must be a string',
        'email must be an email',
      ]);
    });

    it('should be give validation error if email is not valid type', async () => {
      const createInquiry = await request(server)
        .post('/admin/verifyEmail')
        .send(user.checkValidationTypeForVerifyEmail)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(createInquiry.body.message).to.deep.equal([
        'email must be a string',
        'email must be an email',
      ]);
    });

    it('should be give validation error if email is not valid format', async () => {
      const createInquiry = await request(server)
        .post('/admin/verifyEmail')
        .send(user.checkEmailValidationFormat)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(createInquiry.body.message).to.deep.equal([
        'email must be an email',
      ]);
    });

    it('should give error message you are not register when email is incorrect ', async () => {
      const verifyEmail = await request(server)
        .post('/admin/verifyEmail')
        .send(user.incorrectEmail)
        .expect(HttpStatus.OK);

      expect(verifyEmail.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(verifyEmail.body.status).to.equal(ResponseStatus.ERROR);
      expect(verifyEmail.body.message).to.include(Messages.EMAIL_VALIDATION);
    });

    it('should give success message your email is verify', async () => {
      const verifyEmail = await request(server)
        .post('/admin/verifyEmail')
        .send(user.verifyEmail)
        .expect(HttpStatus.OK);

      otp = verifyEmail.body.data;

      expect(verifyEmail.body.statusCode).to.equal(HttpStatus.OK);
      expect(verifyEmail.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(verifyEmail.body.message).to.include(Messages.OTP_SENT);
    });
  });

  describe('PUT /api/admin/forgotPassword', () => {
    it('should be give validation error if pass empty payload ', async () => {
      const login = await request(server)
        .put('/admin/forgotPassword')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(login.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(login.body.message).to.deep.equal([
        'email should not be empty',
        'email must be a string',
        'email must be an email',
        'otp should not be empty',
        'otp must not be greater than 999999',
        'otp must not be less than 100000',
        'otp must be a number conforming to the specified constraints',
        'newPassword should not be empty',
        'newPassword must be a string',
        'newPassword must be longer than or equal to 8 characters',
        'newPassword must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$/ regular expression',
        'confirmPassword should not be empty',
        'confirmPassword must be a string',
      ]);
    });

    it('should be give validation error if password is not valid type', async () => {
      const createInquiry = await request(server)
        .put('/admin/forgotPassword')
        .send(user.checkValidationTypeForForgotPassword)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(createInquiry.body.message).to.deep.equal([
        'newPassword must be a string',
        'newPassword must be longer than or equal to 8 characters',
        'newPassword must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$/ regular expression',
        'Password and confirm password should be same.',
      ]);
    });

    it('should be give validation error if email is not valid format', async () => {
      const createInquiry = await request(server)
        .put('/admin/forgotPassword')
        .send(user.checkEmailValidationFormatForForgotPassword)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(createInquiry.body.message).to.deep.equal([
        'email must be an email',
      ]);
    });

    it('should be give required validation error if new password is not provide', async () => {
      const createInquiry = await request(server)
        .put('/admin/forgotPassword')
        .send(user.requiredValidationForForgotPassword)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(createInquiry.body.message).to.deep.equal([
        'newPassword should not be empty',
        'newPassword must be a string',
        'newPassword must be longer than or equal to 8 characters',
        'newPassword must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$/ regular expression',
        'Password and confirm password should be same.',
      ]);
    });

    it('should give error message if otp is expired', async () => {
      const updatePassword = await request(server)
        .put('/admin/forgotPassword')
        .send(user.otpExpired)
        .expect(HttpStatus.OK);

      expect(updatePassword.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(updatePassword.body.status).to.equal(ResponseStatus.ERROR);
      expect(updatePassword.body.message).to.include(Messages.OTP_EXPIRED);
    });

    it('should give error message if otp not found.', async () => {
      const findOtp = await request(server)
        .put('/admin/forgotPassword')
        .send(user.findOtp)
        .expect(HttpStatus.OK);

      expect(findOtp.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(findOtp.body.status).to.equal(ResponseStatus.ERROR);
      expect(findOtp.body.message).to.include(Messages.OTP_VALIDATION);
    });

    it('should give success message if password is updated', async () => {
      const updatePassword = await request(server)
        .put('/admin/forgotPassword')
        .send({
          otp,
          email: 'admin@gmail.com',
          newPassword: 'Admin@1234',
          confirmPassword: 'Admin@1234',
        })
        .expect(HttpStatus.OK);

      expect(updatePassword.body.statusCode).to.equal(HttpStatus.ACCEPTED);
      expect(updatePassword.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(updatePassword.body.message).to.include(
        `Password ${Messages.UPDATE_SUCCESS}`,
      );
    });
  });

  describe('PUT /api/admin/resetPassword', () => {
    it('should give error message when the token is not added.', async () => {
      const resetPassword = await request(server)
        .put(`/admin/resetPassword`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(resetPassword.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const resetPassword = await request(server)
        .put(`/admin/resetPassword`)
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(resetPassword.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const resetPassword = await request(server)
        .put(`/admin/resetPassword`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(resetPassword.body.message).to.include('Unauthorized');
    });

    it('should be give validation error if pass empty payload ', async () => {
      const resetPassword = await request(server)
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(resetPassword.body.message).to.deep.equal([
        'oldPassword should not be empty',
        'oldPassword must be a string',
        'newPassword should not be empty',
        'newPassword must be a string',
        'newPassword must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$/ regular expression',
        'confirmPassword should not be empty',
        'confirmPassword must be a string',
      ]);
    });

    it('should be give validation error if password is not valid type', async () => {
      const resetPassword = await request(server)
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(user.checkValidationTypeForResetPassword)
        .expect(HttpStatus.BAD_REQUEST);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(resetPassword.body.message).to.deep.equal([
        'newPassword must be a string',
        'newPassword must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$/ regular expression',
        'Password and confirm password should be same.',
      ]);
    });

    it('should be give required validation error if new password is not provide', async () => {
      const resetPassword = await request(server)
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(user.requiredValidationForResetPassword)
        .expect(HttpStatus.BAD_REQUEST);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(resetPassword.body.message).to.deep.equal([
        'newPassword should not be empty',
        'newPassword must be a string',
        'newPassword must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$/ regular expression',
        'Password and confirm password should be same.',
      ]);
    });

    it('should give error message when the old Password is Wrong.', async () => {
      const resetPassword = await request(server)
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(user.oldPasswordValidation)
        .expect(HttpStatus.OK);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(resetPassword.body.status).to.equal(ResponseStatus.ERROR);
      expect(resetPassword.body.message).to.include(
        Messages.CREDENTIALS_NOT_MATCH,
      );
    });

    it('should give error message when the new Password and confirm password is not same.', async () => {
      const resetPassword = await request(server)
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(user.passwordValidation)
        .expect(HttpStatus.BAD_REQUEST);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(resetPassword.body.message).to.include(
        Messages.PASSWORD_CREDENTIALS,
      );
    });

    it('should give success message when the old password is updated.', async () => {
      const resetPassword = await request(server)
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(user.resetPassword)
        .expect(HttpStatus.OK);

      expect(resetPassword.body.statusCode).to.equal(HttpStatus.OK);
      expect(resetPassword.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(resetPassword.body.message).to.include(
        `Password is ${Messages.UPDATE_SUCCESS}`,
      );
    });
  });
});
