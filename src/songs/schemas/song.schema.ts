import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
const paginate = (mongoosePaginate as any).default || mongoosePaginate;
export type SongDocument = HydratedDocument<Song>; //1.

@Schema()
export class Song {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Date })
  releasedDate: Date;

  @Prop({ type: String }) // store duration as string, like '03:45'
  duration: string;

  @Prop({ type: String })
  lyrics: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Artist' }] })
  artists: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Playlist' })
  playList: Types.ObjectId;
}

export const SongSchema = SchemaFactory.createForClass(Song);
SongSchema.plugin(paginate);