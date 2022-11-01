export const quarterFromMonth = (month: number): number => {
  if (month >= 0 && month <= 2) {
    return 1;
  } else if (month >= 3 && month <= 5) {
    return 2;
  } else if (month >= 6 && month <= 8) {
    return 3;
  } else {
    return 4;
  }
};
