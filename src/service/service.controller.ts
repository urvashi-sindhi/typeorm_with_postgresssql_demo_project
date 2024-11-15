import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { JwtGuard } from 'src/lib/services/auth/guard/jwt.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ServiceDto } from './dto/service.dto';
import { ApiTag } from 'src/lib/utils/enum';

@ApiTags(ApiTag.Service)
@Controller()
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('service/addService')
  addService(@Body() dto: ServiceDto) {
    return this.serviceService.addService(dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiParam({ example: 1, name: 'serviceId', required: true })
  @HttpCode(HttpStatus.OK)
  @Put('service/editService/:serviceId')
  editService(@Param('serviceId') serviceId: number, @Body() dto: ServiceDto) {
    return this.serviceService.editService(serviceId, dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiParam({ example: 1, name: 'serviceId', required: true })
  @HttpCode(HttpStatus.OK)
  @Delete('service/deleteService/:serviceId')
  deleteService(@Param('serviceId') serviceId: number) {
    return this.serviceService.deleteService(serviceId);
  }
}
