import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { ViewsBookmarksController } from './view-bookmarks.controller';
import { RestBookmarksController } from './rest-bookmarks.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  controllers: [ViewsBookmarksController, RestBookmarksController],
  providers: [BookmarksService],
  exports: [],
})
export class BookmarksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(RestBookmarksController);   // Apply to all routes in the controller
  }
}