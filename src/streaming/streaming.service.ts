import { Client } from 'pg';
import { Request } from 'express';
import JSONStream from 'JSONStream';
import QueryStream from 'pg-query-stream';

import { ConfigService } from '@nestjs/config';

import {
  Injectable,
  StreamableFile,
} from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { Json2CSV } from './../transforms/json2csv.transform';

@Injectable()
export class StreamingService {
  private dbClient: Client;
  private batchSize = this.configService.get<number>('app.streamBatchSize');
  private highWaterMark = this.configService.get<number>('app.streamHighWaterMark')

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.dbClient = new Client({
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      user: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.pwd'),
      database: this.configService.get<string>('database.name'),
    });
    
    this.dbClient.connect();
    //this.dbClient.on('error', (err: any) => this.logger.error(err, "pgClient error"));
  }

  getStream(
    req: Request,
    sql: string,
    params: any[],
    dtoTransform: any,
    disposition: string,    
    fieldMappings: string[],
  ): StreamableFile {
    const queryStream = new QueryStream(
      sql,
      params,
      {
        batchSize: this.batchSize,
        highWaterMark: this.highWaterMark
      }
    );

    let dbStream = this.dbClient
      .query(queryStream)
      // THIS CAUSES A HUGE PERFORMANCE ISSUE
      // .on("end", () => {
      //   try {
      //     dbStream.destroy();
      //     dbStream = null;
      //   } catch (e) {}
      // })
      .pipe(dtoTransform);

    req.on('close', () => {
      dbStream.emit('end');
    });

    req.res.setHeader(
      'X-Field-Mappings',
      JSON.stringify(fieldMappings),
    );

    if (req.headers.accept === 'text/csv') {
      const json2Csv = new Json2CSV(fieldMappings);
      return new StreamableFile(dbStream.pipe(json2Csv), {
        type: req.headers.accept,
        disposition: `${disposition}.csv`,
      });
    }

    return new StreamableFile(dbStream.pipe(JSONStream.stringify()), {
      type: req.headers.accept,
      disposition: `${disposition}.json`,
    });
  }
}