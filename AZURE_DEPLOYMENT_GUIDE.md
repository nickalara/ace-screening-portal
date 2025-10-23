# Azure Deployment Guide - FTP Upload

## Overview
This guide walks through deploying the ACE Screening Portal to Azure App Service via FTP using FileZilla.

## Prerequisites
- FileZilla FTP client installed
- Azure App Service created (Node.js runtime)
- FTP credentials from Azure Portal

## Getting FTP Credentials from Azure

1. Go to Azure Portal (portal.azure.com)
2. Navigate to your App Service
3. In the left menu, click **Deployment Center**
4. Click on **FTPS credentials** tab
5. Note down:
   - **FTPS endpoint** (e.g., ftps://your-app.azurewebsites.net)
   - **Username** (format: `your-app\$your-app`)
   - **Password** (click "Show" to reveal)

## Step 1: Prepare Local Build

The build has already been completed. You now have:
- `azure-deployment/` folder containing all deployment files
- Configured for standalone mode (required for Azure)

## Step 2: Configure Environment Variables in Azure

Before uploading files, set environment variables in Azure:

1. Go to Azure Portal → Your App Service
2. Click **Configuration** (under Settings)
3. Click **+ New application setting** and add:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `SENDGRID_FROM_EMAIL`: noreply@startguides.com
   - `SENDGRID_FROM_NAME`: StartGuides Hiring Team
   - `NODE_ENV`: production
   - `WEBSITE_NODE_DEFAULT_VERSION`: 18-lts

4. Click **Save** at the top

## Step 3: Upload Files via FileZilla

### Connect to Azure FTP

1. Open FileZilla
2. Enter connection details:
   - **Host**: Your FTPS endpoint (e.g., `ftps://your-app.azurewebsites.net`)
   - **Username**: Your Azure FTP username (format: `your-app\$your-app`)
   - **Password**: Your Azure FTP password
   - **Port**: 21

3. Click **Quickconnect**
4. Accept the SSL certificate when prompted

### Navigate to Deployment Directory

In FileZilla's **Remote site** pane (right side):
1. Navigate to `/site/wwwroot/`
2. **Delete all existing files** in this directory (if any)

### Upload Deployment Files

1. In FileZilla's **Local site** pane (left side):
   - Navigate to: `/Users/nlara/StartGuidesProjects/ace-screening-portal/azure-deployment/`

2. Select ALL files and folders in the `azure-deployment` directory:
   - `.next/` folder
   - `data/` folder
   - `node_modules/` folder
   - `static/` folder
   - `package.json`
   - `server.js`
   - `web.config`
   - `.env.production` (optional, better to use Azure App Settings)

3. Right-click and select **Upload**
4. Wait for all files to transfer (this may take 10-30 minutes for node_modules)

### Alternative: Exclude node_modules (Faster)

To speed up deployment, you can skip uploading `node_modules`:

1. Upload all files EXCEPT `node_modules/` folder
2. After upload completes, use Azure SSH to install dependencies:
   - In Azure Portal → Your App Service
   - Click **SSH** (under Development Tools)
   - Run: `cd /home/site/wwwroot && npm install --production`

## Step 4: Verify Deployment

### Check File Structure

In Azure Portal → Your App Service → **SSH**:
```bash
cd /home/site/wwwroot
ls -la
```

You should see:
- `.next/` directory
- `data/` directory
- `node_modules/` directory
- `static/` directory
- `server.js`
- `web.config`
- `package.json`

### Check Application Logs

1. Azure Portal → Your App Service → **Log stream** (under Monitoring)
2. Watch for startup messages
3. Look for any errors

### Test the Application

1. Open your Azure App Service URL: `https://your-app.azurewebsites.net`
2. Verify the landing page loads
3. Navigate to `/apply` and test the form
4. Submit a test application

## Step 5: Create Data Directories

Applications need writable directories for data storage:

Via Azure SSH:
```bash
cd /home/site/wwwroot/data
mkdir -p applications resumes
chmod 755 applications resumes
```

## Troubleshooting

### App Not Starting

**Check Node.js version:**
```bash
node --version
```
Should be 18.x or higher.

**Check web.config:**
Ensure `web.config` exists in `/home/site/wwwroot/`

**Check logs:**
Azure Portal → Your App Service → **Log stream**

### 500 Errors

**Common causes:**
- Missing environment variables (check Configuration)
- Missing `web.config` file
- Incorrect file permissions on `data/` folders
- Node.js version mismatch

**Fix:**
1. Verify all environment variables are set
2. Check Log stream for specific errors
3. Verify `data/` directories exist and are writable

### File Upload Issues

**Large file upload failing:**
- Use FileZilla's "Resume" feature if connection drops
- Consider uploading in batches (system files first, then node_modules)
- Or skip node_modules and run `npm install` via SSH

**Timeout issues:**
- Increase FileZilla timeout: Edit → Settings → Connection → Timeout: 300 seconds
- Use FTPS (not SFTP) for Azure

### Application Not Receiving Form Submissions

**Check:**
1. Data directories exist and are writable:
   ```bash
   ls -la /home/site/wwwroot/data
   ```
2. Environment variables for SendGrid are set correctly
3. API routes are working: Test `https://your-app.azurewebsites.net/api/submit-application`

## File Structure in Azure

After deployment, your Azure App Service should have this structure:

```
/home/site/wwwroot/
├── .next/
│   ├── static/
│   └── ... (build artifacts)
├── data/
│   ├── applications/
│   └── resumes/
├── node_modules/
├── static/
├── package.json
├── server.js
├── web.config
└── .env.production (optional)
```

## Important Notes

1. **Environment Variables**: Use Azure App Settings instead of `.env.production` file for better security
2. **Data Persistence**: Files in `/home/site/wwwroot/data` are persistent but consider using Azure Storage for production
3. **Node Version**: Ensure Azure is using Node.js 18 LTS or higher
4. **HTTPS**: Azure automatically provides HTTPS
5. **Restarts**: After changing App Settings, the app will automatically restart

## Performance Optimization

After initial deployment:

1. **Enable Application Insights** for monitoring
2. **Set up Azure CDN** for static assets
3. **Configure custom domain** if needed
4. **Set up deployment slots** for staging environment
5. **Enable Always On** in Configuration → General settings

## Next Steps

- Set up custom domain
- Configure SSL certificate (if using custom domain)
- Set up automated backups
- Configure Application Insights monitoring
- Set up CI/CD pipeline (GitHub Actions or Azure DevOps)

## Support

For Azure-specific issues, check:
- Azure Portal → Your App Service → Diagnose and solve problems
- Azure Status: status.azure.com
- Azure Documentation: docs.microsoft.com/azure
