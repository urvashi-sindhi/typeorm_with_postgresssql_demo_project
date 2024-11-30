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
export class SubService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  sub_service_title: string;

  @Column({ length: 250, default: null })
  sub_service_description: string;

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
