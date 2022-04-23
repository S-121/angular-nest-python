import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RevenueDocument = Revenue & Document;

@Schema()
export class Revenue {
  @Prop(Date)
  date: Date;

  @Prop(Number)
  revenue: number;

  @Prop(String)
  medium: string;

  @Prop(String)
  type: string;
}

export const REVENUE_COLLECTION_NAME = 'revenue';

export const RevenueSchema = SchemaFactory.createForClass(Revenue);
