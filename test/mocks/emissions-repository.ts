export const mockEmissionsRepository = {
  delete: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue(undefined),
  export: jest.fn(),
};
