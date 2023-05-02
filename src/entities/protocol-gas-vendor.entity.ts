import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmps.protocol_gas_vendor' })
export class ProtocolGasVendor extends BaseEntity {
  @PrimaryColumn({
    name: 'vendor_id',
    nullable: false,
  })
  id: string;

  @Column({
    name: 'vendor_name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  vendorName: string;

  @Column({
    name: 'deactivation_date',
    type: 'date',
    nullable: true,
  })
  deactivationDate: Date;

  @Column({
    name: 'add_date',
    nullable: true,
  })
  addDate: Date;

  @Column({
    name: 'update_date',
    nullable: true,
  })
  updateDate: Date;

  @Column({
    name: 'userid',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  userId: string;

  @Column({
    name: 'active_ind',
    type: 'numeric',
    precision: 1,
    scale: 0,
    nullable: false,
    transformer: new NumericColumnTransformer(),
  })
  activeIndicator: number;

  @Column({
    name: 'activation_date',
    type: 'date',
    nullable: true,
  })
  activationDate: Date;
}
