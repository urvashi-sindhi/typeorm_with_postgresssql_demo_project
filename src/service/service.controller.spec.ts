import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { JwtModule } from '@nestjs/jwt';
import { ResponseStatus, Token } from '../lib/utils/enum';
import { Messages } from '../lib/utils/messages';
import { ServiceModule } from './service.module';
import { Service } from '../lib/entities/service.entity';
import { ServiceImage } from '../lib/entities/serviceImages.entity';
import { ServiceDetails } from '../lib/entities/serviceDetails.entity';
import { SubService } from '../lib/entities/subService.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { service } from './serviceVariable';
import * as chai from 'chai';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

const expect = chai.expect;

describe('ServiceController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let serviceId = null;
  let stringId = 'abc';
  let requiredId: number;
  let server: any;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppModule,
        ServiceModule,
        TypeOrmModule.forFeature([
          Service,
          ServiceImage,
          ServiceDetails,
          SubService,
        ]),

        JwtModule.register({
          secret: 'JWTSecretKey',
          signOptions: { expiresIn: '24h' },
        }),
      ],
      controllers: [ServiceController],
      providers: [ServiceService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    server = app.getHttpServer();

    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(ServiceImage).execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ServiceDetails)
      .execute();
    await dataSource.createQueryBuilder().delete().from(SubService).execute();
    await dataSource.createQueryBuilder().delete().from(Service).execute();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(ServiceImage).execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ServiceDetails)
      .execute();
    await dataSource.createQueryBuilder().delete().from(SubService).execute();
    await dataSource.createQueryBuilder().delete().from(Service).execute();
    await app.close();
  });

  describe('POST api/service/addService', () => {
    it('should give error message when the token is not added.', async () => {
      const addService = await request(server)
        .post(`/service/addService`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(addService.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(addService.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const addService = await request(server)
        .post(`/service/addService`)
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(addService.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(addService.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const addService = await request(server)
        .post(`/service/addService`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(addService.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(addService.body.message).to.include('Unauthorized');
    });

    it('should be give validation error if pass empty payload ', async () => {
      const addService = await request(server)
        .post(`/service/addService`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.emptyPayload)
        .expect(HttpStatus.OK);

      expect(addService.body.statusCode).equal(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(addService.body.status).to.equal(ResponseStatus.ERROR);
      expect(addService.body.message).to.include(Messages.SERVER_ERROR);
    });

    it('should be give validation error if service_name is not valid type', async () => {
      const addService = await request(server)
        .post(`/service/addService`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.checkValidationType)
        .expect(HttpStatus.BAD_REQUEST);

      expect(addService.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(addService.body.message).to.deep.equal([
        'service_name must be a string',
      ]);
    });

    it('should be give required validation error if sub service title is not provide', async () => {
      const addService = await request(server)
        .post(`/service/addService`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.requiredValidation)
        .expect(HttpStatus.OK);

      expect(addService.body.statusCode).to.equal(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(addService.body.status).to.equal(ResponseStatus.ERROR);
      expect(addService.body.message).to.include(Messages.SERVER_ERROR);
    });

    it('should return conflict error if service already exists', async () => {
      const existingService = await request(server)
        .post(`/service/addService`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.alreadyExist)
        .expect(HttpStatus.OK);

      expect(existingService.body.statusCode).to.equal(HttpStatus.CONFLICT);
      expect(existingService.body.status).to.equal(ResponseStatus.ERROR);
      expect(existingService.body.message).to.include(
        `Service ${Messages.ALREADY_EXIST}`,
      );
    });

    it('should be give success message if service created successfully', async () => {
      jest.setTimeout(10000);

      const addService = await request(server)
        .post(`/service/addService`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.serviceInfo)
        .expect(HttpStatus.OK);

      expect(addService.body.statusCode).to.equal(HttpStatus.CREATED);
      expect(addService.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(addService.body.message).to.include(
        `Service ${Messages.ADDED_SUCCESS}`,
      );
      serviceId = addService.body.data.id;
    });
  });

  describe('PUT api/service/editService/:serviceId', () => {
    it('should give error message when the token is not added.', async () => {
      const editService = await request(server)
        .put(`/service/editService/${serviceId}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(editService.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(editService.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const editService = await request(server)
        .put(`/service/editService/${serviceId}`)
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(editService.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(editService.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const editService = await request(server)
        .put(`/service/editService/${serviceId}`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(editService.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(editService.body.message).to.include('Unauthorized');
    });

    it('should be give validation error if service name is not valid type', async () => {
      const editService = await request(server)
        .put(`/service/editService/${serviceId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.checkValidationType)
        .expect(HttpStatus.BAD_REQUEST);

      expect(editService.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(editService.body.message).to.deep.equal([
        'service_name must be a string',
      ]);
    });

    it('should give validation error message if serviceId is not a number.', async () => {
      const editService = await request(server)
        .put(`/service/editService/${stringId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.serviceInfo)
        .expect(HttpStatus.OK);

      expect(editService.body.statusCode).to.equal(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(editService.body.message).to.equal('Internal server error');
    });

    it('should give validation error message if serviceId is not a provide.', async () => {
      const editService = await request(server)
        .put(`/service/editService/${requiredId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.serviceInfo)
        .expect(HttpStatus.OK);

      expect(editService.body.statusCode).to.equal(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(editService.body.message).to.equal('Internal server error');
    });

    it('should give error if service not found.', async () => {
      const findService = await request(server)
        .put(`/service/editService/${1}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.serviceInfo)
        .expect(HttpStatus.OK);

      expect(findService.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(findService.body.status).to.equal(ResponseStatus.ERROR);
      expect(findService.body.message).to.include(
        `Service ${Messages.NOT_FOUND}`,
      );
    });

    it('should be give success message if update product ', async () => {
      jest.setTimeout(10000);

      const editService = await request(server)
        .put(`/service/editService/${serviceId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(service.serviceInfo)
        .expect(HttpStatus.OK);

      expect(editService.body.statusCode).to.equal(HttpStatus.ACCEPTED);
      expect(editService.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(editService.body.message).to.include(
        `Service ${Messages.UPDATE_SUCCESS}`,
      );
    });
  });

  describe('GET api/customer/viewService/:serviceId', () => {
    it('should give validation error message if serviceId is not a number.', async () => {
      jest.setTimeout(10000);

      const viewProduct = await request(server)
        .get(`/customer/viewService/${stringId}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(viewProduct.body.statusCode).to.equal(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(viewProduct.body.message).to.equal('Internal server error');
    });

    it('should give validation error message if serviceId is not a provide.', async () => {
      jest.setTimeout(10000);

      const viewProduct = await request(server)
        .get(`/customer/viewService/${requiredId}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(viewProduct.body.statusCode).to.equal(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(viewProduct.body.message).to.equal('Internal server error');
    });

    it('should give error if service not found.', async () => {
      jest.setTimeout(10000);

      const findProduct = await request(server)
        .get(`/customer/viewService/${1}`)
        .expect(HttpStatus.OK);

      expect(findProduct.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(findProduct.body.status).to.equal(ResponseStatus.ERROR);
      expect(findProduct.body.message).to.include(
        `Service ${Messages.NOT_FOUND}`,
      );
    });

    it('should be give success message if view Service ', async () => {
      jest.setTimeout(10000);

      const viewProduct = await request(server)
        .get(`/customer/viewService/${serviceId}`)
        .expect(HttpStatus.OK);

      expect(viewProduct.body.statusCode).to.equal(HttpStatus.OK);
      expect(viewProduct.body.status).to.equal(ResponseStatus.SUCCESS);
    });
  });

  describe('GET api/customer/getServiceList', () => {
    it('should give error if service not found.', async () => {
      const findProduct = await request(server)
        .get('/customer/getServiceList')
        .expect(HttpStatus.OK);

      expect(findProduct.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(findProduct.body.status).to.equal(ResponseStatus.ERROR);
      expect(findProduct.body.message).to.include(
        `Service ${Messages.NOT_FOUND}`,
      );
    });

    it('should be give success message when service get successfully.', async () => {
      const productInfo = await request(server)
        .get('/customer/getServiceList')
        .expect(HttpStatus.OK);

      expect(productInfo.body.statusCode).to.equal(HttpStatus.OK);
      expect(productInfo.body.status).to.equal(ResponseStatus.SUCCESS);
    });
  });

  describe('GET api/service/listOfService', () => {
    it('should give error message when the token is not added.', async () => {
      const listOfProduct = await request(server)
        .get(
          `/service/listOfService?sortKey=${service.pagination.sortKey}?sortValue=${service.pagination.sortValue}?pageSize=${service.pagination.pageSize}?page=${service.pagination.page}?searchBar=${service.pagination.searchBar}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);

      expect(listOfProduct.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(listOfProduct.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const listOfProduct = await request(server)
        .get(
          `/service/listOfService?sortKey=${service.pagination.sortKey}?sortValue=${service.pagination.sortValue}?pageSize=${service.pagination.pageSize}?page=${service.pagination.page}?searchBar=${service.pagination.searchBar}`,
        )
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(listOfProduct.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(listOfProduct.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const listOfProduct = await request(server)
        .get(
          `/service/listOfService?sortKey=${service.pagination.sortKey}?sortValue=${service.pagination.sortValue}?pageSize=${service.pagination.pageSize}?page=${service.pagination.page}?searchBar=${service.pagination.searchBar}`,
        )
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(listOfProduct.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(listOfProduct.body.message).to.include('Unauthorized');
    });

    it('should be give error message if list of product not get', async () => {
      const listOfProduct = await request(server)
        .get(
          `/service/listOfService?searchBar=${service.wrongPagination.searchBar}`,
        )
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(listOfProduct.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(listOfProduct.body.status).to.equal(ResponseStatus.ERROR);
      expect(listOfProduct.body.message).to.include(
        `Service ${Messages.NOT_FOUND}`,
      );
    });

    it('should be give success message if list of Service get successfully', async () => {
      const listOfProduct = await request(server)
        .get(
          `/service/listOfService?${service.pagination.sortKey}?${service.pagination.sortValue}?${service.pagination.pageSize}?${service.pagination.page}?${service.pagination.searchBar}`,
        )
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(listOfProduct.body.statusCode).to.equal(HttpStatus.OK);
      expect(listOfProduct.body.status).to.equal(ResponseStatus.SUCCESS);
    });
  });

  describe('DELETE api/service/deleteService/:serviceId', () => {
    it('should give error message when the token is not added.', async () => {
      const deleteProduct = await request(server)
        .delete(`/service/deleteService/${serviceId}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(deleteProduct.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(deleteProduct.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const deleteProduct = await request(server)
        .delete(`/service/deleteService/${serviceId}`)
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(deleteProduct.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(deleteProduct.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const deleteProduct = await request(server)
        .delete(`/service/deleteService/${serviceId}`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(deleteProduct.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(deleteProduct.body.message).to.include('Unauthorized');
    });

    it('should give validation error message if serviceId is not a number.', async () => {
      const deleteProduct = await request(server)
        .delete(`/service/deleteService/${stringId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(deleteProduct.body.statusCode).to.equal(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(deleteProduct.body.message).to.equal('Internal server error');
    });

    it('should give validation error message if serviceId is not a provide.', async () => {
      const deleteProduct = await request(server)
        .delete(`/service/deleteService/${requiredId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(deleteProduct.body.statusCode).to.equal(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(deleteProduct.body.message).to.equal('Internal server error');
    });

    it('should give error if service not found.', async () => {
      const findProduct = await request(server)
        .delete(`/service/deleteService/${1}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(findProduct.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(findProduct.body.status).to.equal(ResponseStatus.ERROR);
      expect(findProduct.body.message).to.include(
        `Service ${Messages.NOT_FOUND}`,
      );
    });

    it('should be give success message if delete service successfully.', async () => {
      const deleteProduct = await request(server)
        .delete(`/service/deleteService/${serviceId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(deleteProduct.body.statusCode).to.equal(HttpStatus.OK);
      expect(deleteProduct.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(deleteProduct.body.message).to.include(
        `Service ${Messages.DELETE_SUCCESS}`,
      );
    });
  });
});
