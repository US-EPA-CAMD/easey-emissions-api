import { ApiProperty } from '@nestjs/swagger';

import { EmissionsViewColumnDTO } from './emissions-view-column.dto';

export class EmissionsViewDTO {
  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  code: string;

  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  name: string;
}
