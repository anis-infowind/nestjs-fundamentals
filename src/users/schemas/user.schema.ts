import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Playlist } from '../../playlists/schemas/playlist.schema';
import { Exclude } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ type: String, default: null })
  @Exclude()
  twoFASecret: string | null;

  @Prop({ type: Boolean, default: false })
  @Exclude()
  enable2FA: boolean;

  @Prop({ type: String, default: null })
  @Exclude()
  apiKey: string | null;

  @Prop({ type: String, default: null })
  phone: string;

  // A user can create many playlists
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Playlist' }] })
  playLists: Playlist[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toObject', {
  versionKey: false,
  transform: (_doc, ret: Partial<User>) => {
    delete ret.password;
    delete ret.twoFASecret;
    delete ret.apiKey;
    return ret;
  },
});
