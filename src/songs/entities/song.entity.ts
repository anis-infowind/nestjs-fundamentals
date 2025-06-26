import { Artist } from "src/artists/entities/artist.entity";
import { Playlist } from "src/playlists/entities/playlist.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // @Column({
  //   type: 'varchar',
  //   transformer: {
  //     to: (value: string[]) => value.join(','), // array to string
  //     from: (value: string) => value ? value.split(',') : [], // string to array
  //   },
  // })
  // artists: string[];

  @Column('date')
  releasedDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  lyrics: string;

  // Add Many to Many Relation in Song
  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: "songs_artists" })
  artists: Artist[];

  /**
   * Many songs can belong to playlist for each unique user
   */
  @ManyToOne(() => Playlist, (playList) => playList.songs)
  playList: Playlist;
  
}