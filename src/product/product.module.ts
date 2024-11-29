import { Module } from '@nestjs/common';
import { ProductServices } from './product.service';
import { ProductController } from './product.controller';
import { Product } from '../lib/entities/product.entity';
import { ProductImage } from '../lib/entities/productImage.entity';
import { ProductBenefit } from '../lib/entities/productBenefit.entity';
import { ProductServiceDetails } from '../lib/entities/productServiceDetails.entity';
import { ProductExpertise } from '../lib/entities/productExpertise.entity';
import { ProductMethodology } from '../lib/entities/productMethodology.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from '../lib/entities/productService.entity';

@Module({
  imports: [
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
  ],
  controllers: [ProductController],
  providers: [ProductServices],
})
export class ProductModule {}
