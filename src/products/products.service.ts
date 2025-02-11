import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // ✅ 전체 데이터 조회
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // ✅ 특정 UID로 제품 조회
  async findByUid(uid: string): Promise<Product> {
    const product = await this.productModel.findOne({ uid }).exec();
    if (!product) {
      throw new NotFoundException(`Product with UID ${uid} not found`);
    }
    return product;
  }

  // ✅ 특정 카테고리 제품 조회
  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel.find({ category }).exec();
  }
}
