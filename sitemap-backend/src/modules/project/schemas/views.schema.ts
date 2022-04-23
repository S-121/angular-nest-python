import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ViewsDocument = Views & Document;

@Schema()
export class Views {
  @Prop(String)
  id: string;

  @Prop(String)
  name: string;
}

export const VIEWS_COLLECTION_NAME = 'views';

export const ViewsSchema = SchemaFactory.createForClass(Views);
