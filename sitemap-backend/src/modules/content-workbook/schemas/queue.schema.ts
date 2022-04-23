import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CWBQueueDocument = CWBQueue & Document;

@Schema({
  strict: false,
})
export class CWBQueue {
  @Prop(String)
  id: string;

  @Prop(String)
  priority: string;

  @Prop(String)
  status: string;

  @Prop(String)
  articleTitle: string;

  @Prop(String)
  mainKW: string;

  @Prop(String)
  vol: string;

  @Prop(String)
  contentType: string;

  @Prop(String)
  contentTactic: string;

  @Prop(String)
  pillar: string;

  @Prop(String)
  author: string;

  @Prop(String)
  supportingKeywords: string;

  @Prop(String)
  notes: string;

  @Prop(String)
  wordCount: string;

  @Prop(String)
  clearScopeLink: string;

  @Prop(String)
  finalDraftLink: string;

  @Prop(Boolean)
  published: boolean;

  @Prop(String)
  publishedDate: string;

  @Prop(Boolean)
  disapproved: boolean;

  @Prop(String)
  disapprovedDate: string;
}

export const CWBQUEUE_COLLECTION_NAME = 'CWBQueue';

export const CWBQueueSchema = SchemaFactory.createForClass(CWBQueue);
