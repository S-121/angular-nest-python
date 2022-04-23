import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataDocument = Data & Document;

@Schema()
export class Data {
  @Prop(String)
  url: string;

  @Prop(String)
  query: string;

  @Prop(Number)
  clicks?: number;

  @Prop(Number)
  impressions?: number;

  @Prop(Number)
  ctr?: number;

  @Prop(Number)
  position?: number;
}

export const DATA_COLLECTION_NAME = 'data';

export const DataSchema = SchemaFactory.createForClass(Data);
