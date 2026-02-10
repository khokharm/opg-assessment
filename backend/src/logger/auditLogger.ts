import { createLogger } from "./LoggerFactory";

const auditLogger = createLogger("Audit");

/**
 * Audit logging for security-sensitive operations.
 * These logs should be monitored and retained for compliance purposes.
 */

interface AuditContext {
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

/**
 * Log user registration
 */
export function logRegistration(
  email: string,
  userId: string,
  success: boolean,
  context?: AuditContext
): void {
  auditLogger.info("User registration", {
    action: "REGISTER",
    email,
    userId,
    success,
    ...context,
  });
}

/**
 * Log user login attempt
 */
export function logLogin(
  email: string,
  success: boolean,
  userId?: string,
  context?: AuditContext
): void {
  const level = success ? "info" : "warn";
  auditLogger[level]("User login", {
    action: "LOGIN",
    email,
    userId,
    success,
    ...context,
  });
}

/**
 * Log user logout
 */
export function logLogout(
  userId: string,
  context?: AuditContext
): void {
  auditLogger.info("User logout", {
    action: "LOGOUT",
    userId,
    ...context,
  });
}

/**
 * Log city added to user's tracked list
 */
export function logCityAdded(
  userId: string,
  cityName: string,
  cityId: string,
  context?: AuditContext
): void {
  auditLogger.info("City added", {
    action: "CITY_ADDED",
    userId,
    cityName,
    cityId,
    ...context,
  });
}

/**
 * Log city removed from user's tracked list
 */
export function logCityRemoved(
  userId: string,
  cityId: string,
  context?: AuditContext
): void {
  auditLogger.info("City removed", {
    action: "CITY_REMOVED",
    userId,
    cityId,
    ...context,
  });
}

/**
 * Log authentication failure
 */
export function logAuthFailure(
  reason: string,
  context?: AuditContext
): void {
  auditLogger.warn("Authentication failure", {
    action: "AUTH_FAILURE",
    reason,
    ...context,
  });
}
