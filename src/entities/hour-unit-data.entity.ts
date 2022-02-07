// import {
//   BaseEntity,
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryColumn,
// } from 'typeorm';
// import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

// import { UnitFact } from './unit-fact.entity';

// @Entity({ name: 'camddmw.hour_unit_data' })
// export class HourUnitData extends BaseEntity {
//   @PrimaryColumn({
//     name: 'unit_id',
//     transformer: new NumericColumnTransformer(),    
//   })
//   id: number;

//   @PrimaryColumn({
//     name: 'op_date',
//     type: 'date',
//   })
//   date: Date;

//   @PrimaryColumn({
//     name: 'op_hour',
//     transformer: new NumericColumnTransformer(),
//   })
//   hour: number;

//   @Column({
//     name: 'op_year',
//     transformer: new NumericColumnTransformer(),    
//   })
//   year: number;

//   @Column('numeric', {
//     name: 'op_time',
//     precision: 4,
//     scale: 2,
//     transformer: new NumericColumnTransformer(),
//   })
//   opTime: number;

//   @Column('numeric', {
//     name: 'gload',
//     precision: 8,
//     scale: 2,
//     transformer: new NumericColumnTransformer(),
//   })
//   grossLoad: number;

//   @Column('numeric', {
//     name: 'sload',
//     precision: 8,
//     scale: 2,
//     transformer: new NumericColumnTransformer(),
//   })
//   steamLoad: number;

//   @Column('numeric', {
//     name: 'heat_input',
//     precision: 15,
//     scale: 3,
//     transformer: new NumericColumnTransformer(),
//   })
//   heatInput: number;

//   @Column('numeric', {
//     name: 'so2_mass',
//     precision: 15,
//     scale: 3,
//     transformer: new NumericColumnTransformer(),
//   })
//   so2Mass: number;

//   @Column({
//     name: 'so2_mass_measure_flg',
//   })
//   so2MassMeasureFlg: string;

//   @Column('numeric', {
//     name: 'so2_rate',
//     precision: 15,
//     scale: 3,
//     transformer: new NumericColumnTransformer(),
//   })
//   so2Rate: number;

//   @Column({
//     name: 'so2_rate_measure_flg',
//   })
//   so2RateMeasureFlg: string;

//   @Column('numeric', {
//     name: 'co2_mass',
//     precision: 15,
//     scale: 3,
//     transformer: new NumericColumnTransformer(),
//   })
//   co2Mass: number;

//   @Column({
//     name: 'co2_mass_measure_flg',
//   })
//   co2MassMeasureFlg: string;

//   @Column('numeric', {
//     name: 'co2_rate',
//     precision: 15,
//     scale: 3,
//     transformer: new NumericColumnTransformer(),
//   })
//   co2Rate: number;

//   @Column({
//     name: 'co2_rate_measure_flg',
//   })
//   co2RateMeasureFlg: string;

//   @Column('numeric', {
//     name: 'nox_mass',
//     precision: 15,
//     scale: 3,
//     transformer: new NumericColumnTransformer(),
//   })
//   noxMass: number;

//   @Column({
//     name: 'nox_mass_measure_flg',
//   })
//   noxMassMeasureFlg: string;

//   @Column('numeric', {
//     name: 'nox_rate',
//     precision: 15,
//     scale: 3,
//     transformer: new NumericColumnTransformer(),
//   })
//   noxRate: number;

//   @Column({
//     name: 'nox_rate_measure_flg',
//   })
//   noxRateMeasureFlg: string;

//   @ManyToOne(
//     () => UnitFact,
//     uf => uf.hourUnitData,
//   )
//   @JoinColumn([
//     {
//       name: 'unit_id',
//       referencedColumnName: 'id',
//     },
//     {
//       name: 'op_year',
//       referencedColumnName: 'year',
//     },
//   ])
//   unitFact: UnitFact;
// }
