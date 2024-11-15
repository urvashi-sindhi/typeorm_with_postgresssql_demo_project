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
  let inquiryId: number;

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

  describe('POST /api/inquiry/createInquiry', () => {
    beforeAll(async () => {
      const dataSource = app.get(DataSource);
      await dataSource.createQueryBuilder().delete().from(Inquiry).execute();
    });

    it('should be create new inquiry ', async () => {
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

    it('should return conflict error if inquiry already exists', async () => {
      const existingInquiry = await request
        .post('/inquiry/createInquiry')
        .send(inquiry.alreadyRegister)
        .expect(HttpStatus.OK);
      expect(existingInquiry._body.statusCode).toEqual(HttpStatus.CONFLICT);
      expect(existingInquiry._body.status).toEqual(ResponseStatus.ERROR);
      expect(existingInquiry._body.message).toContain(Messages.ALREADY_EXIST);
    });
  });

  describe('GET /api/inquiry/viewInquiry/:inquiryId', () => {
    it('should give success message if inquiry display.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${inquiryId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.OK);
      expect(viewInquiry._body.status).toEqual(ResponseStatus.SUCCESS);
    });

    it('should give success message if inquiry not found.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${13}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(viewInquiry._body.status).toEqual(ResponseStatus.ERROR);
      expect(viewInquiry._body.message).toContain(
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    });

    it('should give error message when the token is not added.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/viewInquiry/${inquiryId}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(viewInquiry._body.message).toContain('Unauthorized');
    });
  });

  describe('PUT /api/inquiry/updateInquiryStatus/:inquiryId', () => {
    it('should give success message if inquiry updated.', async () => {
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

    it('should give success message if inquiry status is not updated.', async () => {
      const updateStatus = await request
        .put(`/inquiry/updateInquiryStatus/${13}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(inquiry.changeStatus)
        .expect(HttpStatus.OK);

      expect(updateStatus._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(updateStatus._body.status).toEqual(ResponseStatus.ERROR);
      expect(updateStatus._body.message).toContain(
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    });

    it('should give error message when the token is not added.', async () => {
      const viewInquiry = await request
        .put(`/inquiry/updateInquiryStatus/${inquiryId}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(viewInquiry._body.message).toContain('Unauthorized');
    });
  });

  describe('GET /api/inquiry/listOfInquiries', () => {
    it('should be give success message if list of inquiry get successfully', async () => {
      const productInfo = await request
        .get(
          `/inquiry/listOfInquiries?${inquiry.pagination.sortKey}?${inquiry.pagination.sortValue}?${inquiry.pagination.pageSize}?${inquiry.pagination.page}${inquiry.pagination.searchBar}`,
        )
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(productInfo._body.statusCode).toEqual(HttpStatus.OK);
      expect(productInfo._body.status).toEqual(ResponseStatus.SUCCESS);
    });

    it('should be give error message if list of inquiry not get', async () => {
      const productInfo = await request
        .get(
          `/inquiry/listOfInquiries?${inquiry.wrongPagination.sortKey}?${inquiry.wrongPagination.sortValue}?${inquiry.wrongPagination.pageSize}?${inquiry.wrongPagination.page}${inquiry.wrongPagination.searchBar}`,
        )
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(productInfo._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(productInfo._body.status).toEqual(ResponseStatus.ERROR);
      expect(productInfo._body.message).toContain(
        `Inquiry ${Messages.NOT_FOUND}`,
      );
    });

    it('should give error message when the token is not added.', async () => {
      const viewInquiry = await request
        .get(`/inquiry/listOfInquiries`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(viewInquiry._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(viewInquiry._body.message).toContain('Unauthorized');
    });
  });
});
