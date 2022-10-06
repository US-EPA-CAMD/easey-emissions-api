import { ApiProperty } from '@nestjs/swagger';

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
