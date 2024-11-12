import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/lib/utils/enum';
import { LoginDto } from './dto/login.dto';

@ApiTags(ApiTag.ADMIN)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags(ApiTag.ADMIN)
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('admin/listOfInquiries')
  listOfInquiries() {
    return this.userService.listOfInquiries();
  }
}
