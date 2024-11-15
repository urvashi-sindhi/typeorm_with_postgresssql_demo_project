import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/lib/entities/service.entity';
import { ServiceImage } from 'src/lib/entities/serviceImages.entity';
import { SubService } from 'src/lib/entities/subService.entity';
import { ServiceDetails } from 'src/lib/entities/serviceDetails.entity';

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
