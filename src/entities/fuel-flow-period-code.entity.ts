import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.fuel_flow_period_code' })
export class FuelFlowPeriodCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'fuel_flow_period_cd',
  })
  fuelFlowPeriodCode: string;

  @Column({
    type: 'varchar',
    name: 'ff_period_cd_description',
  })
  fuelFlowPeriodDescription: string;
}
