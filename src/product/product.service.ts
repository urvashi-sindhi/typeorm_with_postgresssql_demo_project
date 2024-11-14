import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Product } from 'src/lib/entities/product.entity';
import { ProductBenefit } from 'src/lib/entities/productBenefit.entity';
import { ProductExpertise } from 'src/lib/entities/productExpertise.entity';
import { ProductImage } from 'src/lib/entities/productImage.entity';
import { ProductMethodology } from 'src/lib/entities/productMethodology.entity';
import { ProductService } from 'src/lib/entities/productService.entity';
import { ProductServiceDetails } from 'src/lib/entities/productServiceDetails.entity';
import { FileUploadDto } from './dto/fileUpload.dto';
import { Messages } from 'src/lib/utils/messages';
import { handleResponse } from 'src/lib/helpers/handleResponse';
import { ResponseStatus } from 'src/lib/utils/enum';
import { ProductDto } from './dto/product.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductServices {
  constructor(private dataSource: DataSource) {}
  async fileUpload(
    req: any,
    product_image: Express.Multer.File[],
    dto: FileUploadDto,
  ) {
    if (product_image.length === 0) {
      Logger.error(Messages.IMAGE_REQUIRE);
      return handleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseStatus.ERROR,
        Messages.IMAGE_REQUIRE,
      );
    }

    let productImage = [];

    if (req.files) {
      productImage = product_image.map((images: any) => {
        return {
          file: images.filename,
        };
      });
    }

    if (productImage.length > 0) {
      Logger.log(`Product image ${Messages.ADDED_SUCCESS}`);
      return handleResponse(
        HttpStatus.CREATED,
        ResponseStatus.SUCCESS,
        `Product image ${Messages.ADDED_SUCCESS}`,
        productImage,
      );
    }
  }

  async addProduct(dto: ProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const {
        product_name,
        description,
        contact_us,
        expertise_details,
        productBenefit,
        product_service,
        methodology_description,
        productImageDetail,
      } = dto;

      const findProduct = await queryRunner.manager.findOne(Product, {
        where: { product_name },
      });

      if (findProduct) {
        Logger.error(`Product ${Messages.ALREADY_EXIST}`);
        return handleResponse(
          HttpStatus.CONFLICT,
          ResponseStatus.ERROR,
          `Product ${Messages.ALREADY_EXIST}`,
        );
      }

      const createProduct = await queryRunner.manager.save(Product, {
        product_name,
        description,
        contact_us,
      });

      const productId = createProduct.id;

      if (createProduct) {
        if (productImageDetail) {
          const createProductImage = productImageDetail.map((images) => {
            return {
              overview_image: images.overview_image,
              service_image: images.service_image,
              right_sidebar_image_1: images.right_sidebar_image_1,
              right_sidebar_image_2: images.right_sidebar_image_2,
              product_id: productId,
            };
          });

          await queryRunner.manager.insert(ProductImage, createProductImage);
        }

        if (productBenefit) {
          const createProductBenefits = productBenefit.map((benefit) => {
            return {
              product_benefit: benefit.product_benefit,
              product_id: productId,
            };
          });

          await queryRunner.manager.insert(
            ProductBenefit,
            createProductBenefits,
          );
        }

        if (product_service) {
          for (const item of product_service) {
            const productServiceDetail = {
              product_service_type: item.type,
              product_id: productId,
            };

            const createProductService = await queryRunner.manager.insert(
              ProductService,
              productServiceDetail,
            );

            const productServiceId = createProductService.raw[0].id;

            for (const value of item.product_service_detail) {
              await queryRunner.manager.save(ProductServiceDetails, {
                product_service_detail: value,
                product_service_id: productServiceId,
              });
            }
          }
        }

        if (expertise_details) {
          const createExpertise = expertise_details.map((expertise) => {
            return {
              expertise_area: expertise.expertise_area,
              expertise_description: expertise.expertise_description,
              product_id: productId,
            };
          });

          await queryRunner.manager.insert(ProductExpertise, createExpertise);
        }

        if (methodology_description) {
          const createMethodology = methodology_description.map(
            (descriptions) => {
              return {
                methodology_description: descriptions,
                product_id: productId,
              };
            },
          );

          await queryRunner.manager.insert(
            ProductMethodology,
            createMethodology,
          );
        }

        await queryRunner.commitTransaction();

        Logger.log(`Product ${Messages.ADDED_SUCCESS}`);
        return handleResponse(
          HttpStatus.CREATED,
          ResponseStatus.SUCCESS,
          `Product ${Messages.ADDED_SUCCESS}`,
          { id: productId },
        );
      }
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      Logger.error(Messages.SERVER_ERROR);
      return handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseStatus.ERROR,
        Messages.SERVER_ERROR,
        undefined,
        error.message,
      );
    }
  }

  async editProduct(productId: number, dto: ProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const {
        product_name,
        description,
        contact_us,
        expertise_details,
        productBenefit,
        product_service,
        methodology_description,
        productImageDetail,
      } = dto;

      const findProduct = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
      });

      if (!findProduct) {
        Logger.error(`Product ${Messages.NOT_FOUND}`);
        return handleResponse(
          HttpStatus.NOT_FOUND,
          ResponseStatus.ERROR,
          `Product ${Messages.NOT_FOUND}`,
        );
      }

      await queryRunner.manager.update(
        Product,
        { id: productId },
        {
          product_name,
          description,
          contact_us,
        },
      );

      if (productImageDetail) {
        await queryRunner.manager.delete(ProductImage, {
          product_id: productId,
        });

        const createProductImage = productImageDetail.map((images) => {
          return {
            overview_image: images.overview_image,
            service_image: images.service_image,
            right_sidebar_image_1: images.right_sidebar_image_1,
            right_sidebar_image_2: images.right_sidebar_image_2,
            product_id: productId,
          };
        });

        await queryRunner.manager.insert(ProductImage, createProductImage);
      }

      if (productBenefit) {
        await queryRunner.manager.delete(ProductBenefit, {
          product_id: productId,
        });

        const createProductBenefits = productBenefit.map((benefit) => {
          return {
            product_benefit: benefit.product_benefit,
            product_id: productId,
          };
        });

        await queryRunner.manager.insert(ProductBenefit, createProductBenefits);
      }

      if (product_service) {
        const findProductService = await queryRunner.manager.find(
          ProductService,
          {
            where: { product_id: productId },
          },
        );

        if (findProductService.length > 0) {
          for (const service of findProductService) {
            await queryRunner.manager.delete(ProductServiceDetails, {
              product_service_id: service.id,
            });
          }
        }

        await queryRunner.manager.delete(ProductService, {
          product_id: productId,
        });

        for (const item of product_service) {
          const productServiceDetail = {
            product_service_type: item.type,
            product_id: productId,
          };

          const createProductService = await queryRunner.manager.insert(
            ProductService,
            productServiceDetail,
          );

          const productServiceId = createProductService.raw[0].id;

          for (const value of item.product_service_detail) {
            await queryRunner.manager.save(ProductServiceDetails, {
              product_service_detail: value,
              product_service_id: productServiceId,
            });
          }
        }
      }

      if (expertise_details) {
        await queryRunner.manager.delete(ProductExpertise, {
          product_id: productId,
        });

        const createExpertise = expertise_details.map((expertise) => {
          return {
            expertise_area: expertise.expertise_area,
            expertise_description: expertise.expertise_description,
            product_id: productId,
          };
        });

        await queryRunner.manager.insert(ProductExpertise, createExpertise);
      }

      if (methodology_description) {
        await queryRunner.manager.delete(ProductMethodology, {
          product_id: productId,
        });

        const createMethodology = methodology_description.map(
          (descriptions) => {
            return {
              methodology_description: descriptions,
              product_id: productId,
            };
          },
        );

        await queryRunner.manager.insert(ProductMethodology, createMethodology);
      }

      await queryRunner.commitTransaction();

      Logger.log(`Product ${Messages.UPDATE_SUCCESS}`);
      return handleResponse(
        HttpStatus.ACCEPTED,
        ResponseStatus.SUCCESS,
        `Product ${Messages.UPDATE_SUCCESS}`,
      );
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      Logger.error(Messages.SERVER_ERROR);
      return handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseStatus.ERROR,
        Messages.SERVER_ERROR,
        undefined,
        error.message,
      );
    }
  }
}
