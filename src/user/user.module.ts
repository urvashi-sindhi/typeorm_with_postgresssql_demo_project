import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { Inquiry } from 'src/lib/entities/inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Inquiry])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
