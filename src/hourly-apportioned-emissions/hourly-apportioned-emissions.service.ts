import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HourlyApportionedEmissionsService {
  constructor(private configService: ConfigService) {}

  getHourlyEmissions(): string {
    console.log(`${this.configService.get('app.uri')}/emissions/apportioned/hourly`);
    return 'Hello getHourlyEmissions!';
  }
}
