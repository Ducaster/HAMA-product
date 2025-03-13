import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const getDynamoDBClient = () => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'ap-northeast-2',
  });

  return DynamoDBDocumentClient.from(client);
};
