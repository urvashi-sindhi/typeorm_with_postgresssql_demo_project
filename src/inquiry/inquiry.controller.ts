import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/lib/utils/enum';

@ApiTags(ApiTag.INQUIRY)
@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/listOfInquiries')
  listOfInquiries() {
    return this.inquiryService.listOfInquiries();
  }
}
