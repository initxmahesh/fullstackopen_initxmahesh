# Azure Deployment Guide for Phonebook Server

This guide explains how to deploy the phonebook server to Azure App Service.

## Prerequisites

1. Azure subscription
2. GitHub repository with the phonebook server code
3. Azure CLI (optional for manual deployment)

## Deployment Method 1: GitHub Actions (Recommended)

The repository is already configured with GitHub Actions for automatic deployment to Azure App Service.

### Configuration Files

- **`.github/workflows/main_phone-test.yml`**: GitHub Actions workflow for automatic deployment
- **`web.config`**: IIS configuration for Azure App Service (Windows)
- **`package.json`**: Updated with Node.js engine requirements and Azure-specific scripts

### Deployment Process

1. **Automatic Deployment**: Push changes to the `main` branch
2. **Manual Deployment**: Go to GitHub Actions tab and run "Build and deploy Node.js app to Azure Web App - phone-test"

### Environment Variables

The following environment variables are automatically configured in Azure:
- `PORT`: Set by Azure App Service
- `NODE_ENV`: Should be set to "production" in Azure App Service configuration

### Azure App Service Settings

In your Azure App Service, ensure the following settings:
- **Runtime stack**: Node.js 18 LTS
- **Startup command**: `npm start` (or leave empty to use package.json default)

## Deployment Method 2: Manual Deployment

### Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group (if not exists)
az group create --name phonebook-rg --location "East US"

# Create App Service plan
az appservice plan create --name phonebook-plan --resource-group phonebook-rg --sku B1 --is-linux

# Create web app
az webapp create --resource-group phonebook-rg --plan phonebook-plan --name your-phonebook-app --runtime "NODE|18-lts"

# Deploy from local git
az webapp deployment source config-local-git --name your-phonebook-app --resource-group phonebook-rg

# Get deployment URL
az webapp deployment list-publishing-credentials --name your-phonebook-app --resource-group phonebook-rg
```

### Deploy Code

```bash
# Add Azure remote
git remote add azure <deployment-url>

# Deploy to Azure
git push azure main
```

## API Endpoints

Once deployed, your Azure app will expose the following endpoints:

- `GET /api/persons` - Get all persons
- `GET /api/persons/:id` - Get person by ID
- `POST /api/persons` - Add new person
- `PUT /api/persons/:id` - Update person
- `DELETE /api/persons/:id` - Delete person
- `GET /info` - Get phonebook info
- `GET /health` - Health check endpoint

## Health Monitoring

The server includes a `/health` endpoint that provides:
- Server status
- Uptime
- Environment information
- Application version

## Environment Configuration

### Azure App Service Configuration

Set the following in Azure App Service Configuration:

```
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=18-lts
```

### Optional Environment Variables

- `PORT`: Automatically set by Azure (usually 80 or 8080)
- Any additional configuration variables your app needs

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that Node.js version matches package.json engines
2. **Startup Issues**: Verify startup command in Azure App Service
3. **CORS Issues**: Ensure CORS is properly configured for your frontend domain

### Logs

View application logs in Azure:
```bash
az webapp log tail --name your-phonebook-app --resource-group phonebook-rg
```

Or use the Azure Portal:
1. Go to your App Service
2. Navigate to "Monitoring" > "Log stream"
3. View real-time logs

## Security Considerations

1. **Environment Variables**: Store sensitive data in Azure App Service Configuration
2. **HTTPS**: Azure App Service provides HTTPS by default
3. **Authentication**: Consider adding authentication for production use
4. **CORS**: Configure CORS properly for your frontend domain

## Performance Optimization

1. **Node.js Version**: Use LTS version for better stability
2. **Compression**: Consider adding compression middleware
3. **Caching**: Implement caching for frequently accessed data
4. **Database**: Consider moving from in-memory storage to a database for production

## Cost Optimization

1. **App Service Plan**: Choose appropriate tier based on usage
2. **Auto-scaling**: Configure auto-scaling rules
3. **Monitoring**: Use Azure Monitor to track usage and costs