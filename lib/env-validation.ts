import { z } from 'zod';

/**
 * Environment Variable Validation
 * Validates all environment variables on application startup
 * Prevents runtime errors from misconfigured or missing variables
 */

// Define the schema for all environment variables
const envSchema = z.object({
  // Public variables (exposed to browser)
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('ACE Role Screening Portal'),
  NEXT_PUBLIC_MAX_FILE_SIZE: z.coerce.number().min(1024).max(10485760).default(5242880), // 1KB - 10MB
  NEXT_PUBLIC_ALLOWED_FILE_TYPES: z.string().default('.pdf,.doc,.docx'),

  // Server-side variables
  DATA_DIR: z.string().optional(),
  APPLICATIONS_DIR: z.string().optional(),
  RESUMES_DIR: z.string().optional(),
  LOGS_DIR: z.string().optional(),

  // Rate limiting
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).max(1000).default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).max(3600000).default(600000), // 1s - 1hr

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Production/GCCH variables (optional)
  AZURE_KEY_VAULT_URL: z.string().url().optional(),
  AZURE_TENANT_ID: z.string().uuid().optional(),
  AZURE_CLIENT_ID: z.string().uuid().optional(),
  AZURE_CLIENT_SECRET: z.string().optional(),
  AZURE_LOG_ANALYTICS_WORKSPACE_ID: z.string().uuid().optional(),
  AZURE_LOG_ANALYTICS_SHARED_KEY: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
  TRUSTED_PROXIES: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Returns validated env object or throws error
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n  ');
      
      console.error('❌ Environment variable validation failed:');
      console.error(`  ${errorMessage}`);
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Invalid environment configuration:\n  ${errorMessage}`);
      }
    }
    throw error;
  }
}

/**
 * Get a validated environment variable
 * Use this instead of process.env for type safety
 */
export function getEnv(key: keyof Env): string | number | undefined {
  const env = validateEnv();
  return env[key];
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if GCCH features should be enabled
 */
export function isGCCHEnabled(): boolean {
  return !!(
    process.env.AZURE_KEY_VAULT_URL ||
    process.env.AZURE_LOG_ANALYTICS_WORKSPACE_ID
  );
}

// Validate on module load (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnv();
    console.log('✓ Environment variables validated successfully');
  } catch (error) {
    console.error('Environment validation failed during module load');
  }
}
