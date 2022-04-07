import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReadStream } from 'fs';
const { Client } = require('pg');
const QueryStream = require('pg-query-stream');

@Injectable()
export class StreamService {
  constructor(private readonly configService: ConfigService) {}

  async getStream(query): Promise<ReadStream> {
    let queryString: string = query[0];
    const params = query[1];

    let paramIndex = 1;
    params.forEach(param => {
      queryString = queryString.replace('$' + paramIndex, "'" + param + "'");
      paramIndex++;
    });

    const client = new Client({
      user: this.configService.get<string>('database.user'),
      host: this.configService.get<string>('database.host'),
      database: this.configService.get<string>('database.name'),
      password: this.configService.get<string>('database.pwd'),
      port: this.configService.get<number>('database.port'),
    });
    await client.connect();

    const queryStream = new QueryStream(queryString);

    return client.query(queryStream);
  }
}
