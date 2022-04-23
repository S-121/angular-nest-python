import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GscSiteDocument = GscSite & Document;

@Schema()
export class GscSite {
  @Prop(String)
  siteUrl: string;

  @Prop(String)
  permissionLevel: string;
}

export const GSC_SITE_COLLECTION_NAME = 'gscSite';

export const GscSiteSchema = SchemaFactory.createForClass(GscSite);
