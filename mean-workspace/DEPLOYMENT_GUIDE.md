# 🚀 MEAN Stack Deployment Guide - Google Cloud Platform

This guide will help you deploy your MEAN stack application to Google Cloud Platform using Cloud Run (backend) and Firebase Hosting (frontend).

## Prerequisites

1. **Google Cloud Account** ✅ (You mentioned it's ready)
2. **Google Cloud CLI** - Install from: https://cloud.google.com/sdk/docs/install
3. **Firebase CLI** - Install with: `npm install -g firebase-tools`
4. **Docker** (optional, Cloud Run can build from source)

## 🔧 Setup Steps

### 1. Initialize Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create YOUR_PROJECT_ID

# Set the project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Deploy Backend to Cloud Run

```bash
# Build the API first
npx nx build api

# Deploy to Cloud Run (replace with your actual values)
gcloud run deploy penny-auth-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="mongodb+srv://96as:d70o0my55@mean-workspace.1qac4bb.mongodb.net/penny-auth?retryWrites=true&w=majority&appName=MEAN-Workspace",JWT_SECRET="your-super-secret-jwt-key-change-in-production",PORT=3000
```

**Important:** After deployment, note the Cloud Run URL (something like: `https://penny-auth-api-xxx-uc.a.run.app`)

### 3. Update Frontend Configuration

Update `web/src/environments/environment.prod.ts` with your Cloud Run URL:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_ACTUAL_CLOUD_RUN_URL/api'
};
```

### 4. Deploy Frontend to Firebase Hosting

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not done already)
firebase init hosting
# Choose:
# - Use an existing project or create new
# - Set public directory to: dist/web
# - Configure as single-page app: Yes
# - Set up automatic builds: No

# Build Angular app for production
npx nx build web --configuration=production

# Deploy to Firebase
firebase deploy
```

## 🎯 Quick Deployment (Using the Script)

Run the deployment preparation script:

```bash
./deploy.sh
```

Then follow the manual steps it outputs.

## 🔍 Testing Your Deployment

1. **Test API**: Visit your Cloud Run URL in browser
2. **Test Frontend**: Visit your Firebase Hosting URL
3. **Test Integration**: Try registering/logging in through the frontend

## 📝 Important Notes

- **Environment Variables**: Your MongoDB credentials are included in the deployment command above
- **CORS**: Should work automatically with Cloud Run
- **HTTPS**: Both services provide HTTPS by default
- **Scaling**: Both services auto-scale based on traffic

## 🔒 Security Considerations

- Change the JWT secret in production
- Consider using Google Secret Manager for sensitive data
- Review MongoDB Atlas IP whitelist settings
- Enable Cloud Run authentication if needed

## 💰 Cost Optimization

- Both services have generous free tiers
- Cloud Run: Pay per request
- Firebase Hosting: Free for reasonable usage

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**: Ensure `npx nx build api` works locally
2. **CORS Errors**: Check your NestJS CORS configuration
3. **Database Connection**: Verify MongoDB Atlas connection string
4. **Environment Variables**: Double-check all environment variables

### Useful Commands:

```bash
# Check Cloud Run logs
gcloud run services logs read penny-auth-api --region=us-central1

# Check Firebase hosting status
firebase hosting:channel:list

# Redeploy after changes
gcloud run deploy penny-auth-api --source .
firebase deploy
```

## 🎉 Success!

Once deployed, you'll have:
- ✅ NestJS API running on Cloud Run
- ✅ Angular app on Firebase Hosting
- ✅ MongoDB Atlas integration
- ✅ HTTPS enabled
- ✅ Auto-scaling enabled

Your application will be live and accessible worldwide! 🌍