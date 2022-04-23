import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GaPropertyDocument = GaProperty & Document;

@Schema()
export class GaProperty {
  @Prop(String)
  id: string;

  @Prop(String)
  accountId: string;

  @Prop(String)
  name: string;
}

export const GA_PROPERTY_COLLECTION_NAME = 'gaproperties';

export const GaPropertySchema = SchemaFactory.createForClass(GaProperty);
