# Full Stack Deployment - Quick Reference

Fast checklist for deploying Marketing LawFirm to production.

**Total Time: 30-40 minutes**

## Overview

```
Phase 1 (5 min):  Deploy Frontend to Vercel
Phase 2 (15 min): Deploy Backend to Render + Database
Phase 3 (5 min):  Connect Frontend → Backend
Phase 4 (5 min):  Test Everything
```

---

## ⚡ Phase 1: Frontend to Vercel (5 minutes)

### 1. Create Vercel Account
- Go to: https://vercel.com/signup
- GitHub login
- Email: `awouapit@gmail.com`
- Verify email ✅

### 2. Deploy Frontend
- Vercel Dashboard → **Add New** → **Project**
- Search: `marketing-lawfirm`
- Click **Import**

### 3. Configure
- **Root Directory**: `frontend` ✅
- Other settings: auto-filled
- **Environment Variable**:
  - Name: `NEXT_PUBLIC_API_URL`
  - Value: `http://localhost:3001` (temporary)

### 4. Deploy!
- Click **Deploy**
- Wait 2-3 minutes
- ✅ Your app is live!

**Frontend URL**: `https://marketing-lawfirm.vercel.app` (example)

---

## ⚡ Phase 2: Backend + Database (15 minutes)

### 1. Create Render Account
- Go to: https://render.com
- GitHub login
- Accept permissions ✅

### 2. Create PostgreSQL Database
- **New** → **PostgreSQL**
- **Name**: `marketing-lawfirm-db`
- **Database**: `lawfirm_hub`
- **User**: `postgres`
- **Region**: Pick closest
- **Type**: Free (testing) or Starter (production)
- Click **Create**
- ⏳ Wait 2-3 minutes until "Available"
- **Save connection details** (you'll need them):
  ```
  Host: db.render.com (example)
  Port: 5432
  User: postgres
  Password: (from dashboard)
  Database: lawfirm_hub
  ```

### 3. Create Redis Cache (Optional but Recommended)
- **New** → **Redis**
- **Name**: `marketing-lawfirm-redis`
- **Region**: Same as database
- **Type**: Free
- Click **Create**
- ⏳ Wait 1-2 minutes until "Available"
- **Save connection details**

### 4. Create Backend Service
- **New** → **Web Service**
- Select: `marketing-lawfirm` repository
- Click **Connect**

### 5. Configure Backend
Set these in the configuration form:

```
Name:           marketing-lawfirm-api
Runtime:        Node
Build Command:  cd backend && npm install && npm run build
Start Command:  cd backend && npm run start:prod
Instance Type:  Free (testing) or Starter (production)
```

### 6. Add Environment Variables

Click **Advanced** → Add each variable:

**Critical Variables:**
```
NODE_ENV                = production
PORT                    = 3001
ANTHROPIC_API_KEY       = sk-ant-... (your key)
JWT_SECRET              = (generate: copy output from next step)
FRONTEND_URL            = https://marketing-lawfirm.vercel.app
```

**Database Variables** (from Step 2):
```
DB_HOST                 = db.render.com (from PostgreSQL dashboard)
DB_PORT                 = 5432
DB_USER                 = postgres
DB_PASSWORD             = (password from PostgreSQL dashboard)
DB_NAME                 = lawfirm_hub
```

**Redis Variables** (if using - from Step 3):
```
REDIS_HOST              = redis.onrender.com (from Redis dashboard)
REDIS_PORT              = (from Redis dashboard)
REDIS_PASSWORD          = (if required, from Redis dashboard)
```

### 7. Generate JWT_SECRET

In PowerShell:
```powershell
# Option 1: Use OpenSSL (if installed)
openssl rand -hex 32

# Option 2: Generate random string online
# https://generate-random.org/
# Then use that string
```

Copy the output and paste in environment variable `JWT_SECRET`

### 8. Deploy!
- Click **Create Web Service**
- ⏳ Wait 5-10 minutes
- Look for: "Your service is live"
- ✅ Backend deployed!

**Backend URL**: `https://marketing-lawfirm-api.onrender.com` (example)

---

## ⚡ Phase 3: Connect Frontend to Backend (5 minutes)

### 1. Update Frontend Environment Variable
- Go to **Vercel Dashboard**
- Select **marketing-lawfirm** project
- Go to **Settings** → **Environment Variables**
- Click on `NEXT_PUBLIC_API_URL`
- Change value to: `https://marketing-lawfirm-api.onrender.com`
- Click **Save**

### 2. Redeploy Frontend
- Go to **Deployments** tab
- Click **Redeploy** (top right)
- Confirm
- ⏳ Wait 2-3 minutes
- ✅ Frontend updated!

---

## ⚡ Phase 4: Test Everything (5 minutes)

### 1. Test Frontend Loads
- Visit: `https://marketing-lawfirm.vercel.app`
- Page should load ✅
- Open DevTools (F12) → Console
- Should have no red errors ✅

### 2. Test AI Generation
- Go to `/posts/create` page
- Click **"Generate with AI"**
- Fill form:
  ```
  Content Type: Educational
  Tone: Professional
  Topic: DUI Defense Strategies
  Platforms: Facebook, LinkedIn
  ```
- Click **Generate Content**
- Should see content streaming in real-time ✅
- Final result displays ✅

### 3. Check Backend Logs (if error)
- Render Dashboard → Service → **Logs**
- Look for errors
- Check environment variables if issues

### 4. All Tests Pass? 🎉
- ✅ Frontend loads
- ✅ Navigation works
- ✅ No console errors
- ✅ AI generation works
- ✅ Content streams
- ✅ You're done!

---

## 📋 Environment Variables Checklist

### Vercel (Frontend)
```
☐ NEXT_PUBLIC_API_URL = https://your-backend-url.onrender.com
```

### Render (Backend)

**Must Have:**
```
☐ NODE_ENV = production
☐ PORT = 3001
☐ ANTHROPIC_API_KEY = sk-ant-...
☐ JWT_SECRET = (generated random string)
☐ FRONTEND_URL = https://marketing-lawfirm.vercel.app
```

**Database:**
```
☐ DB_HOST = (from PostgreSQL dashboard)
☐ DB_PORT = 5432
☐ DB_USER = postgres
☐ DB_PASSWORD = (from PostgreSQL dashboard)
☐ DB_NAME = lawfirm_hub
```

**Redis (Optional):**
```
☐ REDIS_HOST = (from Redis dashboard)
☐ REDIS_PORT = (from Redis dashboard)
☐ REDIS_PASSWORD = (if required)
```

---

## 🔗 Links You'll Need

### Creation & Setup
```
Vercel Signup:      https://vercel.com/signup
Render Signup:      https://render.com
Anthropic API:      https://console.anthropic.com
Random Generator:   https://generate-random.org
```

### Dashboards
```
Vercel:             https://vercel.com/dashboard
Render:             https://dashboard.render.com
Your Frontend:      https://marketing-lawfirm.vercel.app
Your Backend:       https://marketing-lawfirm-api.onrender.com
```

### Your Repo
```
GitHub:             https://github.com/wouapit999/marketing-lawfirm
```

---

## ⚠️ Common Issues & Fixes

### Build Fails on Vercel
```
Error: Cannot find module
Fix: Go to Settings → Build & Development Settings
     Set Root Directory to: frontend
```

### Environment Variables Not Working
```
Error: NEXT_PUBLIC_API_URL is undefined
Fix: Click "Redeploy" (not just rebuild)
     Wait for full deployment
     Hard refresh: Ctrl+Shift+R
```

### Backend Can't Connect to Database
```
Error: Connection refused / Authentication failed
Fix: Check DB_HOST, DB_USER, DB_PASSWORD in Render
     Verify PostgreSQL dashboard shows "Available"
     Test connection string manually
```

### API Returns 404
```
Error: GET /api/ai/generate 404
Fix: Verify backend service shows "Running"
     Check FRONTEND_URL is set correctly in Render
     Verify CORS is enabled
     Check backend logs
```

### CORS Error in Browser
```
Error: Access to XMLHttpRequest blocked by CORS policy
Fix: Update FRONTEND_URL in Render with correct URL
     Restart backend service
     Check backend enableCors configuration
```

---

## 📊 Costs

### Free Tier (for Testing)
```
Vercel:     $0   (free tier works fine)
Render:     $0   (free tier, may sleep)
Database:   $0   (512MB free)
Redis:      $0   (limited free)
API Usage:  ~$0  (if testing only)
---
TOTAL:      ~$0/month
```

### Production Tier (Recommended)
```
Vercel:     $20+ (optional, hobby tier free)
Render:     $7   (Starter, always on)
Database:   $15  (100GB storage)
Redis:      $6   (500MB)
API Usage:  ~$12 (typical usage)
---
TOTAL:      ~$60/month
```

---

## ✅ Success Checklist

Phase 1 (Frontend):
- [ ] Vercel account created
- [ ] Project imported
- [ ] Root directory set to frontend
- [ ] Environment variable added
- [ ] Build successful
- [ ] App loads without errors

Phase 2 (Backend):
- [ ] Render account created
- [ ] PostgreSQL created and available
- [ ] Redis created (optional)
- [ ] All environment variables added
- [ ] Service deployed
- [ ] Service shows "Running"

Phase 3 (Connect):
- [ ] Frontend NEXT_PUBLIC_API_URL updated
- [ ] Frontend redeployed
- [ ] No CORS errors

Phase 4 (Test):
- [ ] Frontend loads at vercel.app
- [ ] Navigation works
- [ ] /posts/create page accessible
- [ ] AI generation works
- [ ] Content streams in real-time
- [ ] No console errors

Final:
- [ ] Both services running
- [ ] Database connected
- [ ] Everything working end-to-end
- [ ] Ready to share with team! 🎉

---

## 🚀 You're Ready!

### Right Now
1. Follow Phase 1 (5 min) - Deploy frontend
2. Follow Phase 2 (15 min) - Deploy backend
3. Follow Phase 3 (5 min) - Connect them
4. Follow Phase 4 (5 min) - Test

### Total Time: 30 minutes to production! ⚡

### After Deployment
- Share your frontend URL
- Monitor logs
- Gather feedback
- Plan improvements

---

## 📖 Full Documentation

For detailed help on each step:

- `FULL_STACK_DEPLOYMENT.md` - Complete guide with explanations
- `DEPLOY_TO_VERCEL.md` - Frontend quick start
- `DEPLOY_BACKEND_TO_RENDER.md` - Backend detailed guide

---

## 🎯 Next Command to Run

**Ready to deploy?**

1. Open this guide in one window
2. Open Vercel.com in another window
3. Follow Phase 1 step-by-step

**Let's go!** 🚀
