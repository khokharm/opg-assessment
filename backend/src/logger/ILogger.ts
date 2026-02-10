/**
 * Logger interface that allows for modular logger implementations.
 * This abstraction allows swapping logger implementations (Pino, Winston, Bunyan, etc.)
 * without changing application code.
 */
export interface ILogger {
  /**
   * Log a debug message (lowest priority)
   * @param message - The log message
   * @param context - Optional context object with additional data
   */
  debug(message: string, context?: object): void;

  /**
   * Log an informational message
   * @param message - The log message
   * @param context - Optional context object with additional data
   */
  info(message: string, context?: object): void;

  /**
   * Log a warning message
   * @param message - The log message
   * @param context - Optional context object with additional data
   */
  warn(message: string, context?: object): void;

  /**
   * Log an error message
   * @param message - The log message
   * @param context - Optional context object with additional data (include error object here)
   */
  error(message: string, context?: object): void;

  /**
   * Log a fatal error message (highest priority)
   * @param message - The log message
   * @param context - Optional context object with additional data
   */
  fatal(message: string, context?: object): void;

  /**
   * Create a child logger with additional context that will be included in all logs
   * @param context - Context object that will be merged into all log calls
   * @returns A new logger instance with the additional context
   */
  child(context: object): ILogger;
}
