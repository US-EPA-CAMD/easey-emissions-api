import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.train_qa_status_code' })
export class TrainQaStatusCode extends BaseEntity {
  @PrimaryColumn({
    name: 'train_qa_status_cd',
  })
  trainQaStatusCode: string;

  @Column({
    name: 'train_qa_status_description',
  })
  trainQaStatusDescription: string;
}
