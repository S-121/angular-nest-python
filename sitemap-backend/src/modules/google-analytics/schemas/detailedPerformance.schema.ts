import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DetailedPerformanceDocument = DetailedPerformance & Document;

@Schema()
export class DetailedPerformance {
  @Prop(String)
  url: string;

  @Prop(String)
  fcp: string;

  @Prop(String)
  fcp_score: string;

  @Prop(String)
  si: string;

  @Prop(String)
  lcp: string;

  @Prop(String)
  lcp_score: string;

  @Prop(String)
  tti: string;

  @Prop(String)
  tbt: string;

  @Prop(String)
  cls: string;

  @Prop(String)
  cls_score: string;

  @Prop(String)
  overall_score: string;

  @Prop(String)
  ps: string;

  @Prop(Date)
  record_date: Date;

  @Prop(String)
  device: string;
}

export const DETAIL_PERFORMANCE_COLLECTION_NAME = 'performance_detail';

export const DetailedPerformanceSchema =
  SchemaFactory.createForClass(DetailedPerformance);
