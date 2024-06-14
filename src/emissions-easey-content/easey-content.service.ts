import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmissionsSchema } from './emissions.schema.response';

@Injectable()
export class EaseyContentService {
  emissionsSchema: EmissionsSchema;
  constructor(private readonly configService: ConfigService) {
    this.getEmissionsSchema();
  }

  async getEmissionsSchema(): Promise<void> {
    try {
      const response = await fetch(
        `${
          this.configService.get('app').contentApi.uri
        }/ecmps/reporting-instructions/emissions.schema.json`,
      );
      if (response.ok) this.emissionsSchema = await response.json();
    } catch (e) {
      console.error(e);
    }
  }
}