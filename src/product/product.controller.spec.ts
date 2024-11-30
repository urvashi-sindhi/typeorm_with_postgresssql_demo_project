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
import { product } from './productVariable';
import { ResponseStatus, Token } from '../lib/utils/enum';
import { Messages } from '../lib/utils/messages';
import { ProductServices } from './product.service';
import { DataSource } from 'typeorm';
import * as chai from 'chai';
import * as request from 'supertest';

const expect = chai.expect;

describe('ProductController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let server: any;
  let productId = null;
  let stringId = 'abc';
  let requiredId: number;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        AppModule,
        ProductModule,
        TypeOrmModule.forFeature([
          Product,
          ProductImage,
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
    server = app.getHttpServer();

    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(ProductImage).execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductBenefit)
      .execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductServiceDetails)
      .execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductService)
      .execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductExpertise)
      .execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductMethodology)
      .execute();
    await dataSource.createQueryBuilder().delete().from(Product).execute();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(ProductImage).execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductBenefit)
      .execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductServiceDetails)
      .execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductService)
      .execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductExpertise)
      .execute();
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(ProductMethodology)
      .execute();
    await dataSource.createQueryBuilder().delete().from(Product).execute();

    await app.close();
  });

  describe('POST /api/product/addProduct', () => {
    it('should return unauthorized if no token is provided', async () => {
      const res = await request(server).post('/product/addProduct');
      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should return unauthorized for an invalid token', async () => {
      const res = await request(server)
        .post('/product/addProduct')
        .set('Authorization', Token.WRONG_TOKEN);

      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const res = await request(server)
        .post(`/product/addProduct`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should return a validation error for an empty payload', async () => {
      const res = await request(server)
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.emptyPayload);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body.status).to.equal(ResponseStatus.ERROR);
      expect(res.body.message).to.include(Messages.SERVER_ERROR);
    });

    it('should be give validation error if product_name is not valid type', async () => {
      const res = await request(server)
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.checkValidationType)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.status).to.equal(HttpStatus.BAD_REQUEST);
      expect(res.body.message).to.deep.equal(['product_name must be a string']);
    });

    it('should be give required validation error if contact us is not provide', async () => {
      const res = await request(server)
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.requiredValidation)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.status).to.equal(ResponseStatus.ERROR);
      expect(res.body.message).equal(Messages.SERVER_ERROR);
    });

    it('should return conflict error if product already exists', async () => {
      const res = await request(server)
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.alreadyExist)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.CONFLICT);
      expect(res.body.status).to.equal(ResponseStatus.ERROR);
      expect(res.body.message).equal(Messages.ALREADY_EXIST);
    });

    it('should successfully create a product', async () => {
      const res = await request(server)
        .post('/product/addProduct')
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.productInfo);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(res.body.message).equal(`Product ${Messages.ADDED_SUCCESS}`);
      productId = res.body.data.id;
    });
  });

  describe('PUT /api/product/editProduct/:productId', () => {
    it('should return unauthorized if no token is provided', async () => {
      const res = await request(server).put(
        `/product/editProduct/${productId}`,
      );
      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should return unauthorized for an invalid token', async () => {
      const res = await request(server)
        .put(`/product/editProduct/${productId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.productInfo);

      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const res = await request(server)
        .put(`/product/editProduct/${productId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.productInfo);

      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should give validation error message if productId is not a number.', async () => {
      const res = await request(server)
        .put(`/product/editProduct/${stringId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.productInfo)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.message).to.equal('Internal server error');
    });

    it('should give validation error message if productId is not a provide.', async () => {
      const res = await request(server)
        .put(`/product/editProduct/${requiredId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.productInfo)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.message).to.equal('Internal server error');
    });

    it('should be give validation error if product name is not valid type', async () => {
      const res = await request(server)
        .put(`/product/editProduct/${productId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.checkValidationType)
        .expect(HttpStatus.BAD_REQUEST);

      expect(res.body.statusCode).to.equal(HttpStatus.BAD_REQUEST);
      expect(res.body.message).to.deep.equal(['product_name must be a string']);
    });

    it('should give error if product not found.', async () => {
      const res = await request(server)
        .put(`/product/editProduct/${1}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.productInfo)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res.body.status).to.equal(ResponseStatus.ERROR);
      expect(res.body.message).to.include(`Product ${Messages.NOT_FOUND}`);
    });

    it('should successfully edit the product', async () => {
      const res = await request(server)
        .put(`/product/editProduct/${productId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .send(product.productInfo);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(res.body.message).to.include(`Product ${Messages.UPDATE_SUCCESS}`);
    });
  });

  describe('GET /api/customer/viewProduct/:productId', () => {
    it('should give validation error message if productId is not a number.', async () => {
      const res = await request(server)
        .get(`/customer/viewProduct/${stringId}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(res.body.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.message).to.equal('Internal server error');
    });

    it('should give validation error message if productId is not a provide.', async () => {
      const res = await request(server)
        .get(`/customer/viewProduct/${requiredId}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      expect(res.body.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.message).to.equal('Internal server error');
    });

    it('should give error if product not found.', async () => {
      const res = await request(server)
        .get(`/customer/viewProduct/${1}`)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res.body.status).to.equal(ResponseStatus.ERROR);
      expect(res.body.message).to.include(`Product ${Messages.NOT_FOUND}`);
    });

    it('should return the product successfully', async () => {
      const res = await request(server).get(
        `/customer/viewProduct/${productId}`,
      );
      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body.status).to.equal(ResponseStatus.SUCCESS);
    });
  });

  describe('GET api/customer/getProductList', () => {
    it('should give error if product not found.', async () => {
      const res = await request(server)
        .get('/customer/getProductList')
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res.body.status).to.equal(ResponseStatus.ERROR);
      expect(res.body.message).to.include(`Product ${Messages.NOT_FOUND}`);
    });

    it('should be give success message when product getting .', async () => {
      const res: any = await request(server)
        .get('/customer/getProductList')
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.OK);
      expect(res.body.status).to.equal(ResponseStatus.SUCCESS);
    });
  });

  describe('GET api/product/listOfProduct', () => {
    it('should give error message when the token is not added.', async () => {
      const res: any = await request(server)
        .get(
          `/product/listOfProduct?${product.pagination.sortKey}?${product.pagination.sortValue}?${product.pagination.pageSize}?${product.pagination.page}${product.pagination.searchBar}`,
        )
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const res: any = await request(server)
        .get(
          `/product/listOfProduct?${product.pagination.sortKey}?${product.pagination.sortValue}?${product.pagination.pageSize}?${product.pagination.page}${product.pagination.searchBar}`,
        )
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const res: any = await request(server)
        .get(
          `/product/listOfProduct?${product.pagination.sortKey}?${product.pagination.sortValue}?${product.pagination.pageSize}?${product.pagination.page}${product.pagination.searchBar}`,
        )
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should be give error message if list of product not get', async () => {
      const res: any = await request(server)
        .get(
          `/product/listOfProduct?searchBar=${product.wrongPagination.searchBar}`,
        )
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res.body.status).to.equal(ResponseStatus.ERROR);
      expect(res.body.message).to.include(`Product ${Messages.NOT_FOUND}`);
    });

    it('should be give success message if list of product get successfully', async () => {
      const res: any = await request(server)
        .get(
          `/product/listOfProduct?${product.pagination.sortKey}?${product.pagination.sortValue}?${product.pagination.pageSize}?${product.pagination.page}${product.pagination.searchBar}`,
        )
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.OK);
      expect(res.body.status).to.equal(ResponseStatus.SUCCESS);
    });
  });

  describe('DELETE /api/product/deleteProduct/:productId', () => {
    it('should give error message when the token is not added.', async () => {
      const res: any = await request(server)
        .delete(`/product/deleteProduct/${1}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide wrong token.', async () => {
      const res: any = await request(server)
        .delete(`/product/deleteProduct/${1}`)
        .set('Authorization', Token.WRONG_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should give error message when provide expire token.', async () => {
      const res: any = await request(server)
        .delete(`/product/deleteProduct/${1}`)
        .set('Authorization', Token.EXPIRE_TOKEN)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(res.body.statusCode).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('Unauthorized');
    });

    it('should give validation error message if productId is not a number.', async () => {
      const res: any = await request(server)
        .delete(`/product/deleteProduct/'123'`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.message).to.equal('Internal server error');
    });

    it('should give validation error message if productId is not a provide.', async () => {
      const res: any = await request(server)
        .delete(`/product/deleteProduct/${requiredId}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.message).to.equal('Internal server error');
    });

    it('should give error if product not found.', async () => {
      const res: any = await request(server)
        .delete(`/product/deleteProduct/${1}`)
        .set('Authorization', Token.ADMIN_TOKEN)
        .expect(HttpStatus.OK);

      expect(res.body.statusCode).to.equal(HttpStatus.NOT_FOUND);
      expect(res.body.status).to.equal(ResponseStatus.ERROR);
      expect(res.body.message).to.include(`Product ${Messages.NOT_FOUND}`);
    });

    it('should successfully delete the product', async () => {
      const res: any = await request(server)
        .delete(`/product/deleteProduct/${productId}`)
        .set('Authorization', Token.ADMIN_TOKEN);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body.status).to.equal(ResponseStatus.SUCCESS);
      expect(res.body.message).to.include(`Product ${Messages.DELETE_SUCCESS}`);
    });
  });
});
