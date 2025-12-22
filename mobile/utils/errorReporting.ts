import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';

export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

/**
 * Initialize the error reporting service.
 * Call this function as early as possible in your app entry point.
 */
export const initErrorReporting = () => {
  // Replace with your actual DSN
  const dsn = process.env.SENTRY_DSN || '';

  if (!dsn) {
    console.warn('Sentry DSN is not set. Error reporting will not work.');
  }

  Sentry.init({
    dsn: dsn,
    debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    enableInExpoDevelopment: true,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.ReactNativeTracing({
        // Pass instrumentation to be used for automatic routing monitoring
        routingInstrumentation,
        enableNativeFramesTracking: !Platform.OS || Platform.OS !== 'web',
      }),
    ],
  });
};

/**
 * Log an error to the error reporting service.
 * @param error The error object
 * @param context Additional context to log with the error
 */
export const logError = (error: Error, context?: Record<string, any>) => {
  if (__DEV__) {
    console.error('Logged Error:', error);
    if (context) {
      console.log('Error Context:', context);
    }
  }

  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Log a message to the error reporting service.
 * @param message The message string
 * @param level The severity level (info, warning, error)
 */
export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (__DEV__) {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }

  Sentry.captureMessage(message, level);
};

export default {
  init: initErrorReporting,
  logError,
  logMessage,
};
