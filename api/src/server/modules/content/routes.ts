import { NextFunction, Request, Response, Router } from 'express';
import * as path from 'path';
import * as uploadService from 'services/upload';

export const router = Router();

router.get('/:path', function (req: Request, res: Response, next: NextFunction): void {
  try {
    const filepath = uploadService.getPath(req.params.path);
    res.sendFile(path.resolve(filepath));
  } catch (err) {
    next(err);
  }
});

router.get('/:path/download/:filename?', function (req: Request, res: Response, next: NextFunction): void {
  try {
    const filepath = uploadService.getPath(req.params.path);
    res.download(filepath, req.params.filename);
  } catch (err) {
    next(err);
  }
});
