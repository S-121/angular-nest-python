import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DomainDocument = Domain & Document;

@Schema()
export class Domain {
  @Prop(String)
  id: string;

  @Prop(String)
  domain: String;
}

export const DOMAIN_COLLECTION_NAME = 'domain';

export const DomainSchema = SchemaFactory.createForClass(Domain);
