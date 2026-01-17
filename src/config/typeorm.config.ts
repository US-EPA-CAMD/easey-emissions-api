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
    // Values are: true | false | 'all' | 'query', 'error', 'schema', 'warn', 'info', 'log'
    const rawLogging = this.configService.get<string>('app.sqlLogging');
    const sqlLogging: LoggerOptions = rawLogging === 'false'
      ? false
      : rawLogging.split(',').map(level => level.trim()) as LoggerOptions;

    const baseConfig = {
      type: 'postgres' as const,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: false,
      logging: sqlLogging,
      maxQueryExecutionTime: this.configService.get<number>('app.maxQueryExecutionTime'),
      extra: {
        max: this.configService.get<number>('app.maxConnectionPool'),
        idleTimeoutMillis: this.configService.get<number>('app.idleTimeout'),
        connectionTimeoutMillis: this.configService.get<number>('app.connectionTimeout'),
        statement_timeout: this.configService.get<number>('app.statementTimeout'),
        idle_in_transaction_session_timeout: this.configService.get<number>('app.idleInTransactionSessionTimeout'),
        maxUses: this.configService.get<number>('app.maxUsesBeforeRecreatingConnection'),
      },
    };

    const replicaHost = this.configService.get<string>('database.replicaHost');
    const mainHost = this.configService.get<string>('database.host');

    const replicaAccessEnabled = this.configService.get<boolean>('app.enableReplicaDbAccess');
    
    // If replica host is configured and different from main host, enable replication
    if (replicaAccessEnabled && replicaHost && replicaHost !== mainHost) {
      console.log('Database replication enabled with replica host:', replicaHost);
      
      const commonConnectionSettings = {
        port: this.configService.get<number>('database.port'),
        username: this.configService.get<string>('database.user'),
        password: this.configService.get<string>('database.pwd'),
        database: this.configService.get<string>('database.name'),
        ssl: this.tlsOptions,
        applicationName: this.configService.get<string>('app.name'),
      };

      return {
        ...baseConfig,
        replication: {
          master: {
            host: mainHost,
            ...commonConnectionSettings,
          },
          slaves: [
            {
              host: replicaHost,
              ...commonConnectionSettings,
            },
          ],
          defaultMode: 'master' as const,
        },
      };
    } else {
      // Fallback to single database configuration if no replica is configured or replica is same as master
      console.log('Database replication not enabled, using single database configuration');
      return {
        ...baseConfig,
        applicationName: this.configService.get<string>('app.name'),
        host: mainHost,
        port: this.configService.get<number>('database.port'),
        username: this.configService.get<string>('database.user'),
        password: this.configService.get<string>('database.pwd'),
        database: this.configService.get<string>('database.name'),
        ssl: this.tlsOptions,
      };
    }
  }
}
