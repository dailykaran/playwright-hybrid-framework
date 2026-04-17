export class CommonHelpers {
  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): number {
    return Date.now();
  }

  /**
   * Get current date string
   */
  static getCurrentDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get current time string
   */
  static getCurrentTimeString(): string {
    return new Date().toISOString().split('T')[1];
  }

  /**
   * Format date to specific format
   */
  static formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Compare two dates
   */
  static compareDates(date1: Date, date2: Date): number {
    return date1.getTime() - date2.getTime();
  }

  /**
   * Check if string contains substring
   */
  static contains(str: string, substring: string): boolean {
    return str.includes(substring);
  }

  /**
   * Check if string is empty
   */
  static isEmpty(str: string): boolean {
    return str === null || str === undefined || str.trim().length === 0;
  }

  /**
   * Convert string to title case
   */
  static toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  /**
   * Convert string to camel case
   */
  static toCamelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    });
  }

  /**
   * Deep clone object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge objects
   */
  static mergeObjects<T extends object>(obj1: T, obj2: Partial<T>): T {
    return { ...obj1, ...obj2 };
  }

  /**
   * Calculate percentage
   */
  static calculatePercentage(value: number, total: number): number {
    return (value / total) * 100;
  }

  /**
   * Round number to decimal places
   */
  static roundDecimal(value: number, places: number): number {
    return Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
  }
}
