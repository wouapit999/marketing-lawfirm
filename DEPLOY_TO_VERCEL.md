# Deploy to Vercel - Quick Start (5 Minutes)

Your app is ready to deploy! Follow these simple steps.

## Prerequisites

- Vercel account (create at https://vercel.com with awouapit@gmail.com)
- Node.js installed
- GitHub repository (already done ✅)

## Option A: Deploy via Vercel Web Dashboard (Easiest)

### Step 1: Create Vercel Account
1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Email: awouapit@gmail.com
5. Verify email

### Step 2: Import Project

1. In Vercel dashboard, click **Add New** → **Project**
2. Click **Import Git Repository**
3. Search for: `marketing-lawfirm`
4. Click **Import**

### Step 3: Configure Project

**Project Name**: `marketing-lawfirm` (or customize)

**Framework Preset**: Select **Next.js**

**Root Directory**: Click **Edit** and select `frontend`

**Build Settings**: Keep defaults
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables**: Click **Add**
- Name: `NEXT_PUBLIC_API_URL`
- Value: `http://localhost:3001` (for now, update later)

### Step 4: Deploy

Click **Deploy** and wait ~2-3 minutes

✅ **Your app is live!**

**URL**: https://marketing-lawfirm.vercel.app (example)

---

## Option B: Deploy via Vercel CLI (Advanced)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login --email awouapit@gmail.com
```

### Step 3: Navigate to Frontend Directory

```bash
cd C:\Users\wouap\lawfirm-hub\frontend
```

### Step 4: Deploy

```bash
# First deployment (interactive)
vercel

# When asked:
# - Set up and deploy? → Yes
# - Which scope? → Your account
# - Project name? → marketing-lawfirm
# - Detected Next.js? → Yes
# - Build settings? → Use defaults
# - Auto-deploy on push? → Yes
```

### Step 5: Production Deployment

```bash
# Deploy to production
vercel --prod
```

---

## After Deployment

### 1. Test Your App

1. **Go to your Vercel URL**: https://marketing-lawfirm.vercel.app (example)
2. **Test pages**:
   - Home page loads ✅
   - Navigation works ✅
   - Try `/posts/create` ✅
   - Try clicking "Generate with AI" ✅

### 2. Configure Environment Variables

**If API calls fail** (e.g., 404 on /api/ai/generate):

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add: `NEXT_PUBLIC_API_URL`
5. Value: Your backend URL (see below)
6. Click **Save**
7. Click **Redeploy** (top right)

### 3. Set Up Backend (Optional)

If you want AI generation working, deploy backend too:

**Quick Option: Use Render.com**

1. Go to: https://render.com/
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure for NestJS (see VERCEL_DEPLOYMENT_GUIDE.md)
5. Get your backend URL
6. Update `NEXT_PUBLIC_API_URL` in Vercel with this URL

**Alternative**: Deploy backend to Railway, Heroku, or AWS

---

## Important Files Created

For reference:
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude
- `VERCEL_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `DEPLOY_TO_VERCEL.md` - This file

---

## Common Issues & Fixes

### Issue: Build Fails with "Module not found"

**Error**: `Cannot find module 'react'`

**Fix**: Vercel is looking in wrong directory
1. Go to **Settings** → **Build & Development Settings**
2. Set **Root Directory** to `frontend`
3. Click **Save**
4. Redeploy

### Issue: Environment Variables Not Working

**Error**: `NEXT_PUBLIC_API_URL is undefined`

**Fix**:
1. In Vercel, go to **Environment Variables**
2. Add the variable (make sure it starts with `NEXT_PUBLIC_`)
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** (not just rebuild)
5. Wait for new deployment to complete

### Issue: API Calls Return 404

**Error**: `GET /api/ai/generate 404`

**Fix**: Backend isn't deployed
- Deploy backend to Render/Railway first
- Get backend URL (e.g., `https://api.onrender.com`)
- Update `NEXT_PUBLIC_API_URL` in Vercel environment
- Redeploy frontend

### Issue: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS`

**Fix**: Backend CORS configuration
1. Update backend `.env`:
   ```env
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
2. Restart backend
3. Test in frontend

---

## Verify Deployment

Run these checks:

```
✅ App loads at https://marketing-lawfirm.vercel.app
✅ Navigation works (click links)
✅ Pages render without 404s
✅ Console has no errors (F12 → Console)
✅ Environment variables set (if API needed)
✅ API calls work (if backend deployed)
✅ Generate with AI works (if backend deployed)
```

---

## Environment Variables Reference

### Frontend Environment (Set in Vercel)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_NAME=Marketing LawFirm
```

**Must start with `NEXT_PUBLIC_`** to be visible to browser.

### Backend Environment (Set in backend deployment service)

```env
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=random-secret-key
DB_HOST=db.example.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=lawfirm_hub
REDIS_HOST=redis.example.com
REDIS_PORT=6379
FRONTEND_URL=https://marketing-lawfirm.vercel.app
```

---

## Next Steps

### Immediate (Now)
1. [ ] Deploy frontend to Vercel ✅
2. [ ] Test app loads
3. [ ] Share URL with team

### This Week
1. [ ] Deploy backend (Render/Railway)
2. [ ] Set up production database
3. [ ] Get custom domain (optional)
4. [ ] Configure monitoring

### This Month
1. [ ] Optimize performance
2. [ ] Set up CI/CD alerts
3. [ ] Monitor costs
4. [ ] Gather user feedback

---

## Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Create Vercel account | 2 min | ⏭️ Do now |
| Import GitHub repo | 1 min | ⏭️ Do now |
| Configure & deploy | 2 min | ⏭️ Do now |
| App is live | - | 🎉 5 min total |
| Deploy backend | 10 min | ⏭️ Optional |
| Set up domain | 24 hours | ⏭️ Optional |

---

## Your Deployment URLs

After deployment, you'll have:

```
Frontend (Vercel):  https://marketing-lawfirm.vercel.app
GitHub:             https://github.com/wouapit999/marketing-lawfirm
Dashboard:          https://vercel.com/dashboard
Logs:               https://vercel.com/dashboard/[project]/deployments
Settings:           https://vercel.com/dashboard/[project]/settings
```

---

## Support

### If Something Goes Wrong

1. **Check build logs**: Vercel dashboard → Deployments → Latest → Details
2. **Check environment variables**: Settings → Environment Variables
3. **Check root directory**: Settings → Build & Development Settings
4. **Try rebuilding**: Click "Redeploy" button
5. **Read the guide**: VERCEL_DEPLOYMENT_GUIDE.md

### Quick Help

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: https://github.com/wouapit999/marketing-lawfirm/issues

---

## Success Checklist

Once deployed, you should have:

- ✅ App running at vercel.app URL
- ✅ GitHub connected to Vercel
- ✅ Auto-deploy on push working
- ✅ Environment variables configured
- ✅ Custom domain (optional)
- ✅ CI/CD pipeline active
- ✅ Monitoring enabled
- ✅ Team invited (if needed)

---

**Your app is now live on Vercel!** 🚀

**Next**: Optionally deploy backend to continue using AI features.

See `VERCEL_DEPLOYMENT_GUIDE.md` for full configuration options.
