import { Exclude } from 'class-transformer';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({unique: true})
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'text' })
  twoFASecret: string | null;
  
  @Column({ default: false, type: 'boolean' })
  enable2FA: boolean;

  @Column({ nullable: true, type: 'text' })
  apiKey: string | null;

  @Column({ nullable: true })
  phone: string

  /**
   * A user can create many playLists
   */
  @OneToMany(() => Playlist, (playList) => playList.user)
  playLists: Playlist[];
}