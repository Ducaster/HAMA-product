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
  async findByUid(uid: string): Promise<any> {
    // ✅ 제품 정보 가져오기
    const product = await this.productModel.findOne({ uid }).exec();
    if (!product) {
      throw new NotFoundException(`Product with UID ${uid} not found`);
    }

    // ✅ 추가 정보 가져오기 (product_analyze 컬렉션에서 검색)
    const additionalInfo = await this.productModel.db
      .collection('product_analyze')
      .findOne({ uid });

    // ✅ 추가 정보가 있다면 정리
    let formattedAdditionalInfo: {
      review_percent?: any;
      review_summary?: { advantages: string[]; disadvantages: string[] };
    } | null = null;

    if (additionalInfo) {
      const reviewSummaryText = additionalInfo.review_summary || '';

      // ✅ 리뷰 요약을 JSON 형태로 변환
      const reviewSummary = this.formatReviewSummary(reviewSummaryText);

      // ✅ 불필요한 필드 제거한 추가 정보 반환
      formattedAdditionalInfo = {
        review_percent: additionalInfo.review_percent,
        review_summary: reviewSummary,
      };
    }

    // ✅ 최종 데이터 반환
    return {
      ...product.toObject(), // 기존 제품 정보
      additionalInfo: formattedAdditionalInfo, // 가공된 추가 정보
    };
  }

  private formatReviewSummary(summary: string) {
    const sections = summary.split('\n\n'); // 장점 / 단점 구분
    let advantages: string[] = [];
    let disadvantages: string[] = [];

    sections.forEach((section) => {
      if (section.match(/^.*장점[:：]/)) {
        advantages = section
          .replace(/^.*장점[:：]\n?/, '') // "장점:" 앞의 불필요한 부분 삭제
          .split('\n')
          .map((line) => line.replace(/^[-•*]\s*/, '').trim()) // 앞에 있는 "-" 또는 "•" 또는 "*" 제거
          .filter((line) => line.length > 0); // 빈 값 제거
      }
      if (section.match(/^.*단점[:：]/)) {
        disadvantages = section
          .replace(/^.*단점[:：]\n?/, '') // "단점:" 앞의 불필요한 부분 삭제
          .split('\n')
          .map((line) => line.replace(/^[-•*]\s*/, '').trim()) // 앞에 있는 "-" 또는 "•" 또는 "*" 제거
          .filter((line) => line.length > 0); // 빈 값 제거
      }
    });

    return { advantages, disadvantages };
  }

  // ✅ 인덱스 없이 전체 데이터에서 검색 (키워드 포함)
  async searchProducts(keyword: string, page: number = 1, limit: number = 40) {
    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
      ],
    };

    const total = await this.productModel.countDocuments(query).exec();
    const data = await this.productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (!data.length) {
      console.log(`🚨 검색 결과 없음: keyword=${keyword}`);
      throw new NotFoundException(`No products found for keyword: ${keyword}`);
    }

    return { total, data };
  }
}
