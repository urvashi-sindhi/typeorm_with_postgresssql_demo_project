import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../lib/entities/product.entity';
import { ProductBenefit } from '../lib/entities/productBenefit.entity';
import { ProductMethodology } from '../lib/entities/productMethodology.entity';
import { ProductExpertise } from '../lib/entities/productExpertise.entity';
import { ProductServiceDetails } from '../lib/entities/productServiceDetails.entity';
import { ProductService } from '../lib/entities/productService.entity';
import { ProductImage } from '../lib/entities/productImage.entity';
import { ProductModule } from './product.module';
import { AppModule } from '../app.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductController } from './product.controller';
import * as supertest from 'supertest';
import { product } from './productVariable';
import { ResponseStatus, Token } from '../lib/utils/enum';
import { Messages } from '../lib/utils/messages';
import { ProductServices } from './product.service';

describe('ProductController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let request: any;
  let productId: number;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppModule,
        ProductModule,
        TypeOrmModule.forFeature([
          Product,
          ProductImage,
          ProductBenefit,
          ProductBenefit,
          ProductService,
          ProductServiceDetails,
          ProductExpertise,
          ProductMethodology,
        ]),

        JwtModule.register({
          secret: 'JWTSecretKey',
          signOptions: { expiresIn: '24h' },
        }),
      ],
      controllers: [ProductController],
      providers: [ProductServices],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    request = supertest(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/product/addProduct', () => {
    it('should give error message when the token is not added.', async () => {
      const addProduct = await request
        .post(`/product/addProduct`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(addProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(addProduct._body.message).toContain('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const addProduct = await request
        .post(`/product/addProduct`)
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(addProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(addProduct._body.message).toContain('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const addProduct = await request
        .post(`/product/addProduct`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(addProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
      expect(addProduct._body.message).toContain('Unauthorized');
    });

    it('should be give validation error if pass empty payload ', async () => {
      const addProduct = await request
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send({})
        .expect(HttpStatus.OK);

      expect(addProduct._body.statusCode).toEqual(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(addProduct._body.status).toEqual(ResponseStatus.ERROR);
      expect(addProduct._body.message).toContain(Messages.SERVER_ERROR);
    });

    it('should be give validation error if product_name is not valid type', async () => {
      const addProduct = await request
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.checkValidationType)
        .expect(HttpStatus.BAD_REQUEST);

      expect(addProduct._body.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(addProduct._body.message).toEqual([
        'product_name must be a string',
      ]);
    });

    it('should be give required validation error if contact us is not provide', async () => {
      const addProduct = await request
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.requiredValidation)
        .expect(HttpStatus.OK);

      expect(addProduct._body.statusCode).toEqual(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(addProduct._body.status).toEqual(ResponseStatus.ERROR);
      expect(addProduct._body.message).toContain(Messages.SERVER_ERROR);
    });

    it('should return conflict error if inquiry already exists', async () => {
      const existingProduct = await request
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.alreadyExist)
        .expect(HttpStatus.OK);

      expect(existingProduct._body.statusCode).toEqual(HttpStatus.CONFLICT);
      expect(existingProduct._body.status).toEqual(ResponseStatus.ERROR);
      expect(existingProduct._body.message).toContain(Messages.ALREADY_EXIST);
    });

    it('should be give success message if product created successfully', async () => {
      const addProduct = await request
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.productInfo)
        .expect(HttpStatus.OK);

      console.log('addProduct', addProduct);

      productId = addProduct._body.data.id;

      expect(addProduct._body.statusCode).toEqual(HttpStatus.CREATED);
      expect(addProduct._body.status).toEqual(ResponseStatus.SUCCESS);
      expect(addProduct._body.message).toContain(
        `Product ${Messages.ADDED_SUCCESS}`,
      );
    });
  });

  // describe('PUT /api/product/editProduct/:productId', () => {
  //   it('should be give success message if update product ', async () => {
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

  //   it('should give error message when the token is not added.', async () => {
  //     const editProduct = await request
  //       .put(`/product/editProduct/${productId}`)
  //       .send(product.productInfo)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(editProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(editProduct._body.message).toContain('Unauthorized');
  //   });
  // });

  // describe('GET /api/customer/viewProduct/:productId', () => {
  //   it('should be give success message if view product ', async () => {
  //     const viewProduct = await request
  //       .get(`/customer/viewProduct/${productId}`)
  //       .expect(HttpStatus.OK);

  //     expect(viewProduct._body.statusCode).toEqual(HttpStatus.OK);
  //     expect(viewProduct._body.status).toEqual(ResponseStatus.SUCCESS);
  //   });

  //   it('should give error if product not found.', async () => {
  //     const findProduct = await request
  //       .get(`/customer/viewProduct/${1}`)
  //       .expect(HttpStatus.OK);

  //     expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
  //     expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
  //     expect(findProduct._body.message).toContain(
  //       `Product ${Messages.NOT_FOUND}`,
  //     );
  //   });
  // });

  // describe('DELETE /api/product/deleteProduct/:productId', () => {
  //   it('should be give success message if delete product ', async () => {
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

  //   it('should give error if product not found.', async () => {
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

  //   it('should give error message when the token is not added.', async () => {
  //     const deleteProduct = await request
  //       .delete(`/product/deleteProduct/${productId}`)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(deleteProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(deleteProduct._body.message).toContain('Unauthorized');
  //   });
  // });

  // describe('GET /api/customer/getProductList', () => {
  //   it('should be give success message when product getting.', async () => {
  //     const productInfo = await request
  //       .get('/customer/getProductList')
  //       .expect(HttpStatus.OK);

  //     expect(productInfo._body.statusCode).toEqual(HttpStatus.OK);
  //     expect(productInfo._body.status).toEqual(ResponseStatus.SUCCESS);
  //   });

  //   it('should give error if product not found.', async () => {
  //     const findProduct = await request
  //       .get('/customer/getProductList')
  //       .expect(HttpStatus.OK);

  //     expect(findProduct._body.statusCode).toEqual(HttpStatus.NOT_FOUND);
  //     expect(findProduct._body.status).toEqual(ResponseStatus.ERROR);
  //     expect(findProduct._body.message).toContain(
  //       `Product ${Messages.NOT_FOUND}`,
  //     );
  //   });
  // });

  // describe('GET /api/product/listOfProduct', () => {
  //   it('should be give success message if list of product get successfully', async () => {
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
  //     const listOfProduct = await request
  //       .get(
  //         `/product/listOfProduct?${product.wrongPagination.sortKey}?${product.wrongPagination.sortValue}?${product.wrongPagination.pageSize}?${product.wrongPagination.page}?${product.wrongPagination.searchBar}`,
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
  //     const listOfProduct = await request
  //       .get(`/product/listOfProduct`)
  //       .expect(HttpStatus.UNAUTHORIZED);

  //     expect(listOfProduct._body.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
  //     expect(listOfProduct._body.message).toContain('Unauthorized');
  //   });
  // });
});
