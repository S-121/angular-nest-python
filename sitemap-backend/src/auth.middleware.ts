import {
  Injectable,
  NestMiddleware,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ProjectDocument } from 'src/modules/project/schemas';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@InjectConnection() private connection: Connection) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.query;
      console.log({ projectId });
      if (projectId && req.user) {
        const {
          createdBy: { access_token, refresh_token },
        } = await this.connection
          .model<ProjectDocument>('project')
          .findOne({ _id: projectId });
        if (access_token && refresh_token) {
          req.user = Object.assign(req.user, { access_token, refresh_token });
        }
        console.log({ access_token, refresh_token });
      }
    } catch (err) {
    } finally {
      next();
    }
  }
}
