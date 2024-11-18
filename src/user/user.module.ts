import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../lib/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../lib/services/auth/strategy/jwt.strategy';
import { Otp } from '../lib/entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    JwtModule.register({
      secret: process.env.JWTSecretKey,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
