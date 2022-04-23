import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CWBSettingsDocument = CWBSettings & Document;

@Schema({
  strict: false,
})
export class CWBSettings {
  @Prop(String)
  property: string;

  @Prop(String)
  options: string;
}

export const CWB_SETTINGS_COLLECTION_NAME = 'cwb';

export const CWBSettingsSchema = SchemaFactory.createForClass(CWBSettings);
