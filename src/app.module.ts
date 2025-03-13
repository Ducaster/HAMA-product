import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { SearchModule } from './elasticsearch/search.module';

@Module({
  imports: [ConfigModule.forRoot(), ProductsModule, SearchModule],
})
export class AppModule {}
