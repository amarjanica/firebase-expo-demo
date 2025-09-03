import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class FirebaseMiddleware implements NestMiddleware {
  constructor(private readonly firebaseService: FirebaseService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }
    const token = header.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      req.user = await this.firebaseService.auth().verifyIdToken(token);
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    next();
  }
}
