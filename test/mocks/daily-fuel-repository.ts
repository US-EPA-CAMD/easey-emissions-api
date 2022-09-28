export const mockDailyFuelRepository = {
  createQueryBuilder: jest.fn(() => {
    return function where() {
      return function getMany() {
        return;
      };
    };
  }),
};
