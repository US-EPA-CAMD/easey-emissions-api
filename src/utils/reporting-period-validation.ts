export function isInReportingPeriodRange(year, quarter) {
  const date = new Date();
  const currentYear = date.getFullYear().toString();
  const currentQuarter = Math.floor((date.getMonth() + 3) / 3).toString();
  if (year && quarter) {
    return (
      year >= 2009 &&
      (year < currentYear ||
        (year === currentYear && quarter <= currentQuarter))
    );
  }
  return true;
}
