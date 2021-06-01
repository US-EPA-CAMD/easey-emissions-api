import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parser } from 'json2csv';
import { v4 as uuid } from 'uuid';

@Injectable()
export class Json2CsvInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    let format = 'json';

    if (req.headers.accept === 'text/csv') {
      format = 'csv';
    }

    return next.handle().pipe(
      map(data => {
        if (req.query.attachFile === 'true') {
          req.res.attachment(`${uuid()}.${format}`);
        }

        if (req.headers.accept === 'text/csv') {
          req.res.header('Content-Type', 'text/csv');

          const headers = req.res.getHeaders();
          const fields = JSON.parse(headers['x-field-mappings']);
          const json2csv = new Parser({ fields });
          return json2csv.parse(data);
        }

        return data;
      }),
    );
  }
}
