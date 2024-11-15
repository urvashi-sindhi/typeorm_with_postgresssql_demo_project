import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiTag } from '../lib/utils/enum';
import { CreateInquiryDto } from './dto/createInquiry.dto';
import { JwtGuard } from '../lib/services/auth/guard/jwt.guard';

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
  viewInquiry(@Query('inquiryId') inquiryId: number) {
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

  @ApiQuery({
    name: 'sortKey',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'sortValue',
    type: String,
    enum: ['asc', 'desc'],
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'searchBar',
    type: 'string',
    required: false,
  })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('/listOfInquiries')
  listOfInquiries(
    @Query('sortKey') sortKey: string,
    @Query('sortValue') sortValue: string,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('searchBar') searchBar: string,
  ) {
    return this.inquiryService.listOfInquiries({
      sortValue,
      sortKey,
      pageSize,
      page,
      searchBar,
    });
  }
}
