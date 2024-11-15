import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ResponseStatus, Token } from '../lib/utils/enum';
import { Messages } from '../lib/utils/messages';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from '../lib/entities/inquiry.entity';
import * as supertest from 'supertest';
import { DataSource } from 'typeorm';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';
import { inquiry } from './inquiryVariable';
import { AppModule } from '../app.module';
import { InquiryModule } from './inquiry.module';
import { JwtModule } from '@nestjs/jwt';

describe('InquiryController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let request: any;
  let inquiryId = 60;
  let wrongInquiryId = 1;
  let stringInquiryId = 'abc';
  let requiredId;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppModule,
        InquiryModule,
        TypeOrmModule.forFeature([Inquiry]),
        JwtModule.register({
          secret: process.env.JWTSecretKey,
          signOptions: { expiresIn: '24h' },
        }),
      ],
      controllers: [InquiryController],
      providers: [InquiryService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  //if you want to test then uncomment code
  describe('POST /api/inquiry/createInquiry', () => {
    it('should be give validation error if pass empty payload ', async () => {
      const createInquiry = await request
        .post('/inquiry/createInquiry')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(createInquiry._body.message).toEqual([
        'first_name should not be empty',
        'first_name must be a string',
        'last_name should not be empty',
        'last_name must be a string',
        'email should not be empty',
        'email must be a string',
        'email must be an email',
        'phone_number should not be empty',
        'phone_number must be a string',
      ]);
    });

    it('should be give validation error if first_name is not valid type', async () => {
      const createInquiry = await request
        .post('/inquiry/createInquiry')
        .send(inquiry.checkValidationType)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(createInquiry._body.message).toEqual([
        'first_name must be a string',
      ]);
    });

    it('should be give validation error if email is not valid format', async () => {
      const createInquiry = await request
        .post('/inquiry/createInquiry')
        .send(inquiry.checkEmailValidationFormat)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(createInquiry._body.message).toEqual(['email must be an email']);
    });

    it('should be give required validation error if last name is not provide', async () => {
      const createInquiry = await request
        .post('/inquiry/createInquiry')
        .send(inquiry.requiredValidation)
        .expect(HttpStatus.BAD_REQUEST);

      expect(createInquiry._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(createInquiry._body.message).toEqual([
        'last_name should not be empty',
        'last_name must be a string',
      ]);
    });

    it('should return conflict error if inquiry already exists', async () => {
      const existingInquiry = await request
        .post('/inquiry/createInquiry')
        .send(inquiry.alreadyRegister)
        .expect(HttpStatus.OK);
      expect(existingInquiry._body.statusCode).toEqual(HttpStatus.CONFLICT);
      expect(existingInquiry._body.status).toEqual(ResponseStatus.ERROR);
      expect(existingInquiry._body.message).toContain(Messages.ALREADY_EXIST);
    });

    it('should be give success message if inquiry create successfully.', async () => {
      const createInquiry = await request
        .post('/inquiry/createInquiry')
        .send(inquiry.createInquiry)
        .expect(HttpStatus.OK);

      inquiryId = createInquiry._body.data.id;

      expect(createInquiry._body.statusCode).toEqual(HttpStatus.CREATED);
      expect(createInquiry._body.status).toEqual(ResponseStatus.SUCCESS);
      expect(createInquiry._body.message).toContain(
        `Inquiry ${Messages.ADDED_SUCCESS}`,
      );
    });
  });

  describe('GET /api/inquiry/viewInquiry/:inquiryId', () => {
    it('should give error message when the token is not added.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${inquiryId}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(viewInquiry._body.message).toContain('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${inquiryId}`)
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(viewInquiry._body.message).toContain('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${inquiryId}`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(viewInquiry._body.message).toContain('Unauthorized');
    });

    it('should give validation error message if inquiryId is not a number.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${stringInquiryId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(viewInquiry._body.statusCode).toEqual(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(viewInquiry._body.message).toEqual('Internal server error');
    });

    it('should give validation error message if inquiryId is not a provide.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${requiredId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(viewInquiry._body.statusCode).toEqual(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(viewInquiry._body.message).toEqual('Internal server error');
    });

    it('should give error message if inquiry not found.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${wrongInquiryId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(viewInquiry._body.status).toEqual(ResponseStatus.ERROR);
      expect(viewInquiry._body.message).toContain(
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    });

    it('should give success message if inquiry get successfully.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${inquiryId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.OK);
      expect(viewInquiry._body.status).toEqual(ResponseStatus.SUCCESS);
    });
  });

  describe('PUT /api/inquiry/updateInquiryStatus/:inquiryId', () => {
    it('should give error message when the token is not added.', async () => {
      const updateInquiryStatus = await request
        .put(`/inquiry/updateInquiryStatus/${inquiryId}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(updateInquiryStatus._body.statusCode).toEqual(
        HttpStatus.UNAUTHORIZED,
      );
      expect(updateInquiryStatus._body.message).toContain('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const updateInquiryStatus = await request
        .put(`/inquiry/updateInquiryStatus/${inquiryId}`)
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(updateInquiryStatus._body.statusCode).toEqual(
        HttpStatus.UNAUTHORIZED,
      );
      expect(updateInquiryStatus._body.message).toContain('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const updateInquiryStatus = await request
        .put(`/inquiry/updateInquiryStatus/${inquiryId}`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(updateInquiryStatus._body.statusCode).toEqual(
        HttpStatus.UNAUTHORIZED,
      );
      expect(updateInquiryStatus._body.message).toContain('Unauthorized');
    });

    it('should give validation error message if inquiryId is not a number.', async () => {
      const updateInquiryStatus = await request
        .put(`/inquiry/updateInquiryStatus/${stringInquiryId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(updateInquiryStatus._body.statusCode).toEqual(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(updateInquiryStatus._body.message).toEqual(
        'Internal server error',
      );
    });

    it('should give validation error message if inquiryId is not a provide.', async () => {
      const updateInquiryStatus = await request
        .put(`/inquiry/updateInquiryStatus/${requiredId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(updateInquiryStatus._body.statusCode).toEqual(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(updateInquiryStatus._body.message).toEqual(
        'Internal server error',
      );
    });

    it('should give success message if inquiry is not found.', async () => {
      const updateStatus = await request
        .put(`/inquiry/updateInquiryStatus/${wrongInquiryId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(inquiry.changeStatus)
        .expect(HttpStatus.OK);

      expect(updateStatus._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(updateStatus._body.status).toEqual(ResponseStatus.ERROR);
      expect(updateStatus._body.message).toContain(
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    });

    it('should give success message if inquiry status update successfully.', async () => {
      const updateStatus = await request
        .put(`/inquiry/updateInquiryStatus/${inquiryId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(inquiry.changeStatus)
        .expect(HttpStatus.OK);

      expect(updateStatus._body.statusCode).toEqual(HttpStatus.ACCEPTED);
      expect(updateStatus._body.status).toEqual(ResponseStatus.SUCCESS);
      expect(updateStatus._body.message).toContain(
        `Inquiry status ${Messages.UPDATE_SUCCESS}`,
      );
    });
  });

  describe('GET /api/inquiry/listOfInquiries', () => {
    it('should give error message when the token is not added.', async () => {
      const updateInquiryStatus = await request
        .get(
          `/inquiry/listOfInquiries?${inquiry.pagination.sortKey}?${inquiry.pagination.sortValue}?${inquiry.pagination.pageSize}?${inquiry.pagination.page}?${inquiry.pagination.searchBar}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);

      expect(updateInquiryStatus._body.statusCode).toEqual(
        HttpStatus.UNAUTHORIZED,
      );
      expect(updateInquiryStatus._body.message).toContain('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const updateInquiryStatus = await request
        .get(
          `/inquiry/listOfInquiries?${inquiry.pagination.sortKey}?${inquiry.pagination.sortValue}?${inquiry.pagination.pageSize}?${inquiry.pagination.page}?${inquiry.pagination.searchBar}`,
        )
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(updateInquiryStatus._body.statusCode).toEqual(
        HttpStatus.UNAUTHORIZED,
      );
      expect(updateInquiryStatus._body.message).toContain('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const updateInquiryStatus = await request
        .get(
          `/inquiry/listOfInquiries?sortKey=${inquiry.pagination.sortKey}?sortValue=${inquiry.pagination.sortValue}?pageSize=${inquiry.pagination.pageSize}?page=${inquiry.pagination.page}?searchBar=${inquiry.pagination.searchBar}`,
        )
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(updateInquiryStatus._body.statusCode).toEqual(
        HttpStatus.UNAUTHORIZED,
      );
      expect(updateInquiryStatus._body.message).toContain('Unauthorized');
    });

    it('should be give error message if list of inquiry not found', async () => {
      const inquiryInfo = await request
        .get(
          `/inquiry/listOfInquiries?searchBar=${inquiry.wrongPagination.searchBar}`,
        )
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(inquiryInfo._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(inquiryInfo._body.status).toEqual(ResponseStatus.ERROR);
      expect(inquiryInfo._body.message).toContain(
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    });

    it('should be give success message if list of inquiry get successfully', async () => {
      const inquiryInfo = await request
        .get(
          `/inquiry/listOfInquiries?${inquiry.pagination.sortKey}?${inquiry.pagination.sortValue}?${inquiry.pagination.pageSize}?${inquiry.pagination.page}?${inquiry.pagination.searchBar}`,
        )
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(inquiryInfo._body.statusCode).toEqual(HttpStatus.OK);
      expect(inquiryInfo._body.status).toEqual(ResponseStatus.SUCCESS);
    });
  });
});
