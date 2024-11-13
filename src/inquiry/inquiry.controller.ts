import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/lib/utils/enum';
import { CreateInquiryDto } from './dto/createInquiry.dto';
import { ListOfFilterDto } from './dto/listOfInquiries.dto';
import { JwtGuard } from 'src/lib/services/auth/guard/jwt.guard';

@ApiTags(ApiTag.INQUIRY)
@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post('/createInquiry')
  @HttpCode(HttpStatus.OK)
  createInquiry(@Body() dto: CreateInquiryDto) {
    return this.inquiryService.createInquiry(dto);
  }

  @ApiParam({ example: 1, name: 'inquiryId', required: true })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('/viewInquiry/:inquiryId')
  viewInquiry(@Param('inquiryId') inquiryId: number) {
    return this.inquiryService.viewInquiry(inquiryId);
  }

  @ApiParam({ example: 1, name: 'inquiryId', required: true })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put('/updateInquiryStatus/:inquiryId')
  updateInquiryStatus(@Param('inquiryId') inquiryId: number) {
    return this.inquiryService.updateInquiryStatus(inquiryId);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('/listOfInquiries')
  listOfInquiries(@Body() dto: ListOfFilterDto) {
    return this.inquiryService.listOfInquiries(dto);
  }
}
