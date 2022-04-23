import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClicksDocument = Clicks & Document;

@Schema()
export class Clicks {
  @Prop(Date)
  date: Date;

  @Prop(Number)
  clicks: number;

  @Prop(Number)
  impressions?: number;

  @Prop(Number)
  ctr?: number;

  @Prop(Number)
  position?: number;
}

export const CLICKS_COLLECTION_NAME = 'clicks';

export const ClicksSchema = SchemaFactory.createForClass(Clicks);
