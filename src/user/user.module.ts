import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { Inquiry } from 'src/lib/entities/inquiry.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/lib/services/auth/strategy/jwt.strategy';
import { Otp } from 'src/lib/entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Inquiry, Otp]),
    JwtModule.register({
      secret: process.env.JWTSecretKey,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
