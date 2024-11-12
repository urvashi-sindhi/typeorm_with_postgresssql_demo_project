import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { Inquiry } from 'src/lib/entities/inquiry.entity';
import { InquiryController } from './inquiry.controller';
import { InquiryService } from './inquiry.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Inquiry])],
  controllers: [InquiryController],
  providers: [InquiryService],
})
export class InquiryModule {}
