import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiConfigService {
  public static getHost(): string {
    const host = process.env.EASEY_API_HOST || 'localhost';

    if (host === 'localhost') {
      const port = process.env.EASEY_EMISSIONS_MGMT_API_PORT || 8080;
      return `localhost:${port}/`;
    }
    return process.env.EASEY_API_HOST;
  }
}
