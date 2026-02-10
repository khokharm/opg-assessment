/**
 * Logger module exports
 * 
 * Usage:
 * import { createLogger } from './logger';
 * const logger = createLogger('ServiceName');
 * logger.info('Message', { context });
 */

export { ILogger } from './ILogger';
export { LoggerFactory, createLogger } from './LoggerFactory';
export { PinoLogger } from './PinoLogger';
export {
  logRegistration,
  logLogin,
  logLogout,
  logCityAdded,
  logCityRemoved,
  logAuthFailure,
} from './auditLogger';
