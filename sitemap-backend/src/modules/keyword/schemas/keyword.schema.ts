import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KeywordDocument = Keyword & Document;

@Schema({
  strict: false,
})
export class Keyword {
  @Prop(String)
  parent_category: string;

  @Prop(String)
  keyword: string;

  @Prop(String)
  search_volume: string;

  @Prop(String)
  cpc: string;

  @Prop(String)
  matching_products_exact: string;

  @Prop(String)
  matching_products_fuzzy: string;

  @Prop(String)
  similarity: string;

  @Prop(String)
  matched_category: string;

  @Prop(String)
  matched_category_page_title: string;
  
  @Prop(String)
  priorityScore: string;
}

export const KEYWORD_COLLECTION_NAME = 'keyword';

export const KeywordSchema = SchemaFactory.createForClass(Keyword);
