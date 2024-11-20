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

  //   it('should give error message when the token is not added.', async () => {
  //     console.log('put');

  //     const editProduct = await request
  //       .put(`/product/editProduct/${productId}`)
  //       .expect(HttpStatus.UNAUTHORIZED);
  //     console.log('edit====productId', productId);

  //     expect(editProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(editProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should give error message when provide wrong token.', async () => {
  //     console.log('put');

  //     const editProduct = await request
  //       .put(`/product/editProduct/${productId}`)
  //       .set('Authorization', Token.WRONG_TOKEN)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(editProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(editProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should give error message when provide expire token.', async () => {
  //     console.log('put');

  //     const editProduct = await request
  //       .put(`/product/editProduct/${productId}`)
  //       .set('Authorization', Token.EXPIRE_TOKEN)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(editProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(editProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should be give validation error if product name is not valid type', async () => {
  //     console.log('put');

  //     const editProduct = await request
  //       .put(`/product/editProduct/${productId}`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .send(product.checkValidationType)
  //       .expect(HttpStatus.BAD_REQUEST);

  //     expect(editProduct._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  //     expect(editProduct._body.message).toEqual([
  //       'product_name must be a string',
  //     ]);
  //   });

  //   it('should give validation error message if productId is not a number.', async () => {
  //     console.log('put');

  //     const editProduct = await request
  //       .put(`/product/editProduct/${stringId}`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .send(product.productInfo)
  //       .expect(HttpStatus.OK);

  //     expect(editProduct._body.statusCode).toEqual(
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //     expect(editProduct._body.message).toEqual('Internal server error');
  //   });

  //   it('should give validation error message if productId is not a provide.', async () => {
  //     console.log('put');

  //     const editProduct = await request
  //       .put(`/product/editProduct/${requiredId}`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .send(product.productInfo)
  //       .expect(HttpStatus.OK);

  //     expect(editProduct._body.statusCode).toEqual(
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //     expect(editProduct._body.message).toEqual('Internal server error');
  //   });

  //   it('should give error if product not found.', async () => {
  //     const findProduct = await request
  //       .put(`/product/editProduct/${1}`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .send(product.productInfo)
  //       .expect(HttpStatus.OK);

  //     expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
  //     expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
  //     expect(findProduct._body.message).toContain(
  //       `Product ${Messages.NOT_FOUND}`,
  //     );
  //   });

  //   it('should be give success message if update product ', async () => {
  //     console.log('put');

  //     const editProduct = await request
  //       .put(`/product/editProduct/${productId}`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .send(product.productInfo)
  //       .expect(HttpStatus.OK);

  //     expect(editProduct._body.statusCode).toEqual(HttpStatus.ACCEPTED);
  //     expect(editProduct._body.status).toEqual(ResponseStatus.SUCCESS);
  //     expect(editProduct._body.message).toContain(
  //       `Product ${Messages.UPDATE_SUCCESS}`,
  //     );
  //   });

  //   it('should give validation error message if inquiryId is not a number.', async () => {
  //     console.log('get');

  //     const viewProduct = await request
  //       .get(`/customer/viewProduct/${stringId}`)
  //       .expect(HttpStatus.INTERNAL_SERVER_ERROR);

  //     console.log('productId', productId);
  //     expect(viewProduct._body.statusCode).toEqual(
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //     expect(viewProduct._body.message).toEqual('Internal server error');
  //   });

  //   it('should give validation error message if inquiryId is not a provide.', async () => {
  //     console.log('get');

  //     const viewProduct = await request
  //       .get(`/customer/viewProduct/${requiredId}`)
  //       .expect(HttpStatus.INTERNAL_SERVER_ERROR);

  //     expect(viewProduct._body.statusCode).toEqual(
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //     expect(viewProduct._body.message).toEqual('Internal server error');
  //   });

  //   it('should be give success message if view product ', async () => {
  //     console.log('get');

  //     const viewProduct = await request
  //       .get(`/customer/viewProduct/${productId}`)
  //       .expect(HttpStatus.OK);

  //     expect(viewProduct._body.statusCode).toEqual(HttpStatus.OK);
  //     expect(viewProduct._body.status).toEqual(ResponseStatus.SUCCESS);
  //   });

  //   it('should give error if product not found.', async () => {
  //     console.log('get');

  //     const findProduct = await request
  //       .get(`/customer/viewProduct/${1}`)
  //       .expect(HttpStatus.OK);

  //     expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
  //     expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
  //     expect(findProduct._body.message).toContain(
  //       `Product ${Messages.NOT_FOUND}`,
  //     );
  //   });

  //   it('should give error if product not found.', async () => {
  //     console.log('get');

  //     const findProduct = await request
  //       .get('/customer/getProductList')
  //       .expect(HttpStatus.OK);

  //     expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
  //     expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
  //     expect(findProduct._body.message).toContain(
  //       `Product ${Messages.NOT_FOUND}`,
  //     );
  //   });

  //   it('should be give success message when product get.', async () => {
  //     console.log('get');

  //     const productInfo = await request
  //       .get('/customer/getProductList')
  //       .expect(HttpStatus.OK);

  //     expect(productInfo._body.statusCode).toEqual(HttpStatus.OK);
  //     expect(productInfo._body.status).toEqual(ResponseStatus.SUCCESS);
  //   });

  //   it('should give error message when the token is not added.', async () => {
  //     console.log('get');

  //     const listOfProduct = await request
  //       .get(
  //         `/product/listOfProduct?${product.pagination.sortKey}?${product.pagination.sortValue}?${product.pagination.pageSize}?${product.pagination.page}${product.pagination.searchBar}`,
  //       )
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(listOfProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(listOfProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should give error message when provide wrong token.', async () => {
  //     console.log('get');

  //     const listOfProduct = await request
  //       .get(
  //         `/product/listOfProduct?${product.pagination.sortKey}?${product.pagination.sortValue}?${product.pagination.pageSize}?${product.pagination.page}${product.pagination.searchBar}`,
  //       )
  //       .set('Authorization', Token.WRONG_TOKEN)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(listOfProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(listOfProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should give error message when provide expire token.', async () => {
  //     console.log('get');

  //     const listOfProduct = await request
  //       .get(
  //         `/product/listOfProduct?${product.pagination.sortKey}?${product.pagination.sortValue}?${product.pagination.pageSize}?${product.pagination.page}${product.pagination.searchBar}`,
  //       )
  //       .set('Authorization', Token.EXPIRE_TOKEN)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(listOfProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(listOfProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should be give success message if list of product get successfully', async () => {
  //     console.log('get');

  //     const listOfProduct: any = await request
  //       .get(
  //         `/product/listOfProduct?${product.pagination.sortKey}?${product.pagination.sortValue}?${product.pagination.pageSize}?${product.pagination.page}${product.pagination.searchBar}`,
  //       )
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .expect(HttpStatus.OK);

  //     expect(listOfProduct._body.statusCode).toEqual(HttpStatus.OK);
  //     expect(listOfProduct._body.status).toEqual(ResponseStatus.SUCCESS);
  //   });

  //   it('should be give error message if list of product not get', async () => {
  //     console.log('get');

  //     const listOfProduct = await request
  //       .get(
  //         `/product/listOfProduct?searchBar=${product.wrongPagination.searchBar}`,
  //       )
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .expect(HttpStatus.OK);

  //     expect(listOfProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
  //     expect(listOfProduct._body.status).toEqual(ResponseStatus.ERROR);
  //     expect(listOfProduct._body.message).toContain(
  //       `Product ${Messages.NOT_FOUND}`,
  //     );
  //   });

  //   it('should give error message when the token is not added.', async () => {
  //     console.log('delete');

  //     const deleteProduct = await request
  //       .delete(`/product/deleteProduct/${productId}`)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     console.log('delete=======productId', productId);

  //     expect(deleteProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(deleteProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should give error message when provide wrong token.', async () => {
  //     console.log('delete');

  //     const deleteProduct = await request
  //       .delete(`/product/deleteProduct/${productId}`)
  //       .set('Authorization', Token.WRONG_TOKEN)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(deleteProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(deleteProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should give error message when provide expire token.', async () => {
  //     console.log('delete');

  //     const deleteProduct = await request
  //       .delete(`/product/deleteProduct/${productId}`)
  //       .set('Authorization', Token.EXPIRE_TOKEN)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(deleteProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(deleteProduct._body.message).toContain('Unauthorized');
  //   });

  //   it('should give validation error message if productId is not a number.', async () => {
  //     console.log('delete');

  //     const deleteProduct = await request
  //       .delete(`/product/deleteProduct/'123'`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .expect(HttpStatus.OK);

  //     expect(deleteProduct._body.statusCode).toEqual(
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //     expect(deleteProduct._body.message).toEqual('Internal server error');
  //   });

  //   it('should give validation error message if productId is not a provide.', async () => {
  //     const deleteProduct = await request
  //       .delete(`/product/deleteProduct/${requiredId}`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .expect(HttpStatus.OK);

  //     expect(deleteProduct._body.statusCode).toEqual(
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //     expect(deleteProduct._body.message).toEqual('Internal server error');
  //   });

  //   it('should give error if product not found.', async () => {
  //     console.log('delete');

  //     const findProduct = await request
  //       .delete(`/product/deleteProduct/${1}`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .expect(HttpStatus.OK);

  //     expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
  //     expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
  //     expect(findProduct._body.message).toContain(
  //       `Product ${Messages.NOT_FOUND}`,
  //     );
  //   });

  //   it('should be give success message if delete product ', async () => {
  //     console.log('delete');

  //     const deleteProduct = await request
  //       .delete(`/product/deleteProduct/${productId}`)
  //       .set('Authorization', Token.ADMIN_TOKEN)
  //       .expect(HttpStatus.OK);

  //     expect(deleteProduct._body.statusCode).toEqual(HttpStatus.OK);
  //     expect(deleteProduct._body.status).toEqual(ResponseStatus.SUCCESS);
  //     expect(deleteProduct._body.message).toContain(
  //       `Product ${Messages.DELETE_SUCCESS}`,
  //     );
  //   });
});
