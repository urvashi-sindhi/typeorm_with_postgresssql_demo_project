import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ServiceDetails {
  @ApiProperty({
    example: 'CUSTOM-BUILT SOLUTIONS: Every business is different. ',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  services_details_point: string;
}

export class ServiceConsultingDetails {
  @ApiProperty({
    example: 'INSPIRE: Visualize the future of your business',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  services_details_point: string;

  @ApiProperty({
    example:
      'With extensive experience across multiple industries, our team provides',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  services_details_description: string;
}

export class SubService {
  @ApiProperty({
    example: 'Mobile App Development',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  sub_service_title: string;

  @ApiProperty({
    example: 'Apps That Drive Engagement.',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  sub_service_description: string;
}

export class ServiceImage {
  @ApiProperty({
    example: 'Operations1.png',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  overview_image: string;

  @ApiProperty({
    example: 'Operations2.png',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  service_image: string;

  @ApiProperty({
    example: 'Operations3.png',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  right_sidebar_image_1: string;

  @ApiProperty({
    example: 'Operations4.png',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  right_sidebar_image_2: string;
}

export class ServiceDto {
  @ApiProperty({
    example: 'Software Development',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  service_name: string;

  @ApiProperty({
    example: 'Innovate, Build, and Grow.',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  service_description: string;

  @ApiProperty({ type: [ServiceImage], required: false })
  @ValidateNested({ each: true })
  @Type(() => ServiceImage)
  @IsArray()
  @IsOptional()
  serviceImageDetail: ServiceImage[];

  @ApiProperty({ type: [SubService], required: false })
  @ValidateNested({ each: true })
  @Type(() => SubService)
  @IsArray()
  @IsOptional()
  subService: SubService[];

  @ApiProperty({ type: [ServiceDetails], required: false })
  @ValidateNested({ each: true })
  @Type(() => ServiceDetails)
  @IsArray()
  @IsOptional()
  serviceDetailsApproach: ServiceDetails[];

  @ApiProperty({ type: [ServiceDetails], required: false })
  @ValidateNested({ each: true })
  @Type(() => ServiceDetails)
  @IsArray()
  @IsOptional()
  serviceDetailsATC: ServiceDetails[];

  @ApiProperty({ type: [ServiceDetails], required: false })
  @ValidateNested({ each: true })
  @Type(() => ServiceDetails)
  @IsArray()
  @IsOptional()
  serviceDetailsBenefits: ServiceDetails[];

  @ApiProperty({ type: [ServiceConsultingDetails], required: false })
  @ValidateNested({ each: true })
  @Type(() => ServiceConsultingDetails)
  @IsArray()
  @IsOptional()
  serviceDetailsConsulting: ServiceConsultingDetails[];
}
