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
import * as supertest from 'supertest';
import { DataSource } from 'typeorm';
import { user } from './userVariable';
import { UserModule } from './user.module';
import { AppModule } from '../app.module';

describe('UserController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let request: any;
  let otp: number;

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

    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/admin/login', () => {
    it('should be give success message login successfully', async () => {
      const login: any = await request
        .post('/admin/login')
        .send(user.login)
        .expect(HttpStatus.OK);

      expect(login._body.statusCode).toEqual(HttpStatus.OK);
      expect(login._body.status).toEqual(ResponseStatus.SUCCESS);
      expect(login._body.message).toContain(Messages.LOGIN_SUCCESS);
    });

    it('should be give error message credential does not match ', async () => {
      const login: any = await request
        .post('/admin/login')
        .send(user.incorrectCredential)
        .expect(HttpStatus.OK);

      expect(login._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(login._body.status).toEqual(ResponseStatus.ERROR);
      expect(login._body.message).toContain(Messages.CREDENTIALS_NOT_MATCH);
    });

    it('should be give error message credential does not match when email is incorrect ', async () => {
      const login: any = await request
        .post('/admin/login')
        .send(user.incorrectEmail)
        .expect(HttpStatus.OK);

      expect(login._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(login._body.status).toEqual(ResponseStatus.ERROR);
      expect(login._body.message).toContain(Messages.CREDENTIALS_NOT_MATCH);
    });
  });

  describe('POST /api/admin/verifyEmail', () => {
    beforeAll(async () => {
      const dataSource = app.get(DataSource);
      await dataSource.createQueryBuilder().delete().from(Otp).execute();
    });

    it('should give error message you are not register when email is incorrect ', async () => {
      const verifyEmail: any = await request
        .post('/admin/verifyEmail')
        .send(user.incorrectEmail)
        .expect(HttpStatus.OK);

      expect(verifyEmail._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(verifyEmail._body.status).toEqual(ResponseStatus.ERROR);
      expect(verifyEmail._body.message).toContain(Messages.EMAIL_VALIDATION);
    });

    it('should give success message your email is verify', async () => {
      const verifyEmail: any = await request
        .post('/admin/verifyEmail')
        .send(user.verifyEmail)
        .expect(HttpStatus.OK);

      otp = verifyEmail._body.data;

      expect(verifyEmail._body.statusCode).toEqual(HttpStatus.OK);
      expect(verifyEmail._body.status).toEqual(ResponseStatus.SUCCESS);
      expect(verifyEmail._body.message).toContain(Messages.OTP_SENT);
    });
  });

  describe('PUT /api/admin/forgotPassword', () => {
    it('should give success message if password is updated', async () => {
      const updatePassword: any = await request
        .put('/admin/forgotPassword')
        .send({
          otp,
          email: 'admin@gmail.com',
          newPassword: 'Admin@1234',
          confirmPassword: 'Admin@1234',
        })
        .expect(HttpStatus.OK);

      expect(updatePassword._body.statusCode).toEqual(HttpStatus.ACCEPTED);
      expect(updatePassword._body.status).toEqual(ResponseStatus.SUCCESS);
      expect(updatePassword._body.message).toContain(
        `Password ${Messages.UPDATE_SUCCESS}`,
      );
    });

    it('should give error message if otp is expired', async () => {
      const updatePassword: any = await request
        .put('/admin/forgotPassword')
        .send({
          otp,
          email: 'admin@gmail.com',
          newPassword: 'Admin@1234',
          confirmPassword: 'Admin@1234',
        })
        .expect(HttpStatus.OK);

      expect(updatePassword._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(updatePassword._body.status).toEqual(ResponseStatus.ERROR);
      expect(updatePassword._body.message).toContain(Messages.OTP_EXPIRED);
    });

    it('should give error message if otp not found.', async () => {
      const findOtp: any = await request
        .put('/admin/forgotPassword')
        .send({
          otp,
          email: 'admin@gmail.com',
          newPassword: 'Admin@1234',
          confirmPassword: 'Admin@1234',
        })
        .expect(HttpStatus.OK);

      expect(findOtp._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(findOtp._body.status).toEqual(ResponseStatus.ERROR);
      expect(findOtp._body.message).toContain(Messages.OTP_VALIDATION);
    });
  });

  describe('PUT /api/admin/resetPassword', () => {
    it('should give success message when the old password is updated.', async () => {
      const resetPassword = await request
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(user.resetPassword)
        .expect(HttpStatus.OK);

      expect(resetPassword._body.statusCode).toEqual(HttpStatus.OK);
      expect(resetPassword._body.status).toEqual(ResponseStatus.SUCCESS);
      expect(resetPassword._body.message).toContain(
        `Password is ${Messages.UPDATE_SUCCESS}`,
      );
    });

    it('should give error message when the old Password is Wrong.', async () => {
      const resetPassword = await request
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(user.oldPasswordValidation)
        .expect(HttpStatus.OK);

      expect(resetPassword._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(resetPassword._body.status).toEqual(ResponseStatus.ERROR);
      expect(resetPassword._body.message).toContain(
        Messages.CREDENTIALS_NOT_MATCH,
      );
    });

    it('should give error message when the new Password and confirm password is not same.', async () => {
      const resetPassword = await request
        .put('/admin/resetPassword')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(user.passwordValidation)
        .expect(HttpStatus.BAD_REQUEST);

      expect(resetPassword._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(resetPassword._body.message).toContain(
        Messages.PASSWORD_CREDENTIALS,
      );
    });

    it('should give error message when the token is not added.', async () => {
      const resetPassword = await request
        .put('/admin/resetPassword')
        .expect(HttpStatus.UNAUTHORIZED);

      expect(resetPassword._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(resetPassword._body.message).toContain('Unauthorized');
    });
  });
});
