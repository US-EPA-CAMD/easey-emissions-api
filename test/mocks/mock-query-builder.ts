export const mockQueryBuilder = {
  innerJoin: jest.fn(),
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
  getOne: jest.fn(),
};
