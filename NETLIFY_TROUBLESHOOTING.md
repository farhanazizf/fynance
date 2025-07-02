# Netlify Deployment Troubleshooting Guide for FYnance

## 🚨 Build Failure Solutions

### Error: "build.command" failed with exit code 127

This error typically indicates that the build command cannot be found or executed. Here are the solutions:

### Solution 1: Verify Environment Variables in Netlify Dashboard

1. **Go to Netlify Dashboard** → Your Site → Site settings → Environment variables
2. **Add ALL Firebase environment variables**:

   ```
   VITE_FIREBASE_API_KEY = AIzaSyAAFSTcYtDXQexmLVD2vTpslRbDrG8xxkk
   VITE_FIREBASE_AUTH_DOMAIN = fynance-f9226.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = fynance-f9226
   VITE_FIREBASE_STORAGE_BUCKET = fynance-f9226.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID = 270458736409
   VITE_FIREBASE_APP_ID = 1:270458736409:web:75603607822e4fb9567f88
   VITE_FIREBASE_MEASUREMENT_ID = G-71YY894H5V
   ```

3. **Click "Save"** and **redeploy**

### Solution 2: Alternative Build Commands

If the current build command fails, try these alternatives in `netlify.toml`:

**Option A: Simple build**

```toml
[build]
  command = "npm install && npm run build:ci"
  publish = "dist"
```

**Option B: Force clean install**

```toml
[build]
  command = "rm -rf node_modules && npm install && npm run build:ci"
  publish = "dist"
```

**Option C: Use yarn instead**

```toml
[build]
  command = "yarn install && yarn build:ci"
  publish = "dist"
```

### Solution 3: Manual Build and Deploy

If automatic builds continue to fail:

1. **Build locally**:

   ```bash
   # Ensure environment variables are set
   npm run build:ci
   ```

2. **Manual deploy**:
   - Go to Netlify Dashboard
   - Drag and drop the `dist` folder
   - Add environment variables in site settings

### Solution 4: Debug Build Process

1. **Check build logs** in Netlify Dashboard for specific error messages
2. **Common issues**:
   - Missing environment variables
   - Node.js version mismatch
   - Missing dependencies
   - TypeScript compilation errors

### Solution 5: Alternative netlify.toml Configuration

Replace your current `netlify.toml` with this minimal version:

```toml
[build]
  command = "npm ci && npm run build:ci"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔧 Environment Variables Setup

### Required Variables (ALL must be set in Netlify):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### How to Add in Netlify:

1. Site Dashboard → Site settings → Environment variables
2. Click "Add variable"
3. Add each variable with exact name and value
4. Save and redeploy

## 🚀 Alternative Deployment Methods

### Method 1: GitHub Integration

1. Push your code to GitHub
2. Connect Netlify to your GitHub repo
3. Set build command: `npm run build:ci`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build locally
npm run build:ci

# Deploy
netlify deploy --prod --dir=dist
```

### Method 3: Manual Deploy

```bash
# Build locally with environment variables
npm run build:ci

# Go to Netlify Dashboard and drag/drop the dist folder
```

## 📝 Pre-Deployment Checklist

- [ ] All environment variables are set in Netlify Dashboard
- [ ] Build works locally: `npm run build:ci`
- [ ] `dist` folder is generated successfully
- [ ] Firebase configuration is correct
- [ ] `netlify.toml` is in project root
- [ ] Node.js version is set to 18 in Netlify

## 🐛 Common Errors and Fixes

### "Cannot find module" errors

- Solution: Delete `node_modules`, run `npm install`
- Check if all dependencies are in `package.json`

### TypeScript compilation errors

- Solution: Run `npm run build:ci` instead of `npm run build`
- This skips TypeScript type checking

### Environment variable not found

- Solution: Ensure all `VITE_` prefixed variables are set in Netlify
- Variables must match exactly (case-sensitive)

### Build timeout

- Solution: Increase build timeout in Netlify settings
- Or optimize build process

## 🆘 Emergency Deploy Method

If all else fails, use this emergency deployment:

1. **Create a simple build script**:

   ```json
   // package.json
   "scripts": {
     "emergency-build": "vite build --mode production"
   }
   ```

2. **Update netlify.toml**:

   ```toml
   [build]
     command = "npm install && npm run emergency-build"
     publish = "dist"
   ```

3. **Test locally first**:

   ```bash
   npm run emergency-build
   ```

4. **Deploy manually** if build works locally

## 📞 Need Help?

1. Check Netlify build logs for specific error messages
2. Test the exact same build command locally
3. Verify all environment variables are set
4. Try the emergency deploy method above

The build should work - we tested it locally successfully! The issue is likely with environment variable configuration or build environment in Netlify.
