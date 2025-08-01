import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ArtistsModule } from 'src/artists/artists.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    ArtistsModule
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}