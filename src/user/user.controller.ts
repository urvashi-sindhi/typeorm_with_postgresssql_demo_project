import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/lib/utils/enum';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from 'src/lib/services/auth/guard/jwt.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ListOfFilterDto } from '../inquiry/dto/listOfInquiries.dto';

@ApiTags(ApiTag.ADMIN)
@Controller('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put('/resetPassword')
  resetPassword(@Req() req: any, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(req, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/verifyEmail')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.userService.verifyEmail(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Put('/forgotPassword')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto);
  }

  @ApiParam({ example: 1, name: 'inquiryId', required: true })
  @HttpCode(HttpStatus.OK)
  @Get('/viewInquiry/:inquiryId')
  viewInquiry(@Param('inquiryId') inquiryId: number) {
    return this.userService.viewInquiry(inquiryId);
  }

  @ApiParam({ example: 1, name: 'inquiryId', required: true })
  @HttpCode(HttpStatus.OK)
  @Put('/updateInquiryStatus/:inquiryId')
  updateInquiryStatus(@Param('inquiryId') inquiryId: number) {
    return this.userService.updateInquiryStatus(inquiryId);
  }
}
