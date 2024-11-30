import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './productImage.entity';
import { ProductBenefit } from './productBenefit.entity';
import { ProductExpertise } from './productExpertise.entity';
import { ProductMethodology } from './productMethodology.entity';
import { ProductService } from './productService.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  product_name: string;

  @Column({ length: 255, default: null })
  description: string;

  @Column({ length: 255, nullable: false })
  contact_us: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @OneToMany(() => ProductImage, (productImage) => productImage.product_id)
  productImage: ProductImage[];

  @OneToMany(
    () => ProductBenefit,
    (productBenefit) => productBenefit.product_id,
  )
  productBenefit: ProductBenefit[];

  @OneToMany(
    () => ProductExpertise,
    (productExpertise) => productExpertise.product_id,
  )
  productExpertise: ProductExpertise[];

  @OneToMany(
    () => ProductMethodology,
    (productMethodology) => productMethodology.product_id,
  )
  productMethodology: ProductMethodology[];

  @OneToMany(
    () => ProductService,
    (productService) => productService.product_id,
  )
  productService: ProductService[];
}
