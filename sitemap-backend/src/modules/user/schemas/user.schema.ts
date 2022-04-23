import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop(String)
  google_id: string;

  @Prop(String)
  name: string;

  @Prop(String)
  email: string;

  @Prop(String)
  password: string;

  @Prop(String)
  country: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    autopopulate: true,
  })
  createdBy: string;

  @Prop(String)
  picture: string;

  @Prop(String)
  access_token: string;

  @Prop(String)
  refresh_token: string;

  @Prop(Number)
  level: number;

  @Prop(String)
  top_admin: string;

  @Prop(String)
  reset_link: any;
}

export const USER_COLLECTION_NAME = 'user';

export const UserSchema = SchemaFactory.createForClass(User);
