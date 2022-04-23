import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from 'src/modules/user/schemas';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop(String)
  name: string;

  @Prop(Boolean)
  gsc: number;

  @Prop(String)
  viewId: string;

  @Prop(String)
  url: string;

  @Prop(String)
  _url: string;

  @Prop(String)
  image: string;

  @Prop(String)
  accuDomain: string;

  @Prop(String)
  description: string;

  @Prop(String)
  domain: string;

  @Prop(String)
  accountId: string;

  @Prop({
    type: 'string',
    ref: 'user',
    autopopulate: true,
  })
  createdBy: UserDocument;

  @Prop(Boolean)
  ga: boolean;

  @Prop(Boolean)
  accuranker: boolean;

  @Prop(String)
  property: string;

  @Prop(String)
  admin: string;

  @Prop(String)
  csvFilename: string;

  @Prop(String)
  sheetId: string;

  @Prop(Array)
  users: string[];

  @Prop(String)
  projectConversions: string;

  @Prop(Array)
  keywords: string[];
}

export const PROJECT_COLLECTION_NAME = 'project';

export const ProjectSchema = SchemaFactory.createForClass(Project);
