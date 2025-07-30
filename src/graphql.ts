
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateAlbumInput {
    title: string;
}

export class UpdateAlbumInput {
    title?: Nullable<string>;
}

export class Album {
    id: string;
    title: string;
}

export abstract class IQuery {
    abstract albums(): Album[] | Promise<Album[]>;

    abstract album(id: string): Nullable<Album> | Promise<Nullable<Album>>;
}

export abstract class IMutation {
    abstract createAlbum(input: CreateAlbumInput): Album | Promise<Album>;

    abstract updateAlbum(id: string, input: UpdateAlbumInput): Album | Promise<Album>;

    abstract deleteAlbum(id: string): boolean | Promise<boolean>;
}

type Nullable<T> = T | null;
