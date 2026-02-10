import { ILogger } from "./ILogger";
import { PinoLogger } from "./PinoLogger";

/**
 * Logger factory that creates logger instances.
 * This is the single place where the logger implementation is chosen,
 * making it easy to swap implementations.
 */
export class LoggerFactory {
  private static loggerImplementation: "pino" = "pino";

  /**
   * Create a new logger instance
   * @param name - The name/category for this logger (e.g., 'AuthController', 'WeatherService')
   * @returns A logger instance
   */
  static create(name?: string): ILogger {
    // This is where you can easily swap implementations
    // Just change this switch statement to use a different logger
    switch (this.loggerImplementation) {
      case "pino":
      default:
        return new PinoLogger(name);
    }
  }

  /**
   * Change the logger implementation globally
   * @param implementation - The logger implementation to use
   */
  static setImplementation(implementation: "pino"): void {
    this.loggerImplementation = implementation;
  }
}

/**
 * Convenience function to create a logger
 * @param name - The name/category for this logger
 * @returns A logger instance
 */
export function createLogger(name?: string): ILogger {
  return LoggerFactory.create(name);
}
