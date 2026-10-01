export const toRegexParameter = (quotedPattern: string): string => {
  if (
    quotedPattern.length < 2 ||
    quotedPattern[0] !== "'" ||
    quotedPattern[quotedPattern.length - 1] !== "'"
  ) {
    throw new Error('Expected a single-quoted regex pattern');
  }

  return quotedPattern.slice(1, -1);
};
