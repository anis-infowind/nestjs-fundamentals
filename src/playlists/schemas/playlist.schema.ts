import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Song } from '../../songs/schemas/song.schema';
import { User } from '../../users/schemas/user.schema';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ required: true })
  name: string;

  // Each playlist has multiple songs
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Song' }] })
  songs: Types.ObjectId[] | Song[];

  // A playlist belongs to a single user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);