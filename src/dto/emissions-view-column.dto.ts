import { ApiProperty } from '@nestjs/swagger';

export class EmissionsViewColumnDTO {
  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  name: string;

  @ApiProperty({
    description: 'NEED TO UPDATE DESCRIPTION',
  })
  displayName: string;
}