import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250, nullable: false })
  overview_image: string;

  @Column({ length: 250, nullable: false })
  service_image: string;

  @Column({ length: 250, nullable: false })
  right_sidebar_image_1: string;

  @Column({ length: 250, nullable: false })
  right_sidebar_image_2: string;

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

  @ManyToOne(() => Product, (product) => product.productImage)
  @JoinColumn({ name: 'product_id' })
  @Column({ nullable: false })
  product_id: number;
}
