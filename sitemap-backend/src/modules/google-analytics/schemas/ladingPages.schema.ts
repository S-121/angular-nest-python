import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LandingPagesDocument = LandingPages & Document;

@Schema()
export class LandingPages {
  @Prop(String)
  pages: String;

  @Prop(Number)
  sessions: number;

  @Prop(String)
  sessions_inc: string;

  @Prop(String)
  sessions_arrow: string;

  @Prop(String)
  pr: string;

  @Prop(String)
  pr_inc: string;

  @Prop(String)
  pr_arrow: string;

  @Prop(String)
  atp: string;

  @Prop(String)
  atp_inc: string;

  @Prop(String)
  atp_arrow: string;
}

export const LANDING_PAGES_USER_COLLECTION_NAME = 'landingPages';

export const LandingPagesSchema = SchemaFactory.createForClass(LandingPages);
