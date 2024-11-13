import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/lib/utils/enum';
import { CreateInquiryDto } from './dto/createInquiry.dto';
import { ListOfFilterDto } from './dto/listOfInquiries.dto';

@ApiTags(ApiTag.INQUIRY)
@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post('/createInquiry')
  @HttpCode(HttpStatus.OK)
  createInquiry(@Body() dto: CreateInquiryDto) {
    return this.inquiryService.createInquiry(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/listOfInquiries')
  listOfInquiries(@Body() dto: ListOfFilterDto) {
    return this.inquiryService.listOfInquiries(dto);
  }
}
