import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  site: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  img: string;

  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sale_price: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
