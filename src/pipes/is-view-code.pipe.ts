import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { getManager, ILike } from 'typeorm';
import { ApiConfigService } from '@us-epa-camd/easey-common/constants';

import { DataSet } from '../entities/dataset.entity';

@Injectable()
export class IsViewCode implements PipeTransform<string, Promise<string>> {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    const manager = getManager();
    const found = await manager.findOne(DataSet, {
      code: ILike(value),
      templateCode: 'EMVIEW',
    });
    if (found != null) {
      return value;
    }
    throw new BadRequestException(
      `The viewCode you have entered is invalid. Please refer to this link for a list of valid codes ${ApiConfigService.getEmissionsApi()}/emissions/views`,
    );
  }
}
