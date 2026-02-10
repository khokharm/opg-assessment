import pino from "pino";
import { ILogger } from "./ILogger";
import { config } from "../config";

/**
 * Pino implementation of the ILogger interface.
 * Provides high-performance structured logging with JSON output in production
 * and pretty-printed output in development.
 */
export class PinoLogger implements ILogger {
  private logger: pino.Logger;

  constructor(name?: string) {
    const isDevelopment = config.nodeEnv === "development";

    // Configure pino based on environment
    this.logger = pino({
      name: name || "app",
      level: config.logging.level,
      // Use pretty printing in development for better readability
      transport: isDevelopment
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss.l",
              ignore: "pid,hostname",
              singleLine: false,
            },
          }
        : undefined,
      // In production, use JSON output for structured logging
      formatters: {
        level: (label) => {
          return { level: label };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  debug(message: string, context?: object): void {
    if (context) {
      this.logger.debug(context, message);
    } else {
      this.logger.debug(message);
    }
  }

  info(message: string, context?: object): void {
    if (context) {
      this.logger.info(context, message);
    } else {
      this.logger.info(message);
    }
  }

  warn(message: string, context?: object): void {
    if (context) {
      this.logger.warn(context, message);
    } else {
      this.logger.warn(message);
    }
  }

  error(message: string, context?: object): void {
    if (context) {
      this.logger.error(context, message);
    } else {
      this.logger.error(message);
    }
  }

  fatal(message: string, context?: object): void {
    if (context) {
      this.logger.fatal(context, message);
    } else {
      this.logger.fatal(message);
    }
  }

  child(context: object): ILogger {
    const childLogger = new PinoLogger();
    childLogger.logger = this.logger.child(context);
    return childLogger;
  }
}
