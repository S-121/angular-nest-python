import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WQADocument = WQA & Document;

@Schema({
  strict: false,
})
export class WQA {
  @Prop(String)
  urlAction: string;

  @Prop(String)
  url: string;

  @Prop(String)
  category: string;

  @Prop(String)
  sitemMapStatus: string;

  @Prop(String)
  impressions: string;

  @Prop(String)
  ctr: string;

  @Prop(String)
  sessions: string;

  @Prop(String)
  rdLinks: string;

  @Prop(String)
  bounceRate: string;

  @Prop(String)
  mainKw: string;

  @Prop(String)
  mainKwPosition: string;

  @Prop(String)
  mainKwVolume: string;

  @Prop(String)
  bestKw: string;

  @Prop(String)
  bestKwPosition: string;

  @Prop(String)
  bestKwVolume: string;

  @Prop(String)
  avgTimeOnPage: string;

  @Prop(String)
  goalCompletions: string;

  @Prop(String)
  goalConversionRate: string;

  @Prop(String)
  type: string;

  @Prop(String)
  contentTitle: string;

  @Prop(String)
  meta: string;

  @Prop(String)
  h1: string;

  @Prop(String)
  wordCount: string;

  @Prop(String)
  connicalLinkelement: string;

  @Prop(String)
  statusCode: string;

  @Prop(String)
  indexNonIndex: string;

  @Prop(String)
  lastModified: string;

  @Prop(String)
  inlinks: string;

  @Prop(String)
  outlinks: string;
}

export const WQA_COLLECTION_NAME = 'wqa';

export const WQASchema = SchemaFactory.createForClass(WQA);
