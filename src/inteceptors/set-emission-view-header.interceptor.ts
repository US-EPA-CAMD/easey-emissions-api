import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConnectionService } from '@us-epa-camd/easey-common/connection';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getFileName } from '../utils/selected-emission-view';

@Injectable()
export class SetEmissionViewHeaderInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const fileName = await getFileName(
      req.params.viewCode,
      req.query,
      ConnectionService.getEntityManager(),
    );
    return next.handle().pipe(
      map(data => {
        if (req.query.attachFile === 'true') {
          req.res.setHeader(
            'content-disposition',
            `attachment; filename="${fileName}"`,
          );
        }

        return data;
      }),
    );
  }
}
