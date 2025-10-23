# Azure App Service Configuration Checklist

## Required Configuration Steps

### 1. General Settings (Configuration → General settings)

Navigate to: **Azure Portal → Your App Service → Configuration → General settings**

#### Stack Settings:
- **Stack**: Node
- **Major version**: 18 LTS (or Node 20 LTS)
- **Minor version**: (Select latest available)
- **Startup Command**: `node server.js`

#### Platform Settings:
- **Platform**: 64 Bit
- **Always On**: On (if using Standard tier or higher - recommended for production)
- **ARR affinity**: On (default)
- **HTTP version**: 2.0
- **Minimum TLS Version**: 1.2

### 2. Application Settings (Configuration → Application settings)

Navigate to: **Azure Portal → Your App Service → Configuration → Application settings**

Click **+ New application setting** for each:

#### Required Environment Variables:

| Name | Value | Notes |
|------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `WEBSITE_NODE_DEFAULT_VERSION` | `18-lts` | Required - matches runtime |
| `SENDGRID_API_KEY` | `YOUR_ACTUAL_API_KEY` | Replace with your SendGrid key |
| `SENDGRID_FROM_EMAIL` | `noreply@startguides.com` | Your verified sender email |
| `SENDGRID_FROM_NAME` | `StartGuides Hiring Team` | Display name for emails |

#### Optional but Recommended:

| Name | Value | Purpose |
|------|-------|---------|
| `WEBSITE_TIME_ZONE` | `Eastern Standard Time` | Set timezone for logs |
| `WEBSITES_ENABLE_APP_SERVICE_STORAGE` | `true` | Enable persistent storage |
| `WEBSITE_RUN_FROM_PACKAGE` | `0` | Allow file writes to /data |

**Important**: Click **Save** at the top after adding all settings. The app will restart automatically.

### 3. Path Mappings (Configuration → Path mappings)

Navigate to: **Azure Portal → Your App Service → Configuration → Path mappings**

Usually no changes needed, but verify:
- **Virtual applications and directories**: `/` should map to `site\wwwroot`

### 4. Default Documents (Optional)

If needed, you can add default documents, but Next.js handles routing internally via `server.js`.

## Post-Configuration Steps

### After Saving Configuration:

1. **Wait for Restart**: App Service will restart (takes 1-2 minutes)

2. **Verify Settings Applied**:
   - Go to **SSH** (under Development Tools)
   - Run: `printenv | grep -E "NODE|SENDGRID"`
   - Should see all your environment variables

3. **Check Node Version**:
   ```bash
   node --version
   ```
   Should show v18.x.x or v20.x.x

4. **Test Application**:
   - Visit: `https://your-app.azurewebsites.net`
   - Should see the landing page

## Optional Performance Settings

### 5. Scale Up (App Service Plan)

Navigate to: **Azure Portal → Your App Service → Scale up (App Service plan)**

Recommended for production:
- **Minimum**: B1 Basic (1 core, 1.75 GB RAM) - $54.75/month
- **Better**: S1 Standard (1 core, 1.75 GB RAM, Always On) - $69.35/month
- **Production**: P1V2 Premium (1 core, 3.5 GB RAM, better performance) - $146/month

### 6. Scale Out (if needed)

Navigate to: **Azure Portal → Your App Service → Scale out (App Service plan)**

For higher traffic:
- Add more instances (2-3 for high availability)

### 7. Monitoring

#### Enable Application Insights:
- Navigate to **Application Insights** (under Settings)
- Click **Turn on Application Insights**
- Creates real-time monitoring, error tracking, performance metrics

#### Enable Logs:
Navigate to: **App Service logs** (under Monitoring)

Enable:
- **Application Logging (Filesystem)**: Verbose
- **Web server logging**: File System
- **Detailed error messages**: On
- **Failed request tracing**: On

## Configuration Verification Checklist

Before uploading files, verify these are configured:

- [ ] Node.js version set to 18 LTS or higher
- [ ] Startup command: `node server.js`
- [ ] Always On: Enabled (if on Standard tier or higher)
- [ ] `NODE_ENV=production` set in Application settings
- [ ] `WEBSITE_NODE_DEFAULT_VERSION=18-lts` set
- [ ] SendGrid API key added to Application settings
- [ ] SendGrid email settings configured
- [ ] Platform set to 64 Bit
- [ ] Configuration saved (app restarted)
- [ ] Settings verified via SSH

## Common Configuration Issues

### Issue: App keeps restarting
**Solution**: Check Application Logs for errors. Usually missing environment variables or wrong Node version.

### Issue: 500 Internal Server Error
**Solution**:
1. Verify `web.config` exists in `/home/site/wwwroot/`
2. Check startup command is `node server.js`
3. Check Application Logs

### Issue: Environment variables not working
**Solution**:
1. Verify saved in Application settings (not just added)
2. Restart app manually: Overview → Restart
3. Check via SSH: `printenv`

### Issue: File uploads failing
**Solution**:
1. Ensure `WEBSITE_RUN_FROM_PACKAGE=0` (allows file writes)
2. Create data directories with correct permissions:
   ```bash
   cd /home/site/wwwroot/data
   mkdir -p applications resumes
   chmod 755 applications resumes
   ```

## Accessing Azure SSH

To verify configuration or troubleshoot:

1. Azure Portal → Your App Service
2. Click **SSH** (under Development Tools)
3. Opens web-based terminal

Useful commands:
```bash
# Check environment variables
printenv | grep NODE
printenv | grep SENDGRID

# Check Node version
node --version

# Check file structure
cd /home/site/wwwroot
ls -la

# Check data directories
ls -la data/

# View logs
cd /home/LogFiles
ls -la
tail -f application/stdout.log
```

## Security Best Practices

1. **Never commit API keys** - Use Azure Application Settings only
2. **Use Managed Identity** - Consider for Azure service connections
3. **Enable HTTPS only** - Configuration → TLS/SSL settings → HTTPS Only: On
4. **Keep Node.js updated** - Regularly update to latest LTS version
5. **Monitor Application Insights** - Set up alerts for errors

## Next Steps After Configuration

1. Upload files via FTP (see AZURE_DEPLOYMENT_GUIDE.md)
2. Create data directories via SSH
3. Test application functionality
4. Monitor logs for any errors
5. Set up custom domain (if needed)
6. Configure SSL certificate (if using custom domain)

## Quick Reference URLs

- **Azure Portal**: https://portal.azure.com
- **Your App URL**: https://your-app-name.azurewebsites.net
- **Azure Documentation**: https://docs.microsoft.com/azure/app-service/
- **Node.js on Azure**: https://docs.microsoft.com/azure/app-service/configure-language-nodejs

---

**Note**: Replace `your-app-name` with your actual Azure App Service name throughout this guide.
