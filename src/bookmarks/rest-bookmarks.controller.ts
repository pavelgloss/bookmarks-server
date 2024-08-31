import { Body, Controller, Get, Param, Post, Query, NestMiddleware, HttpCode } from '@nestjs/common';
import { BookmarksService, CreateBookmarkDto, SavedBookmark } from './bookmarks.service';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

export class Successible {
  @ApiProperty()
  success: boolean;
}

export class SuccessWithCount extends Successible {
  @ApiProperty()
  count: number;
}

class BookmarkUrlDto {
  @ApiProperty()
  url: string;
}

class CheckDuplicateResponseDto {
  @ApiProperty({ default: 0 })
  duplicates: number;
}

@ApiTags('bookmarks')
@Controller('api/bookmarks')
export class RestBookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) { }

  @Post()
  @ApiBody({ type: CreateBookmarkDto })
  @ApiResponse({ status: 201, description: 'The bookmark has been successfully created.', type: SuccessWithCount })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createBookmark(@Body() bookmark: CreateBookmarkDto): Promise<SuccessWithCount> {
    // original endpoint>     "/save"

    // od unor 2023 kdy procesuju kazda zalozka dostane tento tag
    // truckers2, joinedAutix, beforeTermsTech
    // termsTechQuick ... kdyz jsem mel asi 550 zalozek a chtel behem večera sdělat rychle
    // cleanup07   ... 07-2024
    // cleanup08        08-2024 ...asi 350 zalozek pred nastupem

    bookmark.tags.push("cleanup08");
    // bookmark.tags.push("cleanup07");
    // bookmark.tags.push("termsTechQuick");

    const newBookmark: SavedBookmark = await this.bookmarksService.addBookmark(bookmark);
    const count = await this.bookmarksService.getCount();

    return { success: true, count: count };
  }

  @Post("/saveBackup")
  async saveAllBookmarks(@Body() bookmarks: CreateBookmarkDto[]): Promise<SuccessWithCount> {
    const filename: string = "backupAllTabs-" + Date.now() + ".db";

    const newBookmarks: SavedBookmark[] = await this.bookmarksService.saveAllBookmarks(bookmarks, filename);

    return { success: true, count: newBookmarks.length };
  }

  @Get()
  @ApiResponse({ status: 200, description: 'All bookmarks', type: [SavedBookmark] })
  async getAllBookmarks(): Promise<SavedBookmark[]> {
    const bookmarks = await this.bookmarksService.getAllBookmarks();
    return bookmarks;
  }

  @Post("/check-duplicate")
  @HttpCode(200)
  @ApiBody({ type: BookmarkUrlDto })
  @ApiResponse({ status: 200, description: 'Check duplicate', type: CheckDuplicateResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })    // by framework
  // ie. Expected double-quoted property name in JSON at position 38 (line 3 column 1)
  async checkDuplicate(@Body() bookmarkUrl: BookmarkUrlDto): Promise<CheckDuplicateResponseDto> {
    const bookmarks = await this.bookmarksService.getByUrl(bookmarkUrl.url);

    if (bookmarks.length > 0) {
      console.log('WARNING: Duplicate URL found! ' + bookmarks.length + "x, " + bookmarkUrl.url);
      bookmarks.forEach((bm) => {
        console.log("_id: " + bm._id + ", tags: " + bm.tags);
      });

      return { duplicates: bookmarks.length }
    };

    return { duplicates: 0 };

    // TODO more advanced search with $where criteria
    // db.find({ $where: function () { return Object.keys(this) > 6; } }, function (err, docs) {
    //     // docs with more than 6 properties
    // });
  }

  @Get("/count")
  async getCount(): Promise<SuccessWithCount> {
    const count = await this.bookmarksService.getCount();
    return { success: true, count: count };
  }

  @Get("/tags")
  // return example json: ["prioa","prioaa","product management","postpone","video","agile"]
  async getTags(): Promise<string[]> {
    const tags = await this.bookmarksService.getTagsSortedByUsage();
    return tags;
  }

  @Get("/tags-cloud")
  // return example json: [{"tag":"prioa","count":10},{"tag":"prioaa","count":5},{"tag":"product management","count":3}]
  async getTagsCloud(): Promise<any> {
    const tagsMap: Map<string, number> = this.bookmarksService.getTagCountMap();

    // tagsMap to json
    let tagsJson = [];
    tagsMap.forEach((value, key) => {
      tagsJson.push({ tag: key, count: value });
    });
    return tagsJson;
  }

  @Get(':guid/:resource?')
  async dynamicGetEndpoint(
    @Param('guid') guid: string,
    @Param('resource') resource: string,
    @Query() query: any): Promise<any> {

    console.log('guid: ' + guid + ', resource: ' + resource);


    return {
      guid: guid,
      resource: resource || 'default',
      query: query
    };



  }

}