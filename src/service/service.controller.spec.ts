import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { JwtModule } from '@nestjs/jwt';
import * as supertest from 'supertest';
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

describe('ServiceController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let request: any;
  let serviceId = null;
  let stringId = 'abc';
  let requiredId: number;

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

    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  it('should give error message when the token is not added.', async () => {
    console.log('post');

    const addService = await request
      .post(`/service/addService`)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(addService._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(addService._body.message).toContain('Unauthorized');
  });

  it('should give error message when provide wrong token.', async () => {
    console.log('post');

    const addService = await request
      .post(`/service/addService`)
      .set('Authorization', Token.WRONG_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(addService._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(addService._body.message).toContain('Unauthorized');
  });

  it('should give error message when provide expire token.', async () => {
    console.log('post');

    const addService = await request
      .post(`/service/addService`)
      .set('Authorization', Token.EXPIRE_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(addService._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(addService._body.message).toContain('Unauthorized');
  });

  it('should be give validation error if pass empty payload ', async () => {
    console.log('post');

    const addService = await request
      .post(`/service/addService`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.emptyPayload)
      .expect(HttpStatus.OK);

    expect(addService._body.statusCode).toEqual(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(addService._body.status).toEqual(ResponseStatus.ERROR);
    expect(addService._body.message).toContain(Messages.SERVER_ERROR);
  });

  it('should be give validation error if service_name is not valid type', async () => {
    console.log('post');

    const addService = await request
      .post(`/service/addService`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.checkValidationType)
      .expect(HttpStatus.BAD_REQUEST);

    expect(addService._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(addService._body.message).toEqual(['service_name must be a string']);
  });

  it('should be give required validation error if sub service title is not provide', async () => {
    console.log('post');

    const addService = await request
      .post(`/service/addService`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.requiredValidation)
      .expect(HttpStatus.OK);

    expect(addService._body.statusCode).toEqual(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(addService._body.status).toEqual(ResponseStatus.ERROR);
    expect(addService._body.message).toContain(Messages.SERVER_ERROR);
  });

  it('should return conflict error if service already exists', async () => {
    console.log('post');

    const existingService = await request
      .post(`/service/addService`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.alreadyExist)
      .expect(HttpStatus.OK);

    expect(existingService._body.statusCode).toEqual(HttpStatus.CONFLICT);
    expect(existingService._body.status).toEqual(ResponseStatus.ERROR);
    expect(existingService._body.message).toContain(
      `Service ${Messages.ALREADY_EXIST}`,
    );
  });

  it('should be give success message if service created successfully', async () => {
    console.log('post');

    jest.setTimeout(10000);

    const addService = await request
      .post(`/service/addService`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.serviceInfo)
      .expect(HttpStatus.OK);

    expect(addService._body.statusCode).toEqual(HttpStatus.CREATED);
    expect(addService._body.status).toEqual(ResponseStatus.SUCCESS);
    expect(addService._body.message).toContain(
      `Service ${Messages.ADDED_SUCCESS}`,
    );
    serviceId = addService._body.data.id;

    console.log('add-====serviceId', serviceId);
  });

  it('should give error message when the token is not added.', async () => {
    console.log('put');

    const editService = await request
      .put(`/service/editService/${serviceId}`)
      .expect(HttpStatus.UNAUTHORIZED);
    console.log('edit====serviceId', serviceId);

    expect(editService._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(editService._body.message).toContain('Unauthorized');
  });

  it('should give error message when provide wrong token.', async () => {
    console.log('put');

    const editService = await request
      .put(`/service/editService/${serviceId}`)
      .set('Authorization', Token.WRONG_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(editService._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(editService._body.message).toContain('Unauthorized');
  });

  it('should give error message when provide expire token.', async () => {
    console.log('put');

    const editService = await request
      .put(`/service/editService/${serviceId}`)
      .set('Authorization', Token.EXPIRE_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(editService._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(editService._body.message).toContain('Unauthorized');
  });

  it('should be give validation error if service name is not valid type', async () => {
    console.log('put');

    const editService = await request
      .put(`/service/editService/${serviceId}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.checkValidationType)
      .expect(HttpStatus.BAD_REQUEST);

    expect(editService._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(editService._body.message).toEqual([
      'service_name must be a string',
    ]);
  });

  it('should give validation error message if serviceId is not a number.', async () => {
    console.log('put');

    const editService = await request
      .put(`/service/editService/${stringId}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.serviceInfo)
      .expect(HttpStatus.OK);

    expect(editService._body.statusCode).toEqual(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(editService._body.message).toEqual('Internal server error');
  });

  it('should give validation error message if serviceId is not a provide.', async () => {
    console.log('put');

    const editService = await request
      .put(`/service/editService/${requiredId}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.serviceInfo)
      .expect(HttpStatus.OK);

    expect(editService._body.statusCode).toEqual(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(editService._body.message).toEqual('Internal server error');
  });

  it('should give error if service not found.', async () => {
    const findService = await request
      .put(`/service/editService/${1}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.serviceInfo)
      .expect(HttpStatus.OK);

    expect(findService._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(findService._body.status).toEqual(ResponseStatus.ERROR);
    expect(findService._body.message).toContain(
      `Service ${Messages.NOT_FOUND}`,
    );
  });

  it('should be give success message if update product ', async () => {
    console.log('put');

    jest.setTimeout(10000);

    const editService = await request
      .put(`/service/editService/${serviceId}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .send(service.serviceInfo)
      .expect(HttpStatus.OK);

    expect(editService._body.statusCode).toEqual(HttpStatus.ACCEPTED);
    expect(editService._body.status).toEqual(ResponseStatus.SUCCESS);
    expect(editService._body.message).toContain(
      `Service ${Messages.UPDATE_SUCCESS}`,
    );
  });

  it('should give validation error message if serviceId is not a number.', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const viewProduct = await request
      .get(`/customer/viewService/${stringId}`)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    console.log('productId', serviceId);
    expect(viewProduct._body.statusCode).toEqual(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(viewProduct._body.message).toEqual('Internal server error');
  });

  it('should give validation error message if serviceId is not a provide.', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const viewProduct = await request
      .get(`/customer/viewService/${requiredId}`)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(viewProduct._body.statusCode).toEqual(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(viewProduct._body.message).toEqual('Internal server error');
  });

  it('should give error if service not found.', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const findProduct = await request
      .get(`/customer/viewService/${1}`)
      .expect(HttpStatus.OK);

    expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
    expect(findProduct._body.message).toContain(
      `Service ${Messages.NOT_FOUND}`,
    );
  });

  it('should be give success message if view Service ', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const viewProduct = await request
      .get(`/customer/viewService/${serviceId}`)
      .expect(HttpStatus.OK);

    expect(viewProduct._body.statusCode).toEqual(HttpStatus.OK);
    expect(viewProduct._body.status).toEqual(ResponseStatus.SUCCESS);
  });

  it('should give error if service not found.', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const findProduct = await request
      .get('/customer/getServiceList')
      .expect(HttpStatus.OK);

    expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
    expect(findProduct._body.message).toContain(
      `Service ${Messages.NOT_FOUND}`,
    );
  });

  it('should be give success message when service get successfully.', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const productInfo = await request
      .get('/customer/getServiceList')
      .expect(HttpStatus.OK);

    expect(productInfo._body.statusCode).toEqual(HttpStatus.OK);
    expect(productInfo._body.status).toEqual(ResponseStatus.SUCCESS);
  });

  it('should give error message when the token is not added.', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const listOfProduct = await request
      .get(
        `/service/listOfService?sortKey=${service.pagination.sortKey}?sortValue=${service.pagination.sortValue}?pageSize=${service.pagination.pageSize}?page=${service.pagination.page}?searchBar=${service.pagination.searchBar}`,
      )
      .expect(HttpStatus.UNAUTHORIZED);

    expect(listOfProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(listOfProduct._body.message).toContain('Unauthorized');
  });

  it('should give error message when provide wrong token.', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const listOfProduct = await request
      .get(
        `/service/listOfService?sortKey=${service.pagination.sortKey}?sortValue=${service.pagination.sortValue}?pageSize=${service.pagination.pageSize}?page=${service.pagination.page}?searchBar=${service.pagination.searchBar}`,
      )
      .set('Authorization', Token.WRONG_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(listOfProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(listOfProduct._body.message).toContain('Unauthorized');
  });

  it('should give error message when provide expire token.', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const listOfProduct = await request
      .get(
        `/service/listOfService?sortKey=${service.pagination.sortKey}?sortValue=${service.pagination.sortValue}?pageSize=${service.pagination.pageSize}?page=${service.pagination.page}?searchBar=${service.pagination.searchBar}`,
      )
      .set('Authorization', Token.EXPIRE_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(listOfProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(listOfProduct._body.message).toContain('Unauthorized');
  });

  it('should be give error message if list of product not get', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const listOfProduct = await request
      .get(
        `/service/listOfService?searchBar=${service.wrongPagination.searchBar}`,
      )
      .set('Authorization', Token.ADMIN_TOKEN)
      .expect(HttpStatus.OK);

    expect(listOfProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(listOfProduct._body.status).toEqual(ResponseStatus.ERROR);
    expect(listOfProduct._body.message).toContain(
      `Service ${Messages.NOT_FOUND}`,
    );
  });

  it('should be give success message if list of Service get successfully', async () => {
    console.log('get');

    jest.setTimeout(10000);

    const listOfProduct: any = await request
      .get(
        `/service/listOfService?${service.pagination.sortKey}?${service.pagination.sortValue}?${service.pagination.pageSize}?${service.pagination.page}?${service.pagination.searchBar}`,
      )
      .set('Authorization', Token.ADMIN_TOKEN)
      .expect(HttpStatus.OK);

    expect(listOfProduct._body.statusCode).toEqual(HttpStatus.OK);
    expect(listOfProduct._body.status).toEqual(ResponseStatus.SUCCESS);
  });

  it('should give error message when the token is not added.', async () => {
    console.log('delete');

    jest.setTimeout(10000);

    const deleteProduct = await request
      .delete(`/service/deleteService/${serviceId}`)
      .expect(HttpStatus.UNAUTHORIZED);

    console.log('delete=======serviceId', serviceId);

    expect(deleteProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(deleteProduct._body.message).toContain('Unauthorized');
  });

  it('should give error message when provide wrong token.', async () => {
    console.log('delete');

    jest.setTimeout(10000);

    const deleteProduct = await request
      .delete(`/service/deleteService/${serviceId}`)
      .set('Authorization', Token.WRONG_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(deleteProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(deleteProduct._body.message).toContain('Unauthorized');
  });

  it('should give error message when provide expire token.', async () => {
    console.log('delete');

    jest.setTimeout(10000);

    const deleteProduct = await request
      .delete(`/service/deleteService/${serviceId}`)
      .set('Authorization', Token.EXPIRE_TOKEN)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(deleteProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
    expect(deleteProduct._body.message).toContain('Unauthorized');
  });

  it('should give validation error message if serviceId is not a number.', async () => {
    console.log('delete');

    jest.setTimeout(10000);

    const deleteProduct = await request
      .delete(`/service/deleteService/${stringId}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .expect(HttpStatus.OK);

    expect(deleteProduct._body.statusCode).toEqual(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(deleteProduct._body.message).toEqual('Internal server error');
  });

  it('should give validation error message if serviceId is not a provide.', async () => {
    
    jest.setTimeout(10000);

    const deleteProduct = await request
      .delete(`/service/deleteService/${requiredId}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .expect(HttpStatus.OK);

    expect(deleteProduct._body.statusCode).toEqual(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(deleteProduct._body.message).toEqual('Internal server error');
  });

  it('should give error if service not found.', async () => {
    console.log('delete');

    jest.setTimeout(10000);

    const findProduct = await request
      .delete(`/service/deleteService/${1}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .expect(HttpStatus.OK);

    expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
    expect(findProduct._body.message).toContain(
      `Service ${Messages.NOT_FOUND}`,
    );
  });

  it('should be give success message if delete service successfully.', async () => {
    console.log('delete');

    jest.setTimeout(10000);

    const deleteProduct = await request
      .delete(`/service/deleteService/${serviceId}`)
      .set('Authorization', Token.ADMIN_TOKEN)
      .expect(HttpStatus.OK);

    expect(deleteProduct._body.statusCode).toEqual(HttpStatus.OK);
    expect(deleteProduct._body.status).toEqual(ResponseStatus.SUCCESS);
    expect(deleteProduct._body.message).toContain(
      `Service ${Messages.DELETE_SUCCESS}`,
    );
  });
});
