import { Repository } from 'typeorm';

export type DeleteCriteria = Parameters<typeof Repository.prototype.delete>[0];
