export const quarterFromMonth = (month: number): number => {
  if (month >= 1 && month <= 3) {
    return 4;
  } else if (month >= 4 && month <= 6) {
    return 1;
  } else if (month >= 7 && month <= 9) {
    return 2;
  } else {
    return 3;
  }
};
