import { Module } from '@nestjs/common';
import { ProductServices } from './product.service';
import { ProductController } from './product.controller';
import { Product } from 'src/lib/entities/product.entity';
import { ProductImage } from 'src/lib/entities/productImage.entity';
import { ProductBenefit } from 'src/lib/entities/productBenefit.entity';
import { ProductServiceDetails } from 'src/lib/entities/productServiceDetails.entity';
import { ProductExpertise } from 'src/lib/entities/productExpertise.entity';
import { ProductMethodology } from 'src/lib/entities/productMethodology.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from 'src/lib/entities/productService.entity';

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
