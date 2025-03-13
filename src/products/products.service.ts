import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { Product, TableName } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(private readonly dynamoDb: DynamoDBDocumentClient) {}

  async findAll(page: number = 1, limit: number = 40) {
    const command = new ScanCommand({
      TableName,
      Limit: limit,
      ExclusiveStartKey:
        page > 1 ? await this.getLastEvaluatedKey(page, limit) : undefined,
    });

    const response = await this.dynamoDb.send(command);

    return {
      data: response.Items as Product[],
      total: response.Count || 0,
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  }

  async findByCategory(category: string, page: number = 1, limit: number = 40) {
    const command = new QueryCommand({
      TableName,
      KeyConditionExpression: 'sk = :sk',
      ExpressionAttributeValues: {
        ':sk': `METADATA#${category}`,
      },
      Limit: limit,
      ExclusiveStartKey:
        page > 1 ? await this.getLastEvaluatedKey(page, limit) : undefined,
    });

    const response = await this.dynamoDb.send(command);

    return {
      data: response.Items as Product[],
      total: response.Count || 0,
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  }

  async findByUid(uid: string) {
    const command = new GetCommand({
      TableName,
      Key: {
        pk: `PRODUCT#${uid}`,
        sk: 'METADATA',
      },
    });

    const response = await this.dynamoDb.send(command);
    if (!response.Item) {
      throw new NotFoundException(`Product with UID ${uid} not found`);
    }

    return response.Item as Product;
  }

  async searchProducts(keyword: string, page: number = 1, limit: number = 40) {
    const command = new ScanCommand({
      TableName,
      FilterExpression:
        'contains(#name, :keyword) OR contains(#brand, :keyword) OR contains(#category, :keyword)',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#brand': 'brand',
        '#category': 'category',
      },
      ExpressionAttributeValues: {
        ':keyword': keyword,
      },
      Limit: limit,
      ExclusiveStartKey:
        page > 1 ? await this.getLastEvaluatedKey(page, limit) : undefined,
    });

    const response = await this.dynamoDb.send(command);

    return {
      data: response.Items as Product[],
      total: response.Count || 0,
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  }

  private async getLastEvaluatedKey(page: number, limit: number) {
    const command = new ScanCommand({
      TableName,
      Limit: limit * (page - 1),
    });

    const response = await this.dynamoDb.send(command);
    return response.LastEvaluatedKey;
  }
}
