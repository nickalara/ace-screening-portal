# Azure Government Deployment Configuration

## Overview
This project is configured for automatic deployment from GitHub to Azure Government cloud using Azure App Service's built-in deployment system (Kudu/Oryx).

**Note:** GitHub Actions are NOT available in Azure Government, so we use Azure's native GitHub integration instead.

## Configuration Files

### `.deployment`
Tells Azure to run the build process during deployment:
```
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### `.azure/config`
Contains Azure CLI configuration for the project (resource group, location, web app name).

### `deploy.sh`
Optional deployment script that Azure Oryx can use. The script:
- Runs `npm ci` to install dependencies
- Runs `npm run build` to build the Next.js application

## Verifying Webhook Configuration

If deployments are not triggering automatically when you push to GitHub, verify the webhook:

### Step 1: Check Azure Portal
1. Navigate to your App Service in Azure Portal
2. Go to **Deployment Center**
3. Verify:
   - Source is set to **GitHub**
   - Repository and branch are correct
   - Connection status shows as **Connected**

### Step 2: Check GitHub Webhook
1. Go to your GitHub repository
2. Navigate to **Settings** → **Webhooks**
3. Look for a webhook with URL pattern: `https://<your-app>.scm.azurewebsites.us/deploy`
4. Verify:
   - ✅ Green checkmark (recent deliveries successful)
   - SSL verification is enabled
   - Content type: `application/json`
   - Events: "Just the push event" is selected

### Step 3: Test Webhook
1. In GitHub webhook settings, click on the webhook
2. Go to **Recent Deliveries** tab
3. Click **Redeliver** on the most recent delivery
4. Check the Response tab for any errors

### Step 4: Manual Trigger (Troubleshooting)
If webhook is not working, you can manually trigger deployment:

**Option A: Azure Portal**
1. Go to Deployment Center
2. Click **Sync** to manually pull latest from GitHub

**Option B: Azure CLI**
```bash
az webapp deployment source sync \
  --name ace-screening-portal \
  --resource-group ace-screening-portal
```

## Common Issues

### Issue: Webhook not triggering deployments
**Causes:**
- Webhook was deleted or misconfigured
- Azure service principal lost GitHub access
- Network/firewall blocking webhook calls to Azure Government

**Solutions:**
1. Disconnect and reconnect GitHub in Deployment Center
2. Verify no GitHub organization policies blocking webhooks
3. Check Azure deployment logs for errors

### Issue: Build fails during deployment
**Check:**
- Azure deployment logs: Portal → Deployment Center → Logs
- Kudu console: `https://<your-app>.scm.azurewebsites.us`
- Environment variables are set correctly
- Node.js version matches (verify in package.json engines)

### Issue: App builds but doesn't start
**Check:**
- Start command is correct (should be `npm start` for Next.js)
- Port binding (Azure uses PORT environment variable)
- Application settings in Azure Portal

## Deployment Process Flow

1. **Push to GitHub** → Triggers webhook
2. **Webhook calls Azure** → Starts deployment
3. **Azure Kudu/Oryx** → Detects Node.js app
4. **Build phase** → Runs `npm ci` and `npm run build`
5. **Deploy phase** → Copies built files to wwwroot
6. **Start app** → Runs `npm start`

## Useful Commands

### View deployment logs
```bash
az webapp log tail --name ace-screening-portal --resource-group ace-screening-portal
```

### View deployment history
```bash
az webapp deployment list --name ace-screening-portal --resource-group ace-screening-portal
```

### Force redeploy current commit
```bash
az webapp deployment source sync \
  --name ace-screening-portal \
  --resource-group ace-screening-portal
```

## Next Steps After Pushing This Branch

1. Push this branch to GitHub
2. Create a Pull Request and merge to main
3. Monitor deployment in Azure Portal → Deployment Center → Logs
4. If deployment doesn't trigger automatically:
   - Verify webhook exists in GitHub
   - Click "Sync" in Azure Deployment Center
   - Check webhook delivery status in GitHub
5. Once successful, future pushes to main should auto-deploy

## Resources

- [Azure App Service deployment docs](https://docs.microsoft.com/azure/app-service/deploy-continuous-deployment)
- [Oryx build system](https://github.com/microsoft/Oryx)
- [Next.js on Azure](https://docs.microsoft.com/azure/app-service/quickstart-nodejs)
