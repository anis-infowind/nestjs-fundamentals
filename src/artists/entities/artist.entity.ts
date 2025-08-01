import { Song } from 'src/songs/entities/song.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  // A user can register as an artist​
  // Each artist will have only a user profile​
  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' } )
  @JoinColumn()
  user: User;

  //Add Many to Many Relation in Artist
  @ManyToMany(() => Song, (song) => song.artists, { onDelete: 'CASCADE' })
  songs: Song[];
}