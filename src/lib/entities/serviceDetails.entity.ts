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
import { ServiceType } from '../utils/enum';

@Entity()
export class ServiceDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250, nullable: false })
  services_details_point: string;

  @Column({
    type: 'enum',
    enum: [
      ServiceType.APPROACH,
      ServiceType.ATC,
      ServiceType.BENEFITS,
      ServiceType.CONSULTING,
    ],
  })
  services_details_type: string;

  @Column({ length: 250, default: null })
  services_details_description: string;

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

  @ManyToOne(() => Service, (service) => service.subService)
  @JoinColumn({ name: 'service_id' })
  @Column({ nullable: false })
  service_id: number;
}
