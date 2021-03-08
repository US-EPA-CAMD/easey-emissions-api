export class Regex {
  /**
   * Search for a specific string in a comma delimited list
   */
  public static commaDelimited(element: string): string {
    return `'((^${element}$)|([,][ ]*${element}$)|([,][ ]*${element}[,])|(^${element}[,])|(^${element} [(])|([,][ ]*${element} [(]))'`;
  }
}
