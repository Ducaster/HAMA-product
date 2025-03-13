export interface Product {
  pk: string; // 파티션 키 (예: PRODUCT#${uid})
  sk: string; // 정렬 키 (예: METADATA#${category})
  uid: string;
  site: string;
  category: string;
  link: string;
  img: string;
  brand: string;
  name: string;
  sale_price: string;
  created_at: string;
}

export const TableName = process.env.DYNAMODB_TABLE || 'products';
