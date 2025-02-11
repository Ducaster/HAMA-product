import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ 모든 제품 가져오기 (페이지네이션 추가)
  @Get()
  async getAllProducts(
    @Query('page') page = '1',
    @Query('limit') limit = '40',
  ) {
    return this.productsService.findAll(Number(page), Number(limit));
  }

  // ✅ 특정 UID 기반 조회 (단일 상품)
  @Get(':uid')
  async getProductByUid(@Param('uid') uid: string): Promise<Product> {
    return this.productsService.findByUid(uid);
  }

  // ✅ 특정 카테고리 제품 가져오기 (페이지네이션 추가)
  @Get('category/:category')
  async getProductsByCategory(
    @Param('category') category: string,
    @Query('page') page = '1',
    @Query('limit') limit = '40',
  ) {
    return this.productsService.findByCategory(
      category,
      Number(page),
      Number(limit),
    );
  }
}
