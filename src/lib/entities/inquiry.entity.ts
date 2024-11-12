import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InquiryStatus } from '../utils/enum';

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: false })
  first_name: string;

  @Column({ length: 20, nullable: false })
  last_name: string;

  @Column({ length: 50, nullable: false, unique: true })
  email: string;

  @Column({ length: 255, default: 'null' })
  message: string;

  @Column({ length: 20, nullable: false })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: [InquiryStatus.PENDING, InquiryStatus.RESOLVE],
    default: InquiryStatus.PENDING,
    nullable: false,
  })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
