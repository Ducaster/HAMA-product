import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { getDynamoDBClient } from '../config/dynamodb.config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: DynamoDBDocumentClient,
      useFactory: getDynamoDBClient,
    },
    ProductsService,
  ],
})
export class ProductsModule {}
