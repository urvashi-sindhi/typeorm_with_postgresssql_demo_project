import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/lib/utils/enum';
import { CreateInquiryDto } from './dto/createInquiry.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags(ApiTag.INQUIRY)
  @Post('inquiry/createInquiry')
  @HttpCode(HttpStatus.OK)
  createInquiry(@Body() dto: CreateInquiryDto) {
    return this.userService.createInquiry(dto);
  }

  @ApiTags(ApiTag.ADMIN)
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @ApiTags(ApiTag.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('admin/listOfInquiries')
  listOfInquiries() {
    return this.userService.listOfInquiries();
  }
}
