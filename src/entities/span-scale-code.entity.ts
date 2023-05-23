import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.span_scale_code' })
export class SpanScaleCode extends BaseEntity {
  @PrimaryColumn({
    name: 'span_scale_cd',
  })
  testResultCode: string;

  @Column({
    name: 'span_scale_cd_description',
  })
  spanScaleDescription: string;
}
