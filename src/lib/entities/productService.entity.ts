import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductServiceDetails } from './productServiceDetails.entity';

@Entity()
export class ProductService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  product_service_type: string;

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

  @ManyToOne(() => Product, (product) => product.productService)
  @JoinColumn({ name: 'product_id' })
  @Column({ nullable: false })
  product_id: number;

  @OneToMany(
    () => ProductServiceDetails,
    (productServiceDetails) => productServiceDetails.product_service_id,
  )
  productServiceDetails: ProductServiceDetails[];
}
