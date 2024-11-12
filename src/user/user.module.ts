import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Inquiry } from 'src/lib/entities/inquiry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/lib/services/auth/strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inquiry, User]),
    JwtModule.register({
      secret: process.env.JWTSecretKey,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
