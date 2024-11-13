import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './lib/entities/user.entity';
import * as dotenv from 'dotenv';
import { Inquiry } from './lib/entities/inquiry.entity';
import { JwtService } from '@nestjs/jwt';
import { Otp } from './lib/entities/otp.entity';
import { InquiryModule } from './inquiry/inquiry.module';
import { UserModule } from './user/user.module';
dotenv.config();

const config: any = {
  type: 'postgres',
  autoLoadEntities: true,
  entities: [Inquiry, User, Otp],
  define: {
    timestamps: false,
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...config,
      host: process.env.DATABASE_HOST,
      port: process.env.DB_PORT,
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERS,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: false,
    }),
    InquiryModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
