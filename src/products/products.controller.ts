import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ 모든 제품 가져오기
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // ✅ UID 기반 조회
  @Get(':uid')
  async getProductByUid(@Param('uid') uid: string): Promise<Product> {
    return this.productsService.findByUid(uid);
  }

  // ✅ 카테고리 기반 조회
  @Get('category/:category')
  async getProductsByCategory(
    @Param('category') category: string,
  ): Promise<Product[]> {
    return this.productsService.findByCategory(category);
  }
}
