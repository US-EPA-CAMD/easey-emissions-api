import { LoggerOptions } from 'typeorm';

require('dotenv').config();
import { TlsOptions } from 'tls';
import { readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private tlsOptions: TlsOptions = { requestCert: true };

  constructor(private readonly configService: ConfigService) {
    const host = configService.get<string>('database.host');
    this.tlsOptions.rejectUnauthorized = (host !== 'localhost');
    this.tlsOptions.ca = (host !== 'localhost')
      ? readFileSync("./us-gov-west-1-bundle.pem").toString()
      : null;
    console.log('TLS/SSL Config:', {
      ...this.tlsOptions,
      ca: (this.tlsOptions.ca !== null)
        ? `${this.tlsOptions.ca.slice(0, 30)}...(truncated for display only)`
        : null
    });
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      applicationName: this.configService.get<string>('app.name'),
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.pwd'),
      database: this.configService.get<string>('database.name'),
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: false,
      ssl: this.tlsOptions,

      // Database specific (Postgres) settings.
      extra: {
        max: this.configService.get<number>('app.maxConnectionPool'),                                 // Max connections in pool
        idleTimeoutMillis: this.configService.get<number>('app.idleTimeout'),                         // Close idle connections
        connectionTimeoutMillis: this.configService.get<number>('app.connectionTimeout'),             // Maximum time (ms) to wait for a new connection before timing out.
        acquireTimeoutMillis: this.configService.get<number>('app.acquireConnectionFromPoolTimeout'), // Fail if a connection is not acquired from the pool within timeframe
        statement_timeout: this.configService.get<number>('app.statementTimeout'),                    // Terminates queries that exceed the timeout (in ms).
        idle_in_transaction_session_timeout: this.configService.get<number>('app.idleInTransactionSessionTimeout'), // Terminates idle transactions after the specified time (in ms).
        maxUses: this.configService.get<number>('app.maxUsesBeforeRecreatingConnection'), //Recreate connections after 'n' uses
      },
      // Enable SQL Logging. Values are: true | false | 'all' | ['query', 'error', 'schema', 'warn', 'info', 'log']
      logging: this.configService.get<LoggerOptions>('app.sqlLogging', ),
      // Logs queries exceeding this limit (does not terminate, 'statement_timeout' terminates them).
      maxQueryExecutionTime: this.configService.get<number>('app.maxQueryExecutionTime'),

    };
  }
}
