import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AlbumDocument = HydratedDocument<Album>; //1.

@Schema()
export class Album {
  @Prop({ required: true })
  title: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);