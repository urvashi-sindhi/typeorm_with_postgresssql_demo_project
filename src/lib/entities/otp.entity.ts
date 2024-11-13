import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  otp: number;

  @Column({ nullable: false })
  expiration_time: string;

  @Column({ length: 50, nullable: false })
  email: string;
}
