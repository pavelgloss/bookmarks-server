import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiProperty } from '@nestjs/swagger';
//import * as Datastore from '@seald-io/nedb';    // const Datastore = require('nedb');  older import
const Datastore = require('@seald-io/nedb')


export class CreateBookmarkDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  timestampStop: number;

  @ApiProperty()
  timestampStart: number;
}

export class SavedBookmark extends CreateBookmarkDto {
  @ApiProperty()
  _id: string;
}

@Injectable()
export class BookmarksService implements OnModuleInit {
  private db: any;
  private tagCountMap: Map<string, number> = new Map<string, number>();
  private bookmarkCount: number = 0;

  constructor() {
    const i = 0;
  }

  async onModuleInit() {
    this.db = new Datastore({ filename: 'pokusna.db', corruptAlertThreshold: 0 });
    await this.db.loadDatabaseAsync();
    await this.initializeBookmarks();
  }

  private async initializeBookmarks() {
    const bookmarks: SavedBookmark[] = await this.getAllBookmarks();
    this.bookmarkCount = bookmarks.length;
    bookmarks.forEach((bookmark: SavedBookmark) => {
      bookmark.tags.forEach((tag) => {
        this.addTagToMap(tag);
      });

    });
    console.log("---------- Bookmarks loaded --------------");
    console.log("| Bookmarks count: |" + this.bookmarkCount);
    console.log("| Tags count:      |" + this.tagCountMap.size);
    console.log(this.tagCountMap);
    console.log("------------------------------------------");
    // console.log(this.tagCountMap);
  }

  private addTagToMap(tag: string) {
    let normalizedTag = tag.toLowerCase();
    if (this.tagCountMap.has(normalizedTag)) {
      let newCount = this.tagCountMap.get(normalizedTag) + 1;
      this.tagCountMap.set(normalizedTag, newCount);
    } else {
      this.tagCountMap.set(normalizedTag, 1);
    }
  }

  private addTagsToMap(tags: string[]) {
    tags.forEach((tag) => {
      this.addTagToMap(tag);
    });
  }

  async addBookmark(bookmark: CreateBookmarkDto): Promise<SavedBookmark> {
    this.addTagsToMap(bookmark.tags);

    const newBookmark: SavedBookmark = await this.db.insertAsync(bookmark);
    this.bookmarkCount++;

    const textInSeconds = (bookmark.timestampStop - bookmark.timestampStart) / 1000 + " sec";
    console.log("time to annotate was : " + textInSeconds);
    console.log("created bookmark: ");
    console.log(newBookmark);

    return newBookmark;
  }

  async getCount(): Promise<number> {
    const count: number = await this.db.countAsync({})
    return count;
  }

  getTagCountMap(): Map<string, number> {
    return this.tagCountMap;
  }

  async getTagsSortedByUsage(): Promise<string[]> {
    const sortedTags = Array.from(this.tagCountMap.entries())
      .sort((a, b) => b[1] - a[1])    // compare by count descending
      .map((entry) => entry[0]);      // get only tag name which is key in pair
    return sortedTags;
  }

  async getAllBookmarks(): Promise<SavedBookmark[]> {
    const bookmarks: SavedBookmark[] = await this.db.findAsync({});
    return bookmarks;
  }

  async getByUrl(url: string): Promise<SavedBookmark[]> {
    const bookmarks: SavedBookmark[] = await this.db.findAsync({ url: url });
    return bookmarks;
  }

  // TODO not used yet, not tested
  async updateBookmark(id: string, bookmark: CreateBookmarkDto): Promise<SavedBookmark> {
    const updatedBookmark: SavedBookmark = await this.db.updateAsync({ _id: id }, { $set: bookmark }, {});
    return updatedBookmark;
  }

  async saveAllBookmarks(bookmarks: CreateBookmarkDto[], filename: string): Promise<SavedBookmark[]> {
    const dbAllTabs = new Datastore({ filename: filename, corruptAlertThreshold: 0 });
    await dbAllTabs.loadDatabaseAsync();
    const savedBookmarks: SavedBookmark[] = await dbAllTabs.insertAsync(bookmarks);

    console.log('All bookmarks saved into file ' + filename);

    return savedBookmarks;
  }

  
  // every 5 minutes
  @Cron('* */5 * * * *')
  async cronTask() {
    console.log('cron task executed!');
  }

}
