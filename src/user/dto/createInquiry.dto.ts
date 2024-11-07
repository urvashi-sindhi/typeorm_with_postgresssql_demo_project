import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInquiryDto {
  @ApiProperty({
    example: 'Urvashi',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'Sindhi',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: 'urvashi@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'write your suggestions and queries',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty({
    example: '9966091245',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
