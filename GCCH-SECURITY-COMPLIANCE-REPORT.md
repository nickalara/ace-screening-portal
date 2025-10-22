# GCCH Security Standards & Compliance Requirements Report

**Application:** ACE Role Screening Portal (Next.js Application)
**Date:** 2025-10-21
**Focus:** PII/CUI Handling, File Uploads, Job Applications

---

## Executive Summary

This report provides a comprehensive analysis of Government Community Cloud High (GCCH/GCC High) security standards and compliance requirements for a Next.js web application handling Personally Identifiable Information (PII) and Controlled Unclassified Information (CUI). The application processes job applications with personal information and file uploads, requiring strict adherence to federal security standards.

### Key Compliance Frameworks for GCCH

1. **FedRAMP High** - Federal Risk and Authorization Management Program at High Impact Level
2. **NIST SP 800-171 Rev. 3** - Protecting Controlled Unclassified Information
3. **NIST SP 800-53 Rev. 5** - Security and Privacy Controls
4. **CMMC 2.0 Level 2** - Cybersecurity Maturity Model Certification (110 controls, 320 objectives)
5. **DFARS 252.204-7012** - Safeguarding Covered Defense Information and Cyber Incident Reporting
6. **ITAR** - International Traffic in Arms Regulations
7. **FIPS 140-2/140-3** - Cryptographic Module Validation

---

## 1. Authentication and Authorization Requirements

### Priority: **CRITICAL**

#### GCCH Requirements

- **Multi-Factor Authentication (MFA)** - Mandatory for all users accessing CUI/PII
- **Role-Based Access Control (RBAC)** - Limit access based on user roles
- **Clearance-Based Access** - Only U.S. citizens with appropriate clearances for GCCH environments
- **Identity Proofing** - NIST SP 800-63 compliance for identity verification

#### Current Application Status

✅ **Implemented:**
- None currently - application is public-facing

❌ **Missing:**
- User authentication system
- MFA implementation
- RBAC for admin/reviewer access
- Session management

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.5.1** - Identify system users, processes acting on behalf of users, and devices
- **3.5.2** - Authenticate (or verify) the identities of users, processes, or devices
- **3.5.3** - Use multifactor authentication for local and network access to privileged accounts

**NIST 800-53 Controls:**
- **IA-2: Identification and Authentication** - System uniquely identifies and authenticates organizational users
- **IA-2(1): Multi-Factor Authentication** - Implement MFA for network access to privileged accounts
- **IA-2(2): Multi-Factor Authentication** - Implement MFA for network access to non-privileged accounts
- **AC-2: Account Management** - Manage system accounts including creation, modification, and deletion

#### Recommended Implementation

```typescript
// 1. Install authentication library
// npm install next-auth @auth/core

// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          // Use Azure AD GCCH endpoints
          scope: "openid profile email User.Read",
        },
      },
      // GCCH-specific endpoints
      wellKnown: `https://login.microsoftonline.us/${process.env.AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours max session (NIST recommendation)
  },
  callbacks: {
    async signIn({ user, account }) {
      // Log all sign-in attempts for audit trail
      await logger.authenticationAttempt(user.email, "success");
      return true;
    },
    async session({ session, token }) {
      // Add custom claims for RBAC
      session.user.role = token.role;
      session.user.clearanceLevel = token.clearanceLevel;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Log sign-out events
      await logger.authenticationEvent(token.email, "signout");
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

```typescript
// middleware.ts - Protect routes
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Additional authorization checks
    const token = req.nextauth.token;

    // Admin routes require specific role
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (token?.role !== "admin" && token?.role !== "reviewer") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/applications/:path*"],
};
```

---

## 2. Data Encryption Requirements

### Priority: **CRITICAL**

#### GCCH Requirements

- **FIPS 140-2/140-3 Validated Cryptography** - All encryption modules must be FIPS validated
- **Encryption at Rest** - All PII/CUI must be encrypted when stored
- **Encryption in Transit** - TLS 1.2+ with FIPS-compliant cipher suites
- **Key Management** - Secure key storage and rotation

#### Current Application Status

✅ **Implemented:**
- TLS 1.2+ via HSTS header configuration
- Basic security headers

❌ **Missing:**
- FIPS 140-2 validated encryption for stored files
- Encryption at rest for resume files
- Encrypted database/storage for application data
- Customer-managed encryption keys (CMEK)
- Key rotation policy

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.13.8** - Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission
- **3.13.11** - Employ FIPS-validated cryptography when used to protect the confidentiality of CUI
- **3.13.16** - Protect the confidentiality of CUI at rest

**NIST 800-53 Controls:**
- **SC-8: Transmission Confidentiality and Integrity** - Protect transmitted information
- **SC-8(1): Cryptographic Protection** - Implement cryptographic mechanisms
- **SC-13: Cryptographic Protection** - Use FIPS-validated cryptography
- **SC-28: Protection of Information at Rest** - Protect the confidentiality and integrity of information at rest
- **SC-28(1): Cryptographic Protection** - Implement cryptographic mechanisms to prevent unauthorized disclosure

#### Recommended Implementation

```typescript
// lib/encryption.ts - FIPS 140-2 compliant encryption
import crypto from 'crypto';

// Use FIPS-approved algorithms
const ALGORITHM = 'aes-256-gcm'; // FIPS approved
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits for GCM
const AUTH_TAG_LENGTH = 16;

interface EncryptionConfig {
  masterKey: Buffer;
  keyDerivationSalt: Buffer;
}

export class FIPSEncryption {
  private config: EncryptionConfig;

  constructor() {
    // In production, retrieve from Azure Key Vault (GCCH)
    const masterKeyHex = process.env.MASTER_ENCRYPTION_KEY!;
    const saltHex = process.env.KEY_DERIVATION_SALT!;

    this.config = {
      masterKey: Buffer.from(masterKeyHex, 'hex'),
      keyDerivationSalt: Buffer.from(saltHex, 'hex'),
    };
  }

  /**
   * Encrypt data using FIPS 140-2 validated algorithm (AES-256-GCM)
   */
  encrypt(data: Buffer): {
    encrypted: Buffer;
    iv: Buffer;
    authTag: Buffer;
  } {
    // Generate random IV for each encryption operation
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derive encryption key using PBKDF2 (FIPS approved)
    const key = crypto.pbkdf2Sync(
      this.config.masterKey,
      this.config.keyDerivationSalt,
      100000, // Iterations (NIST recommends minimum 10,000)
      KEY_LENGTH,
      'sha256' // FIPS approved hash
    );

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt data
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final(),
    ]);

    // Get authentication tag (for integrity verification)
    const authTag = cipher.getAuthTag();

    return { encrypted, iv, authTag };
  }

  /**
   * Decrypt data
   */
  decrypt(encrypted: Buffer, iv: Buffer, authTag: Buffer): Buffer {
    // Derive decryption key
    const key = crypto.pbkdf2Sync(
      this.config.masterKey,
      this.config.keyDerivationSalt,
      100000,
      KEY_LENGTH,
      'sha256'
    );

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    // Decrypt data
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted;
  }
}

// Example usage for encrypting resume files
export async function saveEncryptedResume(
  applicationId: string,
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<{ storedFilename: string; fileSize: number }> {
  const encryption = new FIPSEncryption();

  // Encrypt the file
  const { encrypted, iv, authTag } = encryption.encrypt(fileBuffer);

  // Store encryption metadata with the file
  const metadata = {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    originalFilename,
    mimeType,
    encryptionAlgorithm: 'AES-256-GCM',
    fipsCompliant: true,
  };

  // In production, store in Azure Blob Storage (GCCH) with server-side encryption
  const storedFilename = `${applicationId}_resume_encrypted`;

  // Store encrypted file and metadata
  await fs.writeFile(
    path.join(RESUME_STORAGE_PATH, storedFilename),
    encrypted
  );
  await fs.writeFile(
    path.join(RESUME_STORAGE_PATH, `${storedFilename}.meta.json`),
    JSON.stringify(metadata, null, 2)
  );

  return {
    storedFilename,
    fileSize: encrypted.length,
  };
}
```

```javascript
// next.config.js - Enhanced TLS/SSL configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // HSTS with preload for FIPS compliance
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload', // 2 years (NIST recommended)
          },
          // Additional security headers...
        ],
      },
    ];
  },

  // In production, configure Node.js to use FIPS mode
  experimental: {
    serverActions: true,
  },
};

// For FIPS mode, set environment variable:
// OPENSSL_FIPS=1 or NODE_OPTIONS=--enable-fips
```

```bash
# Enable FIPS mode in production (for GCCH compliance)
export OPENSSL_FIPS=1
export NODE_OPTIONS="--enable-fips"

# Verify FIPS mode is enabled
node -p "crypto.getFips()"  # Should return 1
```

---

## 3. API Security and Key Management

### Priority: **CRITICAL**

#### GCCH Requirements

- **API Key Security** - Never hard-code keys; use secure vaults
- **Customer-Managed Encryption Keys (CMEK)** - Support for BYOK (Bring Your Own Key)
- **Key Rotation** - Regular automated key rotation
- **Secure Key Storage** - Azure Key Vault (GCCH) or equivalent FIPS 140-2 HSM

#### Current Application Status

✅ **Implemented:**
- Environment variables for configuration

❌ **Missing:**
- Integration with Azure Key Vault (GCCH)
- API key management system
- Key rotation policy
- Hardware Security Module (HSM) integration

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.13.10** - Establish and manage cryptographic keys for cryptography employed in organizational systems
- **3.14.1** - Identify, report, and correct information system flaws in a timely manner

**NIST 800-53 Controls:**
- **SC-12: Cryptographic Key Establishment and Management**
- **SC-12(1): Availability**
- **SC-12(2): Symmetric Keys**
- **SC-12(3): Asymmetric Keys**

#### Recommended Implementation

```typescript
// lib/key-vault.ts - Azure Key Vault integration for GCCH
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

export class GCCHKeyVault {
  private client: SecretClient;

  constructor() {
    // Use GCCH-specific Key Vault endpoint
    const keyVaultUrl = process.env.AZURE_KEYVAULT_URL!; // e.g., https://<vault-name>.vault.usgovcloudapi.net/

    // Use managed identity for authentication in production
    const credential = new DefaultAzureCredential({
      authorityHost: "https://login.microsoftonline.us", // GCCH endpoint
    });

    this.client = new SecretClient(keyVaultUrl, credential);
  }

  /**
   * Retrieve encryption key from Key Vault
   */
  async getEncryptionKey(keyName: string): Promise<string> {
    try {
      const secret = await this.client.getSecret(keyName);

      // Log key access for audit trail
      await logger.keyAccessed(keyName, "retrieval");

      return secret.value!;
    } catch (error) {
      await logger.error("key_vault_error", { keyName, error });
      throw new Error("Failed to retrieve encryption key from Key Vault");
    }
  }

  /**
   * Store new encryption key
   */
  async setEncryptionKey(keyName: string, value: string): Promise<void> {
    try {
      await this.client.setSecret(keyName, value, {
        contentType: "application/octet-stream",
        tags: {
          purpose: "encryption",
          fipsCompliant: "true",
          rotationDate: new Date().toISOString(),
        },
      });

      await logger.keyAccessed(keyName, "creation");
    } catch (error) {
      await logger.error("key_vault_error", { keyName, error });
      throw error;
    }
  }

  /**
   * Rotate encryption key (GCCH requirement)
   */
  async rotateKey(keyName: string): Promise<void> {
    // Generate new FIPS-compliant key
    const newKey = crypto.randomBytes(32).toString('hex');

    // Store with version tracking
    const versionedKeyName = `${keyName}-v${Date.now()}`;
    await this.setEncryptionKey(versionedKeyName, newKey);

    await logger.keyAccessed(keyName, "rotation");
  }
}

// Usage in application
const keyVault = new GCCHKeyVault();
const masterKey = await keyVault.getEncryptionKey("master-encryption-key");
```

```typescript
// lib/api-security.ts - API key management
import { randomBytes, createHash } from 'crypto';

export class APIKeyManager {
  /**
   * Generate secure API key for internal services
   */
  static generateAPIKey(): string {
    // Generate 256-bit random key
    const key = randomBytes(32).toString('base64url');
    return `ace_${key}`;
  }

  /**
   * Hash API key for storage (never store plaintext)
   */
  static hashAPIKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Validate API key against stored hash
   */
  static validateAPIKey(providedKey: string, storedHash: string): boolean {
    const providedHash = this.hashAPIKey(providedKey);

    // Use timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(providedHash),
      Buffer.from(storedHash)
    );
  }
}

// Middleware for API authentication
export async function authenticateAPI(request: NextRequest): Promise<boolean> {
  const apiKey = request.headers.get('X-API-Key');

  if (!apiKey) {
    await logger.warn('api_auth_failed', { reason: 'missing_api_key' });
    return false;
  }

  // Retrieve stored hash from secure storage
  const storedHash = await getStoredAPIKeyHash(apiKey.split('_')[0]);

  if (!storedHash) {
    await logger.warn('api_auth_failed', { reason: 'invalid_api_key' });
    return false;
  }

  const isValid = APIKeyManager.validateAPIKey(apiKey, storedHash);

  if (!isValid) {
    await logger.warn('api_auth_failed', { reason: 'key_mismatch' });
  }

  return isValid;
}
```

---

## 4. Audit Logging Requirements

### Priority: **CRITICAL**

#### GCCH Requirements

- **Comprehensive Event Logging** - All security-relevant events must be logged
- **Tamper-Proof Logs** - Logs must be protected from modification
- **Log Retention** - Minimum 1 year retention (often 3-7 years for government)
- **Centralized Logging** - Forward logs to SIEM system
- **Real-time Monitoring** - Automated alerts for security events

#### Current Application Status

✅ **Implemented:**
- Basic logging for application events
- IP address logging
- File upload logging

⚠️ **Partial:**
- Audit trail exists but needs enhancement
- Missing tamper-proof storage
- No SIEM integration
- Limited log retention policy

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.3.1** - Create and retain system audit logs and records
- **3.3.2** - Ensure actions can be traced to individual users
- **3.3.3** - Review and update logged events
- **3.3.4** - Alert in the event of an audit logging process failure
- **3.3.5** - Correlate audit record review, analysis, and reporting processes
- **3.3.6** - Provide audit record reduction and report generation
- **3.3.7** - Provide a system capability that compares and synchronizes internal system clocks
- **3.3.8** - Protect audit information and audit logging tools from unauthorized access
- **3.3.9** - Limit management of audit logging functionality to a subset of privileged users

**NIST 800-53 Controls:**
- **AU-2: Event Logging** - System generates audit records for defined events
- **AU-3: Content of Audit Records** - Ensure audit records contain adequate information
- **AU-4: Audit Log Storage Capacity** - Allocate sufficient storage capacity
- **AU-6: Audit Record Review, Analysis, and Reporting** - Review and analyze logs
- **AU-7: Audit Record Reduction and Report Generation**
- **AU-8: Time Stamps** - Use internal system clocks for timestamps
- **AU-9: Protection of Audit Information** - Protect audit information from unauthorized access
- **AU-11: Audit Record Retention** - Retain audit records for defined period
- **AU-12: Audit Record Generation** - Provide audit record generation capability

#### Events That Must Be Logged

Per NIST SP 800-53 AU-2, the following events require logging:

1. **Authentication Events**
   - Successful and failed login attempts
   - Logout events
   - Password changes
   - MFA enrollment/changes

2. **Authorization Events**
   - Access denials
   - Privilege escalation
   - Role changes

3. **Data Access Events**
   - PII/CUI access
   - Application data retrieval
   - File downloads

4. **Data Modification Events**
   - Application submissions
   - File uploads
   - Record updates/deletions

5. **Security Events**
   - Rate limit exceeded
   - Input validation failures
   - Encryption/decryption operations
   - API key usage

6. **System Events**
   - Service starts/stops
   - Configuration changes
   - Error conditions

#### Recommended Implementation

```typescript
// lib/audit-logger.ts - Enhanced GCCH-compliant audit logging
import crypto from 'crypto';
import { appendFile, readFile } from 'fs/promises';
import path from 'path';

interface AuditEvent {
  timestamp: string;
  eventType: string;
  eventCategory: 'AUTHENTICATION' | 'AUTHORIZATION' | 'DATA_ACCESS' | 'DATA_MODIFICATION' | 'SECURITY' | 'SYSTEM';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  userId?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent?: string;
  action: string;
  resource?: string;
  outcome: 'SUCCESS' | 'FAILURE';
  details: Record<string, any>;
  hash?: string; // For tamper detection
}

export class AuditLogger {
  private logPath: string;
  private previousHash: string = '';

  constructor() {
    this.logPath = process.env.AUDIT_LOG_PATH || '/var/log/ace-portal/audit.log';
  }

  /**
   * Create tamper-proof audit log entry
   */
  async logEvent(event: Omit<AuditEvent, 'timestamp' | 'hash'>): Promise<void> {
    // Add precise timestamp with timezone
    const timestamp = new Date().toISOString();

    // Create event with timestamp
    const eventWithTimestamp = {
      ...event,
      timestamp,
    };

    // Generate hash for tamper detection (chain hashing)
    const eventString = JSON.stringify(eventWithTimestamp) + this.previousHash;
    const hash = crypto.createHash('sha256').update(eventString).digest('hex');

    const auditEvent: AuditEvent = {
      ...eventWithTimestamp,
      hash,
    };

    // Update previous hash for next entry
    this.previousHash = hash;

    // Write to audit log (append-only)
    const logEntry = JSON.stringify(auditEvent) + '\n';

    try {
      await appendFile(this.logPath, logEntry, { mode: 0o440 }); // Read-only after creation

      // Also send to SIEM/centralized logging
      await this.sendToSIEM(auditEvent);
    } catch (error) {
      // Critical: Audit logging failure
      console.error('[AUDIT LOG FAILURE]', error);
      // Alert security team
      await this.alertSecurityTeam('AUDIT_LOG_FAILURE', error);
    }
  }

  /**
   * Log authentication events
   */
  async logAuthentication(
    userId: string,
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'MFA_ENROLLED',
    ipAddress: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      eventType: action,
      eventCategory: 'AUTHENTICATION',
      severity: action === 'LOGIN_FAILED' ? 'WARNING' : 'INFO',
      userId,
      ipAddress,
      action,
      outcome: action.includes('FAILED') ? 'FAILURE' : 'SUCCESS',
      details: details || {},
    });
  }

  /**
   * Log data access to PII/CUI
   */
  async logDataAccess(
    userId: string,
    resource: string,
    action: 'VIEW' | 'DOWNLOAD' | 'EXPORT',
    ipAddress: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      eventType: 'DATA_ACCESS',
      eventCategory: 'DATA_ACCESS',
      severity: 'INFO',
      userId,
      ipAddress,
      action,
      resource,
      outcome: 'SUCCESS',
      details: {
        ...details,
        containsPII: true,
        containsCUI: true,
      },
    });
  }

  /**
   * Log security violations
   */
  async logSecurityViolation(
    eventType: string,
    ipAddress: string,
    details: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      eventType,
      eventCategory: 'SECURITY',
      severity: 'CRITICAL',
      ipAddress,
      action: 'SECURITY_VIOLATION',
      outcome: 'FAILURE',
      details,
    });

    // Immediate alert for security violations
    await this.alertSecurityTeam(eventType, details);
  }

  /**
   * Send audit logs to SIEM system
   */
  private async sendToSIEM(event: AuditEvent): Promise<void> {
    // Integrate with Azure Sentinel (GCCH), Splunk, or other SIEM
    const siemEndpoint = process.env.SIEM_ENDPOINT;

    if (siemEndpoint) {
      try {
        await fetch(siemEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SIEM_API_KEY}`,
          },
          body: JSON.stringify(event),
        });
      } catch (error) {
        console.error('[SIEM FORWARD FAILURE]', error);
      }
    }
  }

  /**
   * Alert security team of critical events
   */
  private async alertSecurityTeam(eventType: string, details: any): Promise<void> {
    // Implement notification via email, SMS, or incident response platform
    console.error(`[SECURITY ALERT] ${eventType}`, details);

    // In production: Send to incident response system
    // await notificationService.sendSecurityAlert(eventType, details);
  }

  /**
   * Verify log integrity (detect tampering)
   */
  async verifyLogIntegrity(): Promise<boolean> {
    const logContent = await readFile(this.logPath, 'utf-8');
    const lines = logContent.trim().split('\n');

    let previousHash = '';

    for (const line of lines) {
      const event: AuditEvent = JSON.parse(line);

      // Recalculate hash
      const eventWithoutHash = { ...event };
      delete eventWithoutHash.hash;

      const eventString = JSON.stringify(eventWithoutHash) + previousHash;
      const calculatedHash = crypto.createHash('sha256').update(eventString).digest('hex');

      if (calculatedHash !== event.hash) {
        await this.logSecurityViolation('LOG_TAMPERING_DETECTED', 'system', {
          line,
          expectedHash: calculatedHash,
          actualHash: event.hash,
        });
        return false;
      }

      previousHash = event.hash!;
    }

    return true;
  }
}

// Usage in API routes
export const auditLogger = new AuditLogger();
```

```typescript
// Update app/api/submit-application/route.ts
export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  const sessionId = request.cookies.get('session_id')?.value;

  // Log the API request
  await auditLogger.logEvent({
    eventType: 'APPLICATION_SUBMISSION_ATTEMPT',
    eventCategory: 'DATA_MODIFICATION',
    severity: 'INFO',
    ipAddress: clientIP,
    sessionId,
    action: 'SUBMIT_APPLICATION',
    outcome: 'SUCCESS', // Will update if fails
    details: {
      endpoint: '/api/submit-application',
      method: 'POST',
    },
  });

  try {
    // ... existing code ...

    // Log successful submission with PII access
    await auditLogger.logDataAccess(
      data.email, // userId (no auth yet, using email)
      `application/${applicationId}`,
      'VIEW',
      clientIP,
      {
        fullName: data.fullName,
        hasResume: true,
        resumeSize: fileSize,
      }
    );

    return NextResponse.json({ success: true, applicationId });
  } catch (error) {
    // Log failure
    await auditLogger.logEvent({
      eventType: 'APPLICATION_SUBMISSION_FAILED',
      eventCategory: 'DATA_MODIFICATION',
      severity: 'ERROR',
      ipAddress: clientIP,
      sessionId,
      action: 'SUBMIT_APPLICATION',
      outcome: 'FAILURE',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
}
```

---

## 5. Network Security Requirements

### Priority: **HIGH**

#### GCCH Requirements

- **Data Residency** - All data must remain within continental United States
- **Network Segmentation** - Isolate CUI/PII processing systems
- **Boundary Protection** - Firewalls, IDS/IPS at system boundaries
- **Deny by Default** - Allow-list approach for network connections
- **VPN/Private Links** - Secure connections for administrative access

#### Current Application Status

✅ **Implemented:**
- HTTPS enforcement via HSTS
- Basic CORS configuration

❌ **Missing:**
- Network segmentation
- Web Application Firewall (WAF)
- DDoS protection
- Geographic restrictions
- VPN requirements for admin access

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.13.1** - Monitor, control, and protect communications at external boundaries
- **3.13.2** - Employ architectural designs, software development techniques, and systems engineering
- **3.13.3** - Separate user functionality from system management functionality
- **3.13.5** - Implement subnetworks for publicly accessible system components

**NIST 800-53 Controls:**
- **SC-7: Boundary Protection** - Monitor and control communications at system boundaries
- **SC-7(3): Access Points** - Limit the number of external network connections
- **SC-7(4): External Telecommunications Services** - Implement managed interfaces
- **SC-7(5): Deny by Default / Allow by Exception** - Default deny-all, allow-by-exception policy

#### Recommended Implementation

```javascript
// next.config.js - Enhanced network security
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Existing headers...

          // CORS - Strict origin policy for GCCH
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || 'https://ace-portal.gov', // GCCH domain
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-CSRF-Token',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 hours
          },
        ],
      },
    ];
  },

  // Geographic restrictions (if needed)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-geo-country',
            value: '(?!US).*', // Block non-US traffic
          },
        ],
        destination: '/geo-restricted',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
```

```typescript
// middleware.ts - Network security middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed IP ranges for admin access (example: VPN endpoints)
const ADMIN_IP_WHITELIST = process.env.ADMIN_IP_WHITELIST?.split(',') || [];

// Allowed geographic regions
const ALLOWED_COUNTRIES = ['US']; // GCCH requirement

export function middleware(request: NextRequest) {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
  const geoCountry = request.headers.get('x-geo-country');
  const pathname = request.nextUrl.pathname;

  // Geographic restriction (GCCH requirement - US only)
  if (geoCountry && !ALLOWED_COUNTRIES.includes(geoCountry)) {
    return NextResponse.json(
      {
        error: 'Access denied',
        message: 'This service is only available to users in the United States',
      },
      { status: 403 }
    );
  }

  // Admin routes require VPN/whitelisted IP
  if (pathname.startsWith('/admin')) {
    const isWhitelisted = ADMIN_IP_WHITELIST.some(allowed =>
      clientIP?.startsWith(allowed)
    );

    if (!isWhitelisted) {
      return NextResponse.json(
        {
          error: 'Access denied',
          message: 'Admin access requires connection from authorized network',
        },
        { status: 403 }
      );
    }
  }

  // Add security headers to response
  const response = NextResponse.next();

  // Prevent DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  // Disable client-side caching for sensitive data
  if (pathname.includes('/api/') || pathname.includes('/admin/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

```yaml
# Example: Azure WAF Configuration for GCCH
# This would be configured in Azure Portal or via ARM template

wafConfiguration:
  enabled: true
  firewallMode: Prevention
  ruleSetType: OWASP
  ruleSetVersion: "3.2"

  customRules:
    - name: RateLimitRule
      priority: 1
      ruleType: RateLimitRule
      rateLimitThreshold: 100
      rateLimitDuration: PT1M

    - name: GeoLocationRule
      priority: 2
      ruleType: MatchRule
      matchConditions:
        - matchVariable: RemoteAddr
          operator: GeoMatch
          negationCondition: true
          matchValue:
            - US
      action: Block

  managedRules:
    - ruleGroupName: SQLI
      action: Block
    - ruleGroupName: XSS
      action: Block
    - ruleGroupName: LFI
      action: Block
    - ruleGroupName: RFI
      action: Block
```

---

## 6. File Upload Security Requirements

### Priority: **CRITICAL**

#### GCCH Requirements

- **File Type Validation** - Whitelist approach for allowed file types
- **Content Inspection** - Verify file contents match declared type
- **Malware Scanning** - All uploads must be scanned for malware
- **Size Limits** - Enforce maximum file sizes
- **Secure Storage** - Encrypted storage with access controls
- **Virus Scanning** - Integration with antivirus solutions

#### Current Application Status

✅ **Implemented:**
- Basic file type checking
- File size validation
- Unique filename generation

❌ **Missing:**
- Content-based file validation (magic bytes)
- Antivirus/malware scanning
- File sanitization
- Comprehensive file type whitelist
- Executable detection and blocking

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.14.2** - Provide protection from malicious code at designated locations
- **3.14.3** - Monitor information system security alerts and advisories and take action
- **3.14.6** - Monitor organizational systems, including inbound and outbound communications traffic
- **3.14.7** - Identify unauthorized use of organizational systems

**NIST 800-53 Controls:**
- **SI-3: Malicious Code Protection** - Implement malicious code protection mechanisms
- **SI-3(2): Automatic Updates** - Automatically update malicious code protection mechanisms
- **SI-10: Information Input Validation** - Check the validity of information inputs

#### Recommended Implementation

```typescript
// lib/file-validation.ts - Comprehensive file upload security
import { readFile } from 'fs/promises';
import crypto from 'crypto';

// Whitelist of allowed MIME types (deny-by-default approach)
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain',
] as const;

// File type magic bytes (for content validation)
const FILE_SIGNATURES: Record<string, Buffer[]> = {
  'application/pdf': [Buffer.from([0x25, 0x50, 0x44, 0x46])], // %PDF
  'application/msword': [Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])], // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    Buffer.from([0x50, 0x4B, 0x03, 0x04]), // PK (ZIP format)
  ],
  'text/plain': [], // Text files have no specific signature
};

// Dangerous file extensions (always block)
const BLOCKED_EXTENSIONS = [
  '.exe', '.dll', '.bat', '.cmd', '.com', '.scr', '.vbs', '.js', '.jar',
  '.ps1', '.sh', '.app', '.deb', '.rpm', '.msi', '.dmg', '.pkg',
];

// Maximum file size (10MB for resumes)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  hash?: string;
}

export class FileValidator {
  /**
   * Comprehensive file validation for GCCH compliance
   */
  static async validateFile(
    buffer: Buffer,
    originalFilename: string,
    declaredMimeType: string
  ): Promise<FileValidationResult> {
    // 1. Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    if (buffer.length === 0) {
      return {
        valid: false,
        error: 'File is empty',
      };
    }

    // 2. Validate file extension (whitelist approach)
    const fileExt = this.getFileExtension(originalFilename);

    if (BLOCKED_EXTENSIONS.includes(fileExt.toLowerCase())) {
      return {
        valid: false,
        error: 'File type not allowed for security reasons',
      };
    }

    // 3. Validate MIME type (whitelist)
    if (!ALLOWED_MIME_TYPES.includes(declaredMimeType as any)) {
      return {
        valid: false,
        error: `File type ${declaredMimeType} is not allowed. Allowed types: PDF, DOC, DOCX, TXT`,
      };
    }

    // 4. Validate file content matches declared type (magic bytes)
    const contentValid = await this.validateFileContent(buffer, declaredMimeType);
    if (!contentValid) {
      return {
        valid: false,
        error: 'File content does not match declared file type (potential spoofing attempt)',
      };
    }

    // 5. Scan for malicious content
    const malwareScanResult = await this.scanForMalware(buffer, originalFilename);
    if (!malwareScanResult.clean) {
      return {
        valid: false,
        error: 'File failed security scan',
      };
    }

    // 6. Generate sanitized filename
    const sanitizedFilename = this.sanitizeFilename(originalFilename);

    // 7. Generate file hash for integrity verification
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    return {
      valid: true,
      sanitizedFilename,
      hash,
    };
  }

  /**
   * Validate file content using magic bytes
   */
  private static async validateFileContent(
    buffer: Buffer,
    mimeType: string
  ): Promise<boolean> {
    const signatures = FILE_SIGNATURES[mimeType];

    if (!signatures || signatures.length === 0) {
      // For text files or types without signatures, perform basic validation
      return true;
    }

    // Check if file starts with any of the valid signatures
    return signatures.some(signature => {
      return buffer.slice(0, signature.length).equals(signature);
    });
  }

  /**
   * Scan file for malware (integrate with ClamAV or Microsoft Defender)
   */
  private static async scanForMalware(
    buffer: Buffer,
    filename: string
  ): Promise<{ clean: boolean; threat?: string }> {
    try {
      // Option 1: Integrate with ClamAV
      // const clamav = require('clamscan');
      // const scanner = await new clamav().init();
      // const result = await scanner.scanBuffer(buffer);

      // Option 2: Integrate with Microsoft Defender API (recommended for GCCH)
      const defenderResult = await this.scanWithDefender(buffer, filename);

      return defenderResult;
    } catch (error) {
      // Log scanning failure (critical security event)
      console.error('[MALWARE SCAN FAILURE]', error);

      // Fail-safe: Reject file if scanning fails
      return {
        clean: false,
        threat: 'Unable to complete security scan',
      };
    }
  }

  /**
   * Integrate with Microsoft Defender for GCCH
   */
  private static async scanWithDefender(
    buffer: Buffer,
    filename: string
  ): Promise<{ clean: boolean; threat?: string }> {
    // In production, integrate with Microsoft Defender for Cloud Apps (GCCH)
    // or Microsoft Defender API

    // Example integration:
    /*
    const response = await fetch('https://api.securitycenter.microsoft.us/api/files/scan', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getDefenderToken()}`,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    const result = await response.json();
    return {
      clean: result.threatDetected === false,
      threat: result.threatName,
    };
    */

    // Placeholder for development (always returns clean)
    // In production, this MUST be implemented
    console.warn('[MALWARE SCAN] Placeholder implementation - integrate with real scanner');

    return { clean: true };
  }

  /**
   * Sanitize filename to prevent path traversal and injection attacks
   */
  private static sanitizeFilename(filename: string): string {
    // Remove path components
    let sanitized = filename.replace(/^.*[\\\/]/, '');

    // Remove or replace dangerous characters
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Prevent hidden files
    if (sanitized.startsWith('.')) {
      sanitized = '_' + sanitized;
    }

    // Limit filename length
    const maxLength = 255;
    if (sanitized.length > maxLength) {
      const ext = this.getFileExtension(sanitized);
      const nameWithoutExt = sanitized.slice(0, sanitized.length - ext.length);
      sanitized = nameWithoutExt.slice(0, maxLength - ext.length) + ext;
    }

    return sanitized;
  }

  /**
   * Get file extension
   */
  private static getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.slice(lastDot) : '';
  }

  /**
   * Validate filename doesn't contain path traversal attempts
   */
  static validateFilenameFormat(filename: string): boolean {
    // Check for path traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return false;
    }

    // Check for null bytes
    if (filename.includes('\0')) {
      return false;
    }

    return true;
  }
}

// Update file upload handler
export async function saveResumeFile(
  applicationId: string,
  buffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<{ storedFilename: string; fileSize: number; hash: string }> {
  // Validate filename format
  if (!FileValidator.validateFilenameFormat(originalFilename)) {
    throw new Error('Invalid filename format (potential security threat)');
  }

  // Comprehensive file validation
  const validationResult = await FileValidator.validateFile(
    buffer,
    originalFilename,
    mimeType
  );

  if (!validationResult.valid) {
    throw new Error(validationResult.error || 'File validation failed');
  }

  // Encrypt file before storage (FIPS 140-2 compliant)
  const encryption = new FIPSEncryption();
  const { encrypted, iv, authTag } = encryption.encrypt(buffer);

  // Generate unique stored filename
  const storedFilename = `${applicationId}_${Date.now()}_${validationResult.sanitizedFilename}`;

  // Save encrypted file
  const storagePath = path.join(RESUME_STORAGE_PATH, storedFilename);
  await fs.writeFile(storagePath, encrypted, { mode: 0o440 }); // Read-only

  // Save encryption metadata
  const metadata = {
    applicationId,
    originalFilename,
    sanitizedFilename: validationResult.sanitizedFilename,
    mimeType,
    fileSize: buffer.length,
    hash: validationResult.hash,
    encrypted: true,
    encryptionAlgorithm: 'AES-256-GCM',
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    uploadTimestamp: new Date().toISOString(),
    fipsCompliant: true,
  };

  await fs.writeFile(
    path.join(RESUME_STORAGE_PATH, `${storedFilename}.meta.json`),
    JSON.stringify(metadata, null, 2),
    { mode: 0o440 }
  );

  // Log file upload to audit trail
  await auditLogger.logEvent({
    eventType: 'FILE_UPLOADED',
    eventCategory: 'DATA_MODIFICATION',
    severity: 'INFO',
    ipAddress: 'system',
    action: 'FILE_UPLOAD',
    resource: storedFilename,
    outcome: 'SUCCESS',
    details: {
      applicationId,
      originalFilename,
      fileSize: buffer.length,
      hash: validationResult.hash,
      encrypted: true,
    },
  });

  return {
    storedFilename,
    fileSize: buffer.length,
    hash: validationResult.hash!,
  };
}
```

---

## 7. Session Management Requirements

### Priority: **HIGH**

#### GCCH Requirements

- **Secure Session Tokens** - Cryptographically strong, random session IDs
- **Session Timeout** - Automatic logout after inactivity
- **Absolute Session Timeout** - Maximum session duration
- **Session Invalidation** - Proper logout and session termination
- **Session Fixation Prevention** - Regenerate session ID on login

#### Current Application Status

❌ **Missing:**
- No session management (application is currently stateless)
- No authentication system
- No session timeouts
- No secure session storage

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.5.10** - Use session lock with pattern-hiding displays to prevent access after period of inactivity
- **3.13.15** - Route remote access via managed access control points

**NIST 800-53 Controls:**
- **AC-12: Session Termination** - Automatically terminate user sessions after defined conditions
- **AC-12(1): User-Initiated Logouts** - Provide logout capability
- **SC-23: Session Authenticity** - Protect authenticity of communications sessions
- **SC-23(3): Unique Session Identifiers** - Generate unique session identifiers

#### Recommended Implementation

```typescript
// lib/session-manager.ts - GCCH-compliant session management
import { randomBytes, createHash } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

interface SessionData {
  userId: string;
  email: string;
  role: string;
  clearanceLevel?: string;
  createdAt: number;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
}

export class SessionManager {
  // NIST recommends 15-30 minutes for inactivity timeout
  private static readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

  // Maximum session duration (8 hours - federal standard)
  private static readonly ABSOLUTE_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours

  // Session token length (256 bits)
  private static readonly TOKEN_LENGTH = 32;

  /**
   * Create new session with GCCH-compliant settings
   */
  static async createSession(
    userId: string,
    email: string,
    role: string,
    ipAddress: string,
    userAgent: string,
    clearanceLevel?: string
  ): Promise<string> {
    const now = Date.now();

    const sessionData: SessionData = {
      userId,
      email,
      role,
      clearanceLevel,
      createdAt: now,
      lastActivity: now,
      ipAddress,
      userAgent,
    };

    // Generate cryptographically secure session token using JWT
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

    const token = await new SignJWT(sessionData)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now / 1000)
      .setExpirationTime(Math.floor((now + this.ABSOLUTE_TIMEOUT) / 1000))
      .setJti(this.generateSessionId()) // Unique session ID
      .sign(secret);

    // Log session creation
    await auditLogger.logEvent({
      eventType: 'SESSION_CREATED',
      eventCategory: 'AUTHENTICATION',
      severity: 'INFO',
      userId,
      ipAddress,
      action: 'CREATE_SESSION',
      outcome: 'SUCCESS',
      details: {
        role,
        clearanceLevel,
        absoluteTimeout: this.ABSOLUTE_TIMEOUT,
        inactivityTimeout: this.INACTIVITY_TIMEOUT,
      },
    });

    return token;
  }

  /**
   * Validate session token
   */
  static async validateSession(
    token: string,
    currentIP: string,
    currentUserAgent: string
  ): Promise<{ valid: boolean; session?: SessionData; reason?: string }> {
    try {
      const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

      // Verify JWT signature and expiration
      const { payload } = await jwtVerify(token, secret);

      const session = payload as unknown as SessionData;
      const now = Date.now();

      // Check absolute timeout
      if (now - session.createdAt > this.ABSOLUTE_TIMEOUT) {
        await auditLogger.logEvent({
          eventType: 'SESSION_EXPIRED',
          eventCategory: 'AUTHENTICATION',
          severity: 'INFO',
          userId: session.userId,
          ipAddress: currentIP,
          action: 'SESSION_VALIDATION',
          outcome: 'FAILURE',
          details: { reason: 'absolute_timeout' },
        });

        return { valid: false, reason: 'Session expired (absolute timeout)' };
      }

      // Check inactivity timeout
      if (now - session.lastActivity > this.INACTIVITY_TIMEOUT) {
        await auditLogger.logEvent({
          eventType: 'SESSION_EXPIRED',
          eventCategory: 'AUTHENTICATION',
          severity: 'INFO',
          userId: session.userId,
          ipAddress: currentIP,
          action: 'SESSION_VALIDATION',
          outcome: 'FAILURE',
          details: { reason: 'inactivity_timeout' },
        });

        return { valid: false, reason: 'Session expired (inactivity)' };
      }

      // Validate IP address consistency (detect session hijacking)
      if (session.ipAddress !== currentIP) {
        await auditLogger.logSecurityViolation(
          'SESSION_HIJACKING_ATTEMPT',
          currentIP,
          {
            userId: session.userId,
            originalIP: session.ipAddress,
            newIP: currentIP,
          }
        );

        return { valid: false, reason: 'IP address mismatch (potential hijacking)' };
      }

      // Validate User-Agent consistency
      if (session.userAgent !== currentUserAgent) {
        await auditLogger.logSecurityViolation(
          'SESSION_HIJACKING_ATTEMPT',
          currentIP,
          {
            userId: session.userId,
            originalUserAgent: session.userAgent,
            newUserAgent: currentUserAgent,
          }
        );

        return { valid: false, reason: 'User-Agent mismatch (potential hijacking)' };
      }

      // Update last activity
      session.lastActivity = now;

      return { valid: true, session };
    } catch (error) {
      await auditLogger.logEvent({
        eventType: 'SESSION_VALIDATION_FAILED',
        eventCategory: 'AUTHENTICATION',
        severity: 'WARNING',
        ipAddress: currentIP,
        action: 'SESSION_VALIDATION',
        outcome: 'FAILURE',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      return { valid: false, reason: 'Invalid session token' };
    }
  }

  /**
   * Invalidate session (logout)
   */
  static async invalidateSession(
    token: string,
    userId: string,
    ipAddress: string
  ): Promise<void> {
    // Add token to blacklist (store in Redis or database)
    await this.addToBlacklist(token);

    // Log session termination
    await auditLogger.logEvent({
      eventType: 'SESSION_TERMINATED',
      eventCategory: 'AUTHENTICATION',
      severity: 'INFO',
      userId,
      ipAddress,
      action: 'LOGOUT',
      outcome: 'SUCCESS',
      details: {
        reason: 'user_logout',
      },
    });
  }

  /**
   * Generate cryptographically secure session ID
   */
  private static generateSessionId(): string {
    return randomBytes(this.TOKEN_LENGTH).toString('base64url');
  }

  /**
   * Add token to blacklist (for logout/revocation)
   */
  private static async addToBlacklist(token: string): Promise<void> {
    // In production, store in Redis with TTL
    // await redis.setex(`blacklist:${token}`, ABSOLUTE_TIMEOUT, '1');

    // For now, store in memory (not production-ready)
    console.log('[SESSION] Token added to blacklist:', token.slice(0, 20) + '...');
  }

  /**
   * Refresh session activity timestamp
   */
  static async refreshSession(token: string): Promise<string> {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const session = payload as unknown as SessionData;
    session.lastActivity = Date.now();

    // Generate new token with updated activity
    const newToken = await new SignJWT(session)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(session.createdAt / 1000)
      .setExpirationTime(Math.floor((session.createdAt + this.ABSOLUTE_TIMEOUT) / 1000))
      .setJti(payload.jti as string)
      .sign(secret);

    return newToken;
  }
}
```

```typescript
// middleware.ts - Session validation middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SessionManager } from '@/lib/session-manager';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip session validation for public routes
  const publicRoutes = ['/', '/apply', '/success'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get session token from cookie
  const sessionToken = request.cookies.get('session_token')?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Validate session
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  const validation = await SessionManager.validateSession(
    sessionToken,
    clientIP,
    userAgent
  );

  if (!validation.valid) {
    // Clear invalid session cookie
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session_token');

    return response;
  }

  // Refresh session activity
  const newToken = await SessionManager.refreshSession(sessionToken);

  // Update cookie with new token
  const response = NextResponse.next();
  response.cookies.set('session_token', newToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 8 * 60 * 60, // 8 hours
  });

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/applications/:path*'],
};
```

---

## 8. CORS and Security Headers

### Priority: **HIGH**

#### GCCH Requirements

- **Content Security Policy (CSP)** - Prevent XSS and injection attacks
- **HTTP Strict Transport Security (HSTS)** - Enforce HTTPS
- **X-Frame-Options** - Prevent clickjacking
- **CORS** - Restrict cross-origin requests
- **Additional Security Headers** - Defense in depth

#### Current Application Status

✅ **Implemented:**
- HSTS with 1-year max-age
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy
- Permissions-Policy
- Content-Security-Policy (basic)

⚠️ **Needs Enhancement:**
- HSTS should be 2 years for GCCH (currently 1 year)
- CSP allows unsafe-inline and unsafe-eval
- Missing CORS configuration
- Missing additional security headers

#### Implementation Requirements

**NIST 800-53 Controls:**
- **SI-10: Information Input Validation** - Validate inputs to prevent injection
- **SI-16: Memory Protection** - Implement protections from unauthorized code execution

#### Recommended Implementation

```javascript
// next.config.js - Enhanced security headers for GCCH
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // HSTS - 2 years with preload (GCCH requirement)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // Prevent MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // Permissions policy (disable unnecessary features)
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=()',
              'usb=()',
            ].join(', '),
          },

          // Enhanced Content Security Policy (strict - no unsafe-inline/unsafe-eval)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'nonce-{NONCE}'", // Use nonces instead of unsafe-inline
              "style-src 'self' 'nonce-{NONCE}'",
              "img-src 'self' data:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
              "block-all-mixed-content",
            ].join('; '),
          },

          // CORS headers (strict for GCCH)
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || 'https://ace-portal.gov',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },

          // Additional security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'X-Download-Options',
            value: 'noopen',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

```typescript
// app/layout.tsx - CSP nonce generation
import { headers } from 'next/headers';
import crypto from 'crypto';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate nonce for CSP
  const nonce = crypto.randomBytes(16).toString('base64');

  return (
    <html lang="en">
      <head>
        {/* Add nonce to inline scripts */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={`
            default-src 'self';
            script-src 'self' 'nonce-${nonce}';
            style-src 'self' 'nonce-${nonce}';
          `.replace(/\s+/g, ' ').trim()}
        />
      </head>
      <body>
        {children}
        {/* Use nonce for inline scripts */}
        <script nonce={nonce}>
          {/* Inline script with nonce */}
        </script>
      </body>
    </html>
  );
}
```

---

## 9. Input Validation Requirements

### Priority: **CRITICAL**

#### GCCH Requirements

- **Allowlist Validation** - Define allowed input patterns
- **Output Encoding** - Prevent XSS and injection attacks
- **Type Validation** - Ensure data types match expectations
- **Length Limits** - Prevent buffer overflow and DoS
- **Sanitization** - Remove dangerous characters

#### Current Application Status

✅ **Implemented:**
- Form validation using Zod
- React Hook Form integration

⚠️ **Needs Enhancement:**
- Server-side validation needed
- Input sanitization required
- SQL injection prevention (when database added)
- Command injection prevention
- Path traversal prevention

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.14.5** - Perform periodic scans of organizational systems and real-time scans of files

**NIST 800-53 Controls:**
- **SI-10: Information Input Validation** - Check validity of inputs

#### Recommended Implementation

```typescript
// lib/input-validator.ts - GCCH-compliant input validation
import { z } from 'zod';

/**
 * Comprehensive input validation for GCCH compliance
 */
export class InputValidator {
  /**
   * Sanitize string input (remove dangerous characters)
   */
  static sanitizeString(input: string): string {
    // Remove control characters
    let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

    // Remove SQL injection patterns
    sanitized = sanitized.replace(/('|(--)|;|\/\*|\*\/)/g, '');

    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Remove script tags and event handlers
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');

    return sanitized.trim();
  }

  /**
   * Validate email address (strict)
   */
  static readonly emailSchema = z
    .string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email must not exceed 254 characters') // RFC 5321
    .refine(
      (email) => {
        // Additional validation: no special characters in local part
        const localPart = email.split('@')[0];
        return /^[a-zA-Z0-9._-]+$/.test(localPart);
      },
      { message: 'Email contains invalid characters' }
    );

  /**
   * Validate phone number (US format)
   */
  static readonly phoneSchema = z
    .string()
    .regex(
      /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
      'Invalid US phone number format'
    );

  /**
   * Validate full name
   */
  static readonly nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Name can only contain letters, spaces, hyphens, and apostrophes'
    );

  /**
   * Validate LinkedIn URL
   */
  static readonly linkedinSchema = z
    .string()
    .url('Invalid URL')
    .regex(
      /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
      'Must be a valid LinkedIn profile URL'
    )
    .optional()
    .or(z.literal(''));

  /**
   * Validate free-form text (with length limits)
   */
  static createTextSchema(minLength: number, maxLength: number) {
    return z
      .string()
      .min(minLength, `Must be at least ${minLength} characters`)
      .max(maxLength, `Must not exceed ${maxLength} characters`)
      .refine(
        (text) => {
          // No script tags
          return !/<script/i.test(text);
        },
        { message: 'Input contains prohibited content' }
      );
  }

  /**
   * Validate application ID format
   */
  static readonly applicationIdSchema = z
    .string()
    .regex(
      /^ACE-\d{4}-[A-F0-9]{8}$/,
      'Invalid application ID format'
    );

  /**
   * Comprehensive application data schema
   */
  static readonly applicationSchema = z.object({
    fullName: this.nameSchema,
    email: this.emailSchema,
    phone: this.phoneSchema,
    linkedin: this.linkedinSchema,
    // Add screening question schemas
    security_clearance: z.enum(['yes', 'no'], {
      required_error: 'Please answer the security clearance question',
    }),
    clearance_level: z.string().optional(),
    us_citizen: z.enum(['yes', 'no'], {
      required_error: 'Please answer the citizenship question',
    }),
    relocation_willing: z.enum(['yes', 'no'], {
      required_error: 'Please answer the relocation question',
    }),
  });

  /**
   * Validate and sanitize application data
   */
  static validateApplicationData(data: unknown): {
    valid: boolean;
    data?: any;
    errors?: z.ZodError;
  } {
    try {
      const validatedData = this.applicationSchema.parse(data);

      // Additional sanitization
      const sanitizedData = {
        ...validatedData,
        fullName: this.sanitizeString(validatedData.fullName),
        email: validatedData.email.toLowerCase().trim(),
        phone: validatedData.phone.replace(/\D/g, ''), // Keep digits only
      };

      return { valid: true, data: sanitizedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { valid: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Prevent path traversal attacks
   */
  static validateFilePath(filepath: string): boolean {
    // Normalize path
    const normalized = filepath.replace(/\\/g, '/');

    // Check for path traversal patterns
    if (normalized.includes('../') || normalized.includes('..\\')) {
      return false;
    }

    // Check for absolute paths (should be relative)
    if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) {
      return false;
    }

    return true;
  }

  /**
   * Validate JSON input (prevent prototype pollution)
   */
  static sanitizeJSON(data: any): any {
    // Remove __proto__, constructor, and prototype properties
    const sanitized = JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return undefined;
        }
        return value;
      })
    );

    return sanitized;
  }
}
```

```typescript
// app/api/submit-application/route.ts - Enhanced with validation
export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  try {
    // ... rate limiting ...

    // Parse form data
    const { fields, files } = await parseFormData(request);

    // Parse and sanitize JSON data
    let data;
    try {
      data = JSON.parse(fields.data);
      data = InputValidator.sanitizeJSON(data); // Prevent prototype pollution
    } catch (error) {
      await auditLogger.logSecurityViolation(
        'INVALID_JSON_INPUT',
        clientIP,
        { error: 'Malformed JSON data' }
      );

      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Validate and sanitize application data
    const validation = InputValidator.validateApplicationData(data);

    if (!validation.valid) {
      await auditLogger.logEvent({
        eventType: 'VALIDATION_FAILED',
        eventCategory: 'SECURITY',
        severity: 'WARNING',
        ipAddress: clientIP,
        action: 'VALIDATE_INPUT',
        outcome: 'FAILURE',
        details: {
          errors: validation.errors?.errors,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.errors?.errors,
        },
        { status: 400 }
      );
    }

    // Use sanitized data
    const sanitizedData = validation.data;

    // ... continue with file validation and processing ...
  } catch (error) {
    // ... error handling ...
  }
}
```

---

## 10. Additional Security Controls

### Priority: **MEDIUM to HIGH**

#### GCCH Requirements

- **Incident Response** - Documented incident response plan
- **Vulnerability Management** - Regular scanning and patching
- **Security Awareness Training** - For all personnel
- **Physical Security** - For GCCH data center access
- **Supply Chain Security** - Vet third-party components
- **Backup and Recovery** - Regular backups with encryption
- **Disaster Recovery** - Documented DR plan

#### Implementation Requirements

**NIST 800-171 Controls:**
- **3.6.1** - Establish an operational incident-handling capability
- **3.6.2** - Track, document, and report incidents
- **3.11.1** - Periodically assess the risk
- **3.12.1** - Periodically assess the security controls
- **3.14.2** - Provide protection from malicious code
- **3.14.4** - Update malicious code protection mechanisms

**NIST 800-53 Controls:**
- **IR-4: Incident Handling** - Implement incident handling capability
- **IR-6: Incident Reporting** - Require reporting of incidents
- **RA-5: Vulnerability Monitoring and Scanning**
- **SI-2: Flaw Remediation** - Identify and correct system flaws
- **CP-9: System Backup** - Conduct backups of information
- **CP-10: System Recovery and Reconstitution**

---

## GCCH Security Compliance Checklist

### Critical Priority (Implement Immediately)

- [ ] **Authentication & Authorization**
  - [ ] Implement Azure AD integration with GCCH endpoints
  - [ ] Enable Multi-Factor Authentication (MFA)
  - [ ] Implement Role-Based Access Control (RBAC)
  - [ ] Add session management with 15-minute inactivity timeout
  - [ ] Add 8-hour absolute session timeout
  - [ ] Implement session hijacking detection (IP/User-Agent validation)

- [ ] **Encryption (FIPS 140-2 Compliant)**
  - [ ] Integrate Azure Key Vault (GCCH) for key management
  - [ ] Implement AES-256-GCM encryption for files at rest
  - [ ] Ensure TLS 1.2+ for all data in transit
  - [ ] Enable FIPS mode in Node.js (`--enable-fips`)
  - [ ] Implement automatic key rotation (every 90 days)

- [ ] **Audit Logging**
  - [ ] Implement comprehensive audit logging (all 6 event categories)
  - [ ] Add tamper-proof logging with hash chaining
  - [ ] Set up log retention (minimum 1 year, recommend 3-7 years)
  - [ ] Integrate with SIEM (Azure Sentinel or equivalent)
  - [ ] Configure real-time alerts for security events

- [ ] **File Upload Security**
  - [ ] Add magic byte validation (verify file contents)
  - [ ] Integrate antivirus scanning (ClamAV or Microsoft Defender)
  - [ ] Implement file sanitization
  - [ ] Add executable detection and blocking
  - [ ] Encrypt uploaded files before storage

- [ ] **Input Validation**
  - [ ] Implement server-side validation for all inputs
  - [ ] Add input sanitization (XSS, SQL injection prevention)
  - [ ] Validate JSON to prevent prototype pollution
  - [ ] Add path traversal prevention
  - [ ] Implement output encoding

### High Priority (Implement Within 30 Days)

- [ ] **Network Security**
  - [ ] Deploy Web Application Firewall (WAF)
  - [ ] Implement DDoS protection
  - [ ] Add geographic restrictions (US-only access)
  - [ ] Configure VPN requirement for admin access
  - [ ] Implement IP whitelisting for privileged accounts

- [ ] **Security Headers**
  - [ ] Update HSTS to 2-year max-age with preload
  - [ ] Remove unsafe-inline and unsafe-eval from CSP
  - [ ] Implement CSP with nonces
  - [ ] Add missing CORS configuration
  - [ ] Add Cross-Origin-* security headers

- [ ] **API Security**
  - [ ] Implement API key management system
  - [ ] Add API authentication middleware
  - [ ] Implement rate limiting per API key
  - [ ] Add request signing for API calls
  - [ ] Implement API key rotation

- [ ] **Data Protection**
  - [ ] Ensure US data residency (GCCH requirement)
  - [ ] Implement data classification (PII/CUI tagging)
  - [ ] Add data retention policies
  - [ ] Implement secure data deletion (crypto-shredding)
  - [ ] Add backup encryption

### Medium Priority (Implement Within 60 Days)

- [ ] **Compliance Documentation**
  - [ ] Create System Security Plan (SSP)
  - [ ] Document security controls mapping (NIST 800-171)
  - [ ] Create incident response plan
  - [ ] Document disaster recovery procedures
  - [ ] Create security awareness training materials

- [ ] **Monitoring & Response**
  - [ ] Set up continuous monitoring
  - [ ] Implement automated vulnerability scanning
  - [ ] Configure intrusion detection system (IDS)
  - [ ] Create security incident response team (SIRT)
  - [ ] Establish security metrics and KPIs

- [ ] **Access Control**
  - [ ] Implement principle of least privilege
  - [ ] Add privileged access management (PAM)
  - [ ] Implement access reviews (quarterly)
  - [ ] Add emergency access procedures
  - [ ] Document access control policies

### Low Priority (Implement Within 90 Days)

- [ ] **Security Testing**
  - [ ] Conduct penetration testing
  - [ ] Perform security code review
  - [ ] Run automated security scans (SAST/DAST)
  - [ ] Conduct social engineering assessments
  - [ ] Perform disaster recovery drills

- [ ] **Operational Security**
  - [ ] Implement change management process
  - [ ] Create security runbooks
  - [ ] Document operational procedures
  - [ ] Establish security metrics reporting
  - [ ] Create security dashboard

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
1. Enable FIPS mode and implement encryption
2. Add comprehensive audit logging
3. Integrate Azure Key Vault (GCCH)
4. Implement file upload security with malware scanning

### Phase 2: Access Control (Weeks 5-8)
1. Implement authentication (Azure AD GCCH)
2. Add MFA requirement
3. Implement RBAC
4. Add session management
5. Deploy WAF and network security

### Phase 3: Compliance (Weeks 9-12)
1. Complete security headers implementation
2. Finalize input validation
3. Set up SIEM integration
4. Complete compliance documentation
5. Conduct security assessment

### Phase 4: Hardening (Weeks 13-16)
1. Implement monitoring and alerting
2. Conduct penetration testing
3. Perform security remediation
4. Complete operational documentation
5. Obtain CMMC Level 2 assessment

---

## Code Examples for Quick Implementation

### Environment Variables (.env)

```bash
# GCCH-specific endpoints
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_KEYVAULT_URL=https://your-vault.vault.usgovcloudapi.net/

# Encryption keys (store in Key Vault in production)
MASTER_ENCRYPTION_KEY=generate-with-crypto-randomBytes-32
KEY_DERIVATION_SALT=generate-with-crypto-randomBytes-16

# Session management
SESSION_SECRET=generate-with-crypto-randomBytes-32

# Logging
AUDIT_LOG_PATH=/var/log/ace-portal/audit.log
SIEM_ENDPOINT=https://your-siem-endpoint
SIEM_API_KEY=your-siem-api-key

# Network security
ALLOWED_ORIGIN=https://ace-portal.gov
ADMIN_IP_WHITELIST=10.0.0.0/8,192.168.0.0/16

# Azure Defender (GCCH)
DEFENDER_API_ENDPOINT=https://api.securitycenter.microsoft.us
DEFENDER_API_KEY=your-defender-api-key
```

### Package.json Updates

```json
{
  "dependencies": {
    "@azure/identity": "^4.0.0",
    "@azure/keyvault-secrets": "^4.7.0",
    "next-auth": "^4.24.0",
    "jose": "^5.0.0"
  },
  "scripts": {
    "start:fips": "NODE_OPTIONS='--enable-fips' next start",
    "build:fips": "NODE_OPTIONS='--enable-fips' next build"
  }
}
```

---

## Conclusion

This report provides a comprehensive roadmap for achieving GCCH/GCC High compliance for your Next.js job application portal. The implementation priorities are based on:

1. **Critical Risk Areas** - Authentication, encryption, logging, file security
2. **Compliance Requirements** - NIST 800-171, FedRAMP High, CMMC Level 2
3. **Government Standards** - FIPS 140-2, DFARS, ITAR
4. **Best Practices** - OWASP, defense in depth, zero trust

### Key Takeaways

- **110 controls** from CMMC Level 2 must be implemented
- **FIPS 140-2 validated cryptography** is mandatory for all encryption
- **Comprehensive audit logging** is critical for compliance
- **U.S. data residency** is required for GCCH
- **Multi-factor authentication** is mandatory
- **Regular security assessments** are required (annual CMMC recertification)

### Next Steps

1. Review this report with your security team
2. Prioritize implementation based on the checklist
3. Begin with Critical priority items (Phases 1-2)
4. Engage with a C3PAO (CMMC Third-Party Assessor) for assessment
5. Document all security controls in your System Security Plan (SSP)

### Additional Resources

- [NIST SP 800-171 Rev. 3](https://csrc.nist.gov/pubs/sp/800/171/r3/final)
- [CMMC Assessment Guide Level 2](https://dodcio.defense.gov/Portals/0/Documents/CMMC/AssessmentGuideL2v2.pdf)
- [FedRAMP High Baseline](https://www.fedramp.gov/baselines/)
- [Microsoft GCC High Documentation](https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod)

---

**Report Generated:** 2025-10-21
**Application:** ACE Role Screening Portal
**Compliance Target:** GCCH (Government Community Cloud High)
**Framework:** NIST 800-171 Rev. 3, CMMC 2.0 Level 2, FedRAMP High
