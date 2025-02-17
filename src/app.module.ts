import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { SearchModule } from './elasticsearch/search.module';
@Module({
  imports: [
    ConfigModule.forRoot(), // .env 파일 사용 가능
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nest',
    ), // MongoDB 연결
    ProductsModule,
    SearchModule,
  ],
})
export class AppModule {}
