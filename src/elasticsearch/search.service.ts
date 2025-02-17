import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async searchProducts(keyword: string, page = 1, size = 50) {
    const from = (page - 1) * size;

    const result = await this.elasticsearchService.search({
      index: 'products',
      from: from,
      size: size,
      query: {
        bool: {
          should: [
            { wildcard: { name: `*${keyword}*` } }, // 부분 검색
            { match_phrase_prefix: { name: keyword } }, // 자동완성 검색
            { fuzzy: { name: { value: keyword, fuzziness: 'AUTO' } } }, // 오타 검색
            {
              multi_match: { query: keyword, fields: ['name', 'description'] },
            }, // 여러 필드 검색
          ],
        },
      },
    });
    return result.hits.hits;
  }
}
