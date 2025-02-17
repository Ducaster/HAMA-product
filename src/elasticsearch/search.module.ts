import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE ?? '', // Elasticsearch 서버 주소
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService], // 다른 모듈에서 사용할 경우 exports 필요
})
export class SearchModule {}
