import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceImage } from './serviceImages.entity';
import { SubService } from './subService.entity';
import { ServiceDetails } from './serviceDetails.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: null })
  service_name: string;

  @Column({ length: 255, default: null })
  service_description: string;

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

  @OneToMany(() => ServiceImage, (serviceImage) => serviceImage.service_id)
  serviceImage: ServiceImage[];

  @OneToMany(() => SubService, (subService) => subService.service_id)
  subService: SubService[];

  @OneToMany(
    () => ServiceDetails,
    (serviceDetails) => serviceDetails.service_id,
  )
  serviceDetails: ServiceDetails[];
}
