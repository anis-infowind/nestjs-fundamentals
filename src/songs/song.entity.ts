import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: string[]) => value.join(','), // array to string
      from: (value: string) => value ? value.split(',') : [], // string to array
    },
  })
  artists: string[];

  @Column('date')
  releasedDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  lyrics: string;
  
}