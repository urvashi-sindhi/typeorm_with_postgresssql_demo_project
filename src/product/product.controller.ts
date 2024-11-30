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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductServices } from './product.service';
import { JwtGuard } from 'src/lib/services/auth/guard/jwt.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/lib/helpers/multer';
import { FileUploadDto } from './dto/fileUpload.dto';
import { ProductDto } from './dto/product.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductServices) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: storage }))
  @Post('common/fileUpload')
  fileUpload(
    @Req() req: any,
    @UploadedFiles() product_image: Express.Multer.File[],
    @Body() dto: FileUploadDto,
  ) {
    return this.productService.fileUpload(req, product_image, dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('product/addProduct')
  addProduct(@Body() dto: ProductDto) {
    return this.productService.addProduct(dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiParam({ example: 1, name: 'productId', required: true })
  @HttpCode(HttpStatus.OK)
  @Put('product/editProduct/:productId')
  editProduct(@Param('productId') productId: number, @Body() dto: ProductDto) {
    return this.productService.editProduct(productId, dto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiParam({ example: 1, name: 'productId', required: true })
  @HttpCode(HttpStatus.OK)
  @Delete('product/deleteProduct/:productId')
  deleteProduct(@Param('productId') productId: number) {
    return this.productService.deleteProduct(productId);
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
  @Get('product/listOfProduct')
  listOfProduct(
    @Query('sortKey') sortKey: string,
    @Query('sortValue') sortValue: string,
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('searchBar') searchBar: string,
  ) {
    return this.productService.listOfProduct({
      sortValue,
      sortKey,
      pageSize,
      page,
      searchBar,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('customer/getProductList')
  getProductList() {
    return this.productService.getProductList();
  }

  @ApiParam({ example: 1, name: 'productId', required: true })
  @HttpCode(HttpStatus.OK)
  @Get('customer/viewProduct/:productId')
  viewProduct(@Param('productId') productId: number) {
    return this.productService.viewProduct(productId);
  }
}
