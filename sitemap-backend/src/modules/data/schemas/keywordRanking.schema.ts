import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KeywordRankingDocument = KeywordRanking & Document;

@Schema()
export class KeywordRanking {
  @Prop(String)
  url: string;

  @Prop(String)
  keyword: string;

  @Prop(String)
  rank?: String;

  @Prop(String)
  diff: String;

  @Prop(String)
  region: String;

  @Prop(String)
  search_volume: String;

  @Prop(String)
  device: String;

  @Prop(String)
  projectId: String;
}

export const KEYWORD_RANKING_COLLECTION_NAME = 'KeywordRanking';

export const KeywordRankingSchema = SchemaFactory.createForClass(
  KeywordRanking,
);
