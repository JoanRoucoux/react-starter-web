import { LogLevel } from '@core/logger/log-level';

import { environment } from '@environments/environment';

const trace = (level: LogLevel, context = '', ...args: unknown[]): void => {
  if (environment.production && level === LogLevel.DEBUG) {
    return;
  }

  const consoleMethod = (console as Record<LogLevel, (...args: unknown[]) => void>)[level];
  const timestamp = new Date().toISOString();
  const ctx = context ? `[${context}]` : '';

  consoleMethod(`[${timestamp}][${level.toUpperCase()}]${ctx} `, ...args);
};

export const logger = {
  debug: (context = '', ...args: unknown[]): void => trace(LogLevel.DEBUG, context, ...args),
  log: (context = '', ...args: unknown[]): void => trace(LogLevel.LOG, context, ...args),
  info: (context = '', ...args: unknown[]): void => trace(LogLevel.INFO, context, ...args),
  warn: (context = '', ...args: unknown[]): void => trace(LogLevel.WARN, context, ...args),
  error: (context = '', ...args: unknown[]): void => trace(LogLevel.ERROR, context, ...args),
};
