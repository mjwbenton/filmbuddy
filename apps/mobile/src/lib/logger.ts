/* eslint-disable no-console */

const isDev = __DEV__;

export const logger = {
  error: (message: string, error?: unknown) => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error);
    }
  },
  warn: (message: string, data?: unknown) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data);
    }
  },
};
