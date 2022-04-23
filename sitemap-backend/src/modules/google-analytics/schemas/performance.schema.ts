import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PerformanceDocument = Performance & Document;

@Schema()
export class Performance {
  @Prop(String)
  url: string;

  @Prop(String)
  fcp: string;

  @Prop(String)
  si: string;

  @Prop(String)
  lcp: string;

  @Prop(String)
  tti: string;

  @Prop(String)
  tbt: string;

  @Prop(String)
  cls: string;

  @Prop(String)
  ps: string;

  @Prop(String)
  device: string;
}

export const PERFORMANCE_COLLECTION_NAME = 'performance';

export const PerformanceSchema = SchemaFactory.createForClass(Performance);
