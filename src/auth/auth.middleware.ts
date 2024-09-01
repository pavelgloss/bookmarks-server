import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    // disable auth
    if (true) {
      next();
      return;
    }

    if (req.session && req.session["user"]) {  // TODO use req.session.user

      next();
    } else {
      res.status(401).send({ message: 'Unauthorized' });
    }
  }
}