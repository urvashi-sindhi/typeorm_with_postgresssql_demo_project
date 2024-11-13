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
import { ApiTag } from 'src/lib/utils/enum';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from 'src/lib/services/auth/guard/jwt.guard';
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

  @ApiTags(ApiTag.ADMIN)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Put('admin/resetPassword')
  resetPassword(@Req() req: any, @Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(req, dto);
  }

  @ApiTags(ApiTag.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Post('admin/verifyEmail')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.userService.verifyEmail(dto);
  }

  @ApiTags(ApiTag.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put('admin/forgotPassword')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto);
  }
}
