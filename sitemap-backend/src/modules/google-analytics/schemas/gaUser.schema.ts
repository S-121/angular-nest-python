import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GaUserDocument = GaUser & Document;

@Schema()
export class GaUser {
  @Prop(String)
  month: String;

  @Prop(Number)
  users: number;

  @Prop(Number)
  sessions: number;

  @Prop(Number)
  views: number;
}

export const GA_USER_COLLECTION_NAME = 'gaUser';

export const GaUserSchema = SchemaFactory.createForClass(GaUser);
