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
export class ProductExpertise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  expertise_area: string;

  @Column({ length: 250, default: null })
  expertise_description: string;

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

  @ManyToOne(() => Product, (product) => product.productExpertise)
  @JoinColumn({ name: 'product_id' })
  @Column({ nullable: false })
  product_id: number;
}
