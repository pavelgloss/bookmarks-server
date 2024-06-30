import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExampleController } from './example/example.controller';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    BookmarksModule
  ],
  controllers: [AppController, ExampleController],
  providers: [AppService],
})
export class AppModule {

}


