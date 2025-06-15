# GitHub Deployment Guide

## Before Pushing to GitHub

1. **Verify .env is in .gitignore**
   - The `.env` file should not be committed to version control
   - Check that `.gitignore` includes `.env`

2. **Include .env.example**
   - The `.env.example` file shows the required environment variables
   - This helps other developers set up the project

3. **API Keys Required**
   ```
   NEWSDATA_API_KEY - Get from https://newsdata.io/
   OPENTRIPMAP_API_KEY - Get from https://opentripmap.io/
   FOURSQUARE_API_KEY - Get from https://developer.foursquare.com/
   GEMINI_API_KEY - Get from https://ai.google.dev/
   ```

## Setup for New Developers

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Add your API keys to the `.env` file
5. Run `npm start`

## Building APK

To build the final APK:
```bash
# Login to Expo (one time setup)
eas login

# Build preview APK
npm run build:android

# Build production APK
npm run build:android:production
```

## Security Checklist ✅

- [x] API keys moved to environment variables
- [x] .env file added to .gitignore
- [x] .env.example provided for setup reference
- [x] Babel configured for react-native-dotenv
- [x] All hardcoded keys removed from source code
- [x] Debug and test files with keys removed
