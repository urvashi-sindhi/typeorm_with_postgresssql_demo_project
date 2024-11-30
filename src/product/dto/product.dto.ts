import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ProductService {
  @ApiProperty({
    example: 'Advisory Services:',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({
    type: 'array',
    items: {
      example: 'Vision and direction for Dynamics 365 projects',
      type: 'string',
      format: 'string',
    },
    required: false,
  })
  @IsOptional()
  product_service_detail: string[];
}

export class Expertise {
  @ApiProperty({
    example: 'D365 Finance & Operations',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  expertise_area: string;

  @ApiProperty({
    example:
      'Maximizing financial performance, reducing risk, and enhancing resource management.',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  expertise_description: string;
}

export class ProductImage {
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

export class ProductBenefit {
  @ApiProperty({
    example:
      'Comprehensive Solutions: Integrating various business functions for a seamless experience.',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  product_benefit: string;
}

export class ProductDto {
  @ApiProperty({
    example: 'Dynamic 365',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  product_name: string;

  @ApiProperty({
    example: 'Microsoft Dynamics 365 is a cloud-based suite of integrated CRM',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'Contact our expert team today!',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsOptional()
  contact_us: string;

  @ApiProperty({ type: [ProductImage], required: false })
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  @IsArray()
  @IsOptional()
  productImageDetail: ProductImage[];

  @ApiProperty({ type: [ProductBenefit], required: false })
  @ValidateNested({ each: true })
  @Type(() => ProductBenefit)
  @IsArray()
  @IsOptional()
  productBenefit: ProductBenefit[];

  @ApiProperty({ type: [ProductService], required: false })
  @ValidateNested({ each: true })
  @Type(() => ProductService)
  @IsArray()
  @IsOptional()
  product_service: ProductService[];

  @ApiProperty({ type: [Expertise], required: false })
  @ValidateNested({ each: true })
  @Type(() => Expertise)
  @IsArray()
  @IsOptional()
  expertise_details: Expertise[];

  @ApiProperty({
    type: 'array',
    items: {
      example: 'Mobilization of project teams and governance establishment',
      type: 'string',
      format: 'string',
    },
    required: false,
  })
  @IsOptional()
  methodology_description: string[];
}
