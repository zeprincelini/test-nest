import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const start = Date.now();

    console.log(`${req.method} ${req.originalUrl} - ${req.ip}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
