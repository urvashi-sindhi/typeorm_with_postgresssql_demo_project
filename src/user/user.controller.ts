import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/lib/utils/enum';
import { LoginDto } from './dto/login.dto';

@ApiTags(ApiTag.ADMIN)
@Controller('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }
}
