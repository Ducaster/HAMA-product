import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // ✅ 페이지네이션을 적용한 전체 데이터 조회
  async findAll(
    page: number = 1,
    limit: number = 40,
  ): Promise<{ total: number; data: Product[] }> {
    const total = await this.productModel.countDocuments().exec(); // 총 개수
    const data = await this.productModel
      .find()
      .skip((page - 1) * limit) // 건너뛸 항목 수
      .limit(limit) // 한 번에 가져올 항목 수
      .exec();

    return { total, data };
  }

  // ✅ 특정 카테고리의 데이터 조회 (페이지네이션 적용)
  async findByCategory(
    category: string,
    page: number = 1,
    limit: number = 40,
  ): Promise<{ total: number; data: Product[] }> {
    const total = await this.productModel.countDocuments({ category }).exec(); // 해당 카테고리의 총 개수
    const data = await this.productModel
      .find({ category })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { total, data };
  }

  // ✅ 특정 UID로 제품 조회 (단건 조회)
  async findByUid(uid: string): Promise<Product> {
    const product = await this.productModel.findOne({ uid }).exec();
    if (!product) {
      throw new NotFoundException(`Product with UID ${uid} not found`);
    }
    return product;
  }
}
