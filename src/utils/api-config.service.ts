import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiConfigService {
  public static getHost(): string {
    const host = process.env.EASEY_EMISSIONS_API_HOST || 'localhost';

    if (host === 'localhost') {
      const port = process.env.EASEY_EMISSIONS_API_PORT || 8080;
      return `localhost:${port}`;
    }
    return host;
  }

  public static getMdm(): string {
    return `https://${this.getHost()}/api/master-data-mgmt/`;
  }
}
