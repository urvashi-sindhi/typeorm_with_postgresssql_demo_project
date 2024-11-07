import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  otp: number;

  @Column({ type: 'varchar', nullable: false })
  expiration_time: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;
}
