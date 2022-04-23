import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganicDataDocument = OrganicData & Document;

@Schema()
export class OrganicData {
  @Prop(String)
  currentMonth: string;

  @Prop(String)
  lastMonth: string;

  @Prop(String)
  currentMonthSessions: string;

  @Prop(String)
  currentMonthBounceRate: string;

  @Prop(String)
  currentMonthPageviews: string;

  @Prop(String)
  currentMonthPageviewsPerSession: string;

  @Prop(String)
  currentMonthTimeOnPage: string;

  @Prop(String)
  lastMonthSessions: string;

  @Prop(String)
  lastMonthBounceRate: string;

  @Prop(String)
  lastMonthPageviews: string;

  @Prop(String)
  lastMonthPageviewsPerSession: string;

  @Prop(String)
  lastMonthTimeOnPage: string;

  @Prop(String)
  lastCurrentSessions: string;

  @Prop(String)
  lastCurrentBounceRate: string;

  @Prop(String)
  lastCurrentPageviews: string;

  @Prop(String)
  lastCurrentPageviewsPerSession: string;

  @Prop(String)
  lastCurrentTimeOnPage: string;

  @Prop(String)
  lastYearSessions: string;

  @Prop(String)
  lastYearBoounceRate: string;

  @Prop(String)
  lastYearPageViews: string;

  @Prop(String)
  lastYearPageviewsPerSession: string;

  @Prop(String)
  lastYearTimeOnPage: string;
}

export const ORGANIC_DATA_COLLECTION_NAME = 'OrganicData';

export const OrganicDataSchema = SchemaFactory.createForClass(OrganicData);
