export const mockEmissionsWorkspaceRepository = {
  create: () => undefined,
  delete: jest.fn().mockResolvedValue(undefined),
  export: () => jest,
  findOne: () => undefined,
  save: jest.fn().mockResolvedValue(undefined),
};
