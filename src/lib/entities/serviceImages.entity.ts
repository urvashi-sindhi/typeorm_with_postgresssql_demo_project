import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from './service.entity';

@Entity()
export class ServiceImage {
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

  @ManyToOne(() => Service, (service) => service.serviceDetails)
  @JoinColumn({ name: 'service_id' })
  @Column({ nullable: false })
  service_id: number;
}
