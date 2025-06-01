#!/bin/bash

# MEAN Stack Deployment Script for Google Cloud Platform
# Make sure you have gcloud CLI and Firebase CLI installed

echo "🚀 Starting MEAN Stack Deployment to GCP..."

# Step 1: Build the API
echo "📦 Building NestJS API..."
npx nx build api

if [ $? -ne 0 ]; then
    echo "❌ API build failed!"
    exit 1
fi

# Step 2: Deploy to Cloud Run
echo "☁️ Deploying API to Cloud Run..."
echo "Please replace YOUR_PROJECT_ID with your actual GCP project ID"
echo "Please replace YOUR_MONGODB_URI and YOUR_JWT_SECRET with your actual values"
echo ""
echo "Run this command manually:"
echo "gcloud run deploy penny-auth-api \\"
echo "  --source . \\"
echo "  --platform managed \\"
echo "  --region us-central1 \\"
echo "  --allow-unauthenticated \\"
echo "  --set-env-vars MONGODB_URI=\"YOUR_MONGODB_URI\",JWT_SECRET=\"YOUR_JWT_SECRET\",PORT=3000"
echo ""

# Step 3: Build Angular app
echo "📦 Building Angular app for production..."
npx nx build web --configuration=production

if [ $? -ne 0 ]; then
    echo "❌ Angular build failed!"
    exit 1
fi

# Step 4: Firebase deployment instructions
echo "🔥 Firebase Hosting deployment instructions:"
echo "1. Update web/src/environments/environment.prod.ts with your Cloud Run URL"
echo "2. Rebuild the Angular app: npx nx build web --configuration=production"
echo "3. Run: firebase login"
echo "4. Run: firebase init hosting (if not already done)"
echo "5. Run: firebase deploy"
echo ""
echo "✅ Deployment preparation complete!"
echo "📝 Don't forget to update the environment.prod.ts file with your actual Cloud Run URL"