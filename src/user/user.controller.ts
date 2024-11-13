import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiTag } from '../lib/utils/enum';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from '../lib/services/auth/guard/jwt.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

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
}
