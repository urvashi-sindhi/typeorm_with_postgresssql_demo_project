import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { JwtGuard } from 'src/lib/services/auth/guard/jwt.guard';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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

  @ApiQuery({
    name: 'sortKey',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'sortValue',
    type: String,
    enum: ['asc', 'desc'],
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'searchBar',
    type: 'string',
    required: false,
  })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('service/listOfService')
  listOfService(
    @Query('sortKey') sortKey: string,
    @Query('sortValue') sortValue: string,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('searchBar') searchBar: string,
  ) {
    return this.serviceService.listOfService({
      sortValue,
      sortKey,
      pageSize,
      page,
      searchBar,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('customer/getServiceList')
  getServiceList() {
    return this.serviceService.getServiceList();
  }

  @ApiParam({ example: 1, name: 'serviceId', required: true })
  @HttpCode(HttpStatus.OK)
  @Get('customer/viewService/:serviceId')
  viewService(@Param('serviceId') serviceId: number) {
    return this.serviceService.viewService(serviceId);
  }
}
