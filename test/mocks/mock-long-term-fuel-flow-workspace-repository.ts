export const mockLongTermFuelFlowWorkspaceRepository = {
  create: () => jest,
  delete: jest.fn().mockResolvedValue(undefined),
  export: () => jest,
  save: jest.fn().mockResolvedValue(undefined),
};
