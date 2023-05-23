import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.test_result_code' })
export class TestResultCode extends BaseEntity {
  @PrimaryColumn({
    name: 'test_result_cd',
  })
  testResultCode: string;

  @Column({
    name: 'test_result_cd_description',
  })
  testResultDescription: string;
}
