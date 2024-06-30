import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { ViewsBookmarksController } from './view-bookmarks.controller';
import { RestBookmarksController } from './rest-bookmarks.controller';

@Module({
  controllers: [ViewsBookmarksController, RestBookmarksController],
  providers: [BookmarksService],
  exports: [],
})
export class BookmarksModule { }
