import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductService } from './productService.entity';

@Entity()
export class ProductServiceDetails {
  @PrimaryGeneratedColumn()
  id: number;

  productServiceId: number;

  @Column({ length: 250, default: null })
  product_service_detail: string;

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

  @ManyToOne(
    () => ProductService,
    (ProductService) => ProductService.productServiceDetails,
  )
  @JoinColumn({ name: 'product_service_id' })
  @Column({ nullable: false })
  product_service_id: number;
}
