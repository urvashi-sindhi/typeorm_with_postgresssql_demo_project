import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../lib/entities/service.entity';
import { ServiceImage } from '../lib/entities/serviceImages.entity';
import { SubService } from '../lib/entities/subService.entity';
import { ServiceDetails } from '../lib/entities/serviceDetails.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      ServiceImage,
      SubService,
      ServiceDetails,
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
