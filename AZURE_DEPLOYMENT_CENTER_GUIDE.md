# Azure Deployment Center Guide - GitHub Integration

## Overview
This guide shows how to deploy the ACE Screening Portal to Azure Government using the built-in Deployment Center with GitHub integration. This method automatically pulls fresh code from GitHub and builds it in Azure.

## Prerequisites
- Azure Government App Service created
- GitHub repository: https://github.com/nickalara/ace-screening-portal
- Access to Azure Portal (Azure Government)

## Part 1: Clean Up Existing FTP Deployment

### Why Clean Up?
The previous FTP deployment may have incompatible files (standalone build, server.js, web.config) that conflict with the standard deployment approach. Azure Deployment Center expects a standard Next.js structure.

### Option A: Clean via Azure Portal SSH (Recommended)

1. **Access SSH**:
   - Azure Portal → Your App Service
   - Click **SSH** (under Development Tools)

2. **Backup Existing Files** (optional):
   ```bash
   cd /home/site
   tar -czf wwwroot-backup-$(date +%Y%m%d).tar.gz wwwroot/
   ```

3. **Clear wwwroot Directory**:
   ```bash
   cd /home/site/wwwroot
   rm -rf *
   rm -rf .*
   ```

4. **Verify Clean State**:
   ```bash
   ls -la
   # Should show empty directory (only . and ..)
   ```

### Option B: Clean via FileZilla FTP

1. **Connect to FTP**:
   - Use same credentials from previous deployment
   - Host: `ftps://your-app.azurewebsites.net`

2. **Navigate and Delete**:
   - Go to `/site/wwwroot/`
   - Select all files and folders
   - Right-click → Delete
   - Confirm deletion

3. **Verify**:
   - Directory should be empty

## Part 2: Configure Azure App Service Settings

### Step 1: Application Settings

Navigate to: **Azure Portal → Your App Service → Configuration → Application settings**

**REMOVE these settings if they exist** (from previous FTP deployment):
- ❌ `WEBSITE_RUN_FROM_PACKAGE`
- ❌ Any standalone-specific settings

**ADD/UPDATE these settings**:

| Name | Value | Notes |
|------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `WEBSITE_NODE_DEFAULT_VERSION` | `~20` | Use Node 20 LTS |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` | Enable build on deployment |
| `SENDGRID_API_KEY` | `YOUR_API_KEY` | Your SendGrid key |
| `SENDGRID_FROM_EMAIL` | `noreply@startguides.com` | Verified sender |
| `SENDGRID_FROM_NAME` | `StartGuides Hiring Team` | Display name |

**Optional but Recommended**:
| Name | Value | Purpose |
|------|-------|---------|
| `WEBSITE_TIME_ZONE` | `Eastern Standard Time` | Set timezone |
| `WEBSITES_ENABLE_APP_SERVICE_STORAGE` | `true` | Persistent storage |

Click **Save** and wait for restart.

### Step 2: General Settings

Navigate to: **Configuration → General settings**

**Stack Settings**:
- **Stack**: Node
- **Major version**: 20 LTS
- **Minor version**: (Latest)
- **Startup Command**: Leave EMPTY (Azure will auto-detect Next.js)

**Platform Settings**:
- **Platform**: 64 Bit
- **Always On**: On (if Standard tier or higher)
- **HTTP version**: 2.0
- **Minimum TLS Version**: 1.2

Click **Save**.

## Part 3: Set Up GitHub Deployment

### Step 1: Access Deployment Center

1. Azure Portal → Your App Service
2. Click **Deployment Center** (under Deployment)

### Step 2: Configure Source

1. **Source**: Select **GitHub**

2. **Authorize GitHub** (if first time):
   - Click **Authorize**
   - Sign in to GitHub
   - Grant Azure access to your repositories

3. **Organization**: Select your GitHub username (`nickalara`)

4. **Repository**: Select `ace-screening-portal`

5. **Branch**: Select `main`

### Step 3: Configure Build Provider

1. **Build Provider**: Select **App Service Build Service** (Oryx)
   - This is recommended for Azure Government
   - Builds happen within Azure (no external GitHub runners)

2. **Review Configuration**:
   - Azure will detect this is a Next.js application
   - Oryx will automatically run `npm install` and `npm run build`

### Step 4: Save and Deploy

1. Click **Save** at the top

2. **Initial Deployment Starts**:
   - Azure creates a webhook in your GitHub repository
   - Triggers immediate deployment
   - Pulls latest code from `main` branch
   - Runs build process

3. **Monitor Deployment**:
   - Stay on Deployment Center page
   - Click **Logs** tab
   - Watch real-time deployment progress

## Part 4: Verify Deployment

### Step 1: Check Deployment Logs

In Deployment Center → Logs:
- Look for "Deployment successful" message
- Check for any errors during build

Common log entries you should see:
```
Fetching changes...
Building...
Running 'npm install --production'
Running 'npm run build'
Deployment successful
```

### Step 2: Verify File Structure via SSH

1. Azure Portal → Your App Service → SSH

2. Check structure:
   ```bash
   cd /home/site/wwwroot
   ls -la
   ```

Expected structure (standard Next.js):
```
/home/site/wwwroot/
├── .next/              # Build output
├── app/                # Your Next.js app directory
├── components/         # Your components
├── data/               # Data directory
├── lib/                # Libraries
├── public/             # Static files
├── node_modules/       # Dependencies
├── package.json
├── next.config.js
└── tsconfig.json
```

**NOT expected** (these were from FTP deployment):
- ❌ server.js
- ❌ web.config
- ❌ standalone/ directory

### Step 3: Create Data Directories

The app needs directories for storing applications and resumes:

```bash
cd /home/site/wwwroot
mkdir -p data/applications data/resumes
chmod 755 data data/applications data/resumes
```

### Step 4: Test Application

1. **Open App URL**: `https://your-app.azurewebsites.net`
2. **Test Landing Page**: Should load without errors
3. **Test Application Form**: Navigate to `/apply`
4. **Submit Test Application**: Verify email confirmation works

## Part 5: Continuous Deployment

### How It Works

Once configured, deployment is automatic:
1. Push code to `main` branch on GitHub
2. GitHub webhook triggers Azure
3. Azure pulls latest code
4. Azure runs `npm install` and `npm run build`
5. New version goes live

### Manual Redeploy

If needed, trigger manual redeploy:
1. Deployment Center → Logs
2. Click **Sync** button at top
3. Waits for latest GitHub changes and redeploys

### Disable Auto-Deploy

To temporarily disable:
1. Deployment Center → Settings
2. Click **Disconnect**
3. Re-enable later by reconnecting

## Troubleshooting

### Issue: Deployment Fails with Build Errors

**Check**:
1. Deployment Center → Logs → View detailed logs
2. Look for npm install or build errors

**Common causes**:
- Missing dependencies in package.json
- Node version mismatch
- TypeScript errors

**Fix**:
```bash
# Test build locally first
npm install
npm run build
# Fix any errors, then push to GitHub
```

### Issue: App Shows 500 Error After Deployment

**Check Application Logs**:
1. Azure Portal → App Service → Log stream
2. Look for runtime errors

**Common causes**:
- Missing environment variables
- Data directories don't exist
- Incorrect Node.js version

**Fix**:
```bash
# Via SSH
cd /home/site/wwwroot
mkdir -p data/applications data/resumes
chmod 755 data data/applications data/resumes
```

### Issue: Deployment Times Out

**Cause**: Large node_modules or slow build

**Fix**:
1. Check package.json for unnecessary dependencies
2. Increase deployment timeout in Configuration → General settings
3. Monitor in Deployment Center logs

### Issue: Environment Variables Not Working

**Check**:
```bash
# Via SSH
printenv | grep SENDGRID
printenv | grep NODE_ENV
```

**Fix**:
1. Verify saved in Configuration → Application settings
2. Click **Save** (triggers restart)
3. Wait 1-2 minutes for restart

### Issue: GitHub Webhook Not Triggering

**Check Webhook**:
1. GitHub Repository → Settings → Webhooks
2. Should see Azure webhook URL
3. Check recent deliveries for errors

**Fix**:
1. Delete webhook in GitHub
2. Disconnect in Azure Deployment Center
3. Reconnect (recreates webhook)

## Configuration Comparison

### ❌ Previous FTP Deployment
- Manual file upload via FileZilla
- Standalone build with server.js
- Manual web.config for IIS
- No automatic updates
- Required full rebuild and re-upload

### ✅ Deployment Center (Current)
- Automatic deployment from GitHub
- Standard Next.js build
- Azure auto-detects and configures
- Automatic updates on git push
- Built-in rollback support

## Best Practices

### 1. Always Test Locally First
```bash
npm install
npm run build
npm start
```

### 2. Use Environment Variables for Secrets
- Never commit API keys to GitHub
- Always use Azure Application Settings

### 3. Monitor Deployments
- Check Deployment Center logs after each push
- Set up alerts for failed deployments

### 4. Keep Dependencies Updated
```bash
npm outdated
npm update
```

### 5. Use Git Tags for Releases
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Azure Government Specific Notes

### Endpoints
Azure Government uses different endpoints:
- Portal: https://portal.azure.us (not .com)
- App Service: https://your-app.azurewebsites.us (not .net)

### GitHub Integration
- GitHub.com repositories work with Azure Government
- Webhook calls from Azure Government to GitHub.com
- Build happens entirely within Azure Government cloud

### Compliance
- Data stays within Azure Government cloud
- Meets FedRAMP High compliance requirements
- ITAR compliant if configured properly

## Next Steps

After successful deployment:

1. **Set Up Custom Domain** (if needed)
   - Configuration → Custom domains
   - Add your domain
   - Configure DNS

2. **Enable Application Insights**
   - Application Insights → Turn on
   - Monitor performance and errors

3. **Set Up Staging Slot** (Standard tier+)
   - Deployment slots → Add slot
   - Test before production

4. **Configure Alerts**
   - Alerts → New alert rule
   - Alert on deployment failures

5. **Review Security**
   - TLS/SSL settings → HTTPS Only: On
   - Authentication → Consider enabling

## Quick Reference

### Deployment Workflow
```
Code Change → Push to main → GitHub webhook → Azure pulls code →
Azure builds (npm install, npm run build) → Deploy → Live
```

### Key Azure Settings Locations
- **Deployment Setup**: Deployment Center
- **Environment Variables**: Configuration → Application settings
- **Node Version**: Configuration → General settings
- **Logs**: Deployment Center → Logs OR Log stream
- **SSH Access**: SSH (under Development Tools)

### Useful SSH Commands
```bash
# Check current deployment
cd /home/site/wwwroot && ls -la

# Check environment variables
printenv | grep NODE

# Check data directories
ls -la data/

# View application logs
cd /home/LogFiles && tail -f application/*.log

# Check Node version
node --version
```

## Support Resources

- **Azure Government Portal**: https://portal.azure.us
- **Azure App Service Docs**: https://docs.microsoft.com/azure/app-service/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Repository**: https://github.com/nickalara/ace-screening-portal

---

**Ready to deploy?** Follow Part 1 to clean up existing files, then Part 2-3 to configure and deploy!
