import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from '../../lib/services/auth/decorators/match.decorator';
import { PASSWORD_REGEX } from '../../lib/utils/enum';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'Admin@1234',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: 'Admin@1234',
    type: 'string',
    format: 'string',
    required: true,
  })
  @Matches(PASSWORD_REGEX)
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
