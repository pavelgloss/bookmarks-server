import { Controller, Get, Render } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

//@Controller('list')
@Controller()
export class ViewsBookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {

  }

  @Get('/v0')
  @Render('v0-pokus')
  getPokus() {
    return;
  }
  
  //@Get()
  @Get('/list2')
  @Render('list')
  async getList() {
    //const bookmarks = await this.bookmarksService.findAll();
    const bookmarks = await this.bookmarksService.getAllBookmarks();
    return {
      bookmarks
    };
  }


  // @Get('/')
  // @Render('index')
  // getIndex() {
  //   return { message: 'Welcome to the Index Page' };
  // }

}

