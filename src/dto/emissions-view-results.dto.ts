import { ApiProperty } from '@nestjs/swagger';

import { EmissionsViewColumnDTO } from './emissions-view-column.dto';

export class EmissionsViewResultsDTO {
  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  code: string;

  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  name: string;

  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  noResultsMessage: string;

  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  columns: EmissionsViewColumnDTO[];

  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  results: any[];
}
