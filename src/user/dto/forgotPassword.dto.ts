import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Match } from '../../lib/services/auth/decorators/match.decorator';
import { PASSWORD_REGEX } from '../../lib/utils/enum';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 345212,
    type: 'number',
    format: 'number',
    required: true,
  })
  @IsNumber()
  @Min(100000)
  @Max(999999)
  @IsNotEmpty()
  otp: number;

  @ApiProperty({
    example: 'Admin@1234',
    type: 'string',
    format: 'string',
    required: true,
  })
  @Matches(PASSWORD_REGEX)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    example: 'Admin@1234',
    type: 'string',
    format: 'string',
    required: true,
  })
  @Match('newPassword')
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
