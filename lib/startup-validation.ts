/**
 * Startup Validation
 *
 * Validates environment variables and configuration on application startup.
 * Import and call this at the beginning of your application.
 */

import { validateEnv } from './env-validation';

let hasValidated = false;

/**
 * Perform all startup validations
 * This should be called once when the application starts
 */
export function performStartupValidation(): void {
  // Only validate once to avoid redundant checks
  if (hasValidated) {
    return;
  }

  try {
    // Validate environment variables
    validateEnv();

    // Mark as validated
    hasValidated = true;

    if (process.env.NODE_ENV === 'development') {
      console.log('Startup validation completed successfully');
    }
  } catch (error) {
    console.error('Startup validation failed:', error);
    // In production, you might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Reset validation state (useful for testing)
 */
export function resetValidation(): void {
  hasValidated = false;
}
