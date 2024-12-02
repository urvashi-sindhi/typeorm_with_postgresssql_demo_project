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
import { Product } from './lib/entities/product.entity';
import { ProductImage } from './lib/entities/productImage.entity';
import { ProductBenefit } from './lib/entities/productBenefit.entity';
import { ProductExpertise } from './lib/entities/productExpertise.entity';
import { ProductMethodology } from './lib/entities/productMethodology.entity';
import { ProductService } from './lib/entities/productService.entity';
import { ProductServiceDetails } from './lib/entities/productServiceDetails.entity';
import { ProductModule } from './product/product.module';
import { Service } from './lib/entities/service.entity';
import { ServiceDetails } from './lib/entities/serviceDetails.entity';
import { SubService } from './lib/entities/subService.entity';
import { ServiceImage } from './lib/entities/serviceImages.entity';
import { ServiceModule } from './service/service.module';
import { GoogleStrategy } from './lib/services/auth/strategy/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { TwitterStrategy } from './lib/services/auth/strategy/twitter.strategy';
import { FacebookStrategy } from './lib/services/auth/strategy/facebook.strategy';
import { InstagramStrategy } from './lib/services/auth/strategy/instagram.strategy';
dotenv.config();

const config: any = {
  type: 'postgres',
  autoLoadEntities: true,
  entities: [
    User,
    Inquiry,
    Otp,
    Product,
    ProductImage,
    ProductBenefit,
    ProductExpertise,
    ProductMethodology,
    ProductService,
    ProductServiceDetails,
    Service,
    ServiceDetails,
    SubService,
    ServiceImage,
  ],
  define: {
    timestamps: false,
  },
};

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'instagram' }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...config,
      host: process.env.DATABASE_HOST,
      port: process.env.DB_PORT,
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERS,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      logging: false,
    }),
    InquiryModule,
    UserModule,
    ProductModule,
    ServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, GoogleStrategy, TwitterStrategy, FacebookStrategy, InstagramStrategy],
})
export class AppModule {}
