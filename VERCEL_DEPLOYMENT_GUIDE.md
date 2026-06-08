# Vercel Deployment Guide - Marketing LawFirm

Deploy your full-stack application to Vercel with automatic CI/CD, custom domains, and serverless functions.

## Overview

This guide covers deploying:
- **Frontend**: Next.js 14 app → Vercel (automatic)
- **Backend**: NestJS API → Vercel Serverless Functions OR External Server

## Option 1: Frontend Only on Vercel (Recommended for Quick Start)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
# Or with your email:
vercel login --email awouapit@gmail.com
```

### Step 3: Deploy Frontend to Vercel

```bash
# From project root
cd frontend
vercel --prod
```

**You'll be asked:**
- Project name: `marketing-lawfirm-frontend`
- Framework: Next.js
- Source directory: `.` (current)
- Build command: Use default
- Output directory: Use default

### Step 4: Configure Environment Variables

After deployment, go to **Vercel Dashboard**:

1. Go to: https://vercel.com/dashboard
2. Select your project: `marketing-lawfirm-frontend`
3. Settings → Environment Variables
4. Add variable: `NEXT_PUBLIC_API_URL`
5. Value: Your backend URL (see backend deployment below)
6. Redeploy: Click "Redeploy" button

### Step 5: Verify Frontend

After deployment:
- **Production URL**: `https://marketing-lawfirm-frontend.vercel.app`
- **Check**: Visit the URL, should show your app
- **Create Post**: Try `/posts/create` page

---

## Option 2: Full-Stack on Vercel (Advanced)

If you want both frontend AND backend on Vercel:

### Backend Deployment Options

#### Option 2a: Deploy Backend to Render (Recommended)

**Render** is a good choice for NestJS backends:

1. **Push code to GitHub** (already done ✅)

2. **Go to**: https://render.com/
3. **Sign up** with GitHub account
4. **New** → **Web Service**
5. **Connect** your `marketing-lawfirm` repository
6. **Configure**:
   - Name: `marketing-lawfirm-api`
   - Environment: `Node`
   - Build command: `cd backend && npm install && npm run build`
   - Start command: `cd backend && npm run start:prod`
   - Instance: Free or Paid tier

7. **Environment Variables**:
   - `ANTHROPIC_API_KEY`: Your key
   - `NODE_ENV`: `production`
   - `DB_URL`: PostgreSQL connection
   - `REDIS_URL`: Redis connection
   - `JWT_SECRET`: Random secret
   - `FRONTEND_URL`: Your Vercel frontend URL

8. **Deploy** and note the backend URL (e.g., `https://marketing-lawfirm-api.onrender.com`)

#### Option 2b: Deploy Backend to Railway (Alternative)

1. Go to: https://railway.app/
2. Connect GitHub
3. Deploy `marketing-lawfirm` repo
4. Configure as NestJS backend
5. Add environment variables
6. Get backend URL

#### Option 2c: Deploy Backend to Heroku (Legacy)

Heroku free tier is discontinued, but paid options available.

### Step 3: Connect Frontend to Backend

1. Redeploy frontend with backend URL:

```bash
vercel env add NEXT_PUBLIC_API_URL
# Value: https://marketing-lawfirm-api.onrender.com
vercel --prod
```

---

## Configuration Files

### vercel.json (Already Created)

Controls Vercel build and deployment settings.

### .vercelignore (Already Created)

Tells Vercel which files to ignore.

### frontend/.env.production

Create this for production environment:

```bash
cd frontend
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://marketing-lawfirm-api.onrender.com
NEXT_PUBLIC_APP_NAME=Marketing LawFirm
NODE_ENV=production
EOF
```

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

```bash
# Update frontend environment for production
cd frontend
npm run build  # Verify build works locally

# Check for errors
npm run lint
```

### Step 2: Connect GitHub to Vercel

1. Go to: https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select **Import Git Repository**
4. Select: `wouapit999/marketing-lawfirm`
5. Configure:
   - Project name: `marketing-lawfirm`
   - Framework: Next.js
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output: `.next`

### Step 3: Add Environment Variables in Vercel

In Vercel dashboard:
1. **Settings** → **Environment Variables**
2. Add each variable:
   - `NEXT_PUBLIC_API_URL` = Your backend URL
   - `NEXT_PUBLIC_APP_NAME` = "Marketing LawFirm"

### Step 4: Deploy

1. **Click Deploy**
2. Wait for build to complete
3. Get your production URL (e.g., `marketing-lawfirm.vercel.app`)

### Step 5: Deploy Backend (if needed)

Use Render, Railway, or other service (see options above).

### Step 6: Update Frontend with Backend URL

After backend is deployed:
1. Redeploy frontend with backend URL
2. Or update environment variable and redeploy

---

## Domain Configuration

### Add Custom Domain

1. In Vercel dashboard, go to your project
2. **Settings** → **Domains**
3. **Add Domain**
4. Enter: `marketing-lawfirm.com` (if you own it)
5. Follow DNS configuration steps
6. Wait for verification (can take 24 hours)

### Use Vercel Subdomain (Free)

Default: `marketing-lawfirm.vercel.app` (automatically generated)

---

## Environment Variables Needed

### Frontend (Next.js)

```env
# .env.production (Vercel)
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_NAME=Marketing LawFirm
NODE_ENV=production
```

### Backend (NestJS)

```env
# Set in Vercel or Render dashboard
NODE_ENV=production
PORT=3001
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=your-secret-key
DB_HOST=your-database-host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=lawfirm_hub
REDIS_HOST=your-redis-host
REDIS_PORT=6379
FRONTEND_URL=https://marketing-lawfirm.vercel.app
```

---

## Database & Services Setup

For production, you need:

### Option A: Use Cloud Services

**PostgreSQL:**
- Use: Vercel Postgres, Railway, Render, or AWS RDS
- Cost: $15-50/month

**Redis:**
- Use: Redis Cloud, Upstash, or Railway
- Cost: Free tier available

**Anthropic:**
- ANTHROPIC_API_KEY: Needed for AI generation

### Option B: Use Self-Hosted

Deploy your own PostgreSQL and Redis on VPS.

---

## Deployment Checklist

### Before Deploying

- [ ] Code is pushed to GitHub
- [ ] All tests pass locally
- [ ] No hardcoded secrets in code
- [ ] Environment variables are documented
- [ ] Backend is deployed (if using backend)
- [ ] Database is set up and running
- [ ] Redis is configured (if needed)

### Vercel Setup

- [ ] Vercel account created (awouapit@gmail.com)
- [ ] GitHub connected to Vercel
- [ ] Project imported from GitHub
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Domain configured (optional)

### After Deployment

- [ ] Frontend loads without errors
- [ ] API calls work correctly
- [ ] Environment variables are set
- [ ] Logging is working
- [ ] Error tracking is enabled
- [ ] Domain is accessible

---

## Monitoring & Logs

### View Logs in Vercel

1. **Dashboard** → Your project
2. **Deployments** tab
3. Click the latest deployment
4. **Runtime Logs** or **Build Logs**

### Monitor Performance

1. **Analytics** tab shows:
   - Performance
   - Usage
   - Deployments
   - Errors

### Set Up Error Tracking

Vercel automatically tracks errors. You can also:
- Use Sentry.io integration
- Send logs to external service
- Set up alerts

---

## Continuous Deployment (CI/CD)

### Automatic Deployments

Every push to GitHub automatically:
1. Builds the project
2. Runs tests (if configured)
3. Deploys to preview URL
4. Merges to main → deploys to production

### Configure CI/CD

In Vercel dashboard:
1. **Settings** → **Git**
2. Configure:
   - Production branch: `main`
   - Preview branches: `develop`
   - Deploy on push: Enabled
   - Automatic preview: Enabled

---

## Troubleshooting

### Build Fails

```
Error: Cannot find module '@nestjs/core'
```

**Solution**: Add `frontend` root directory in Vercel settings.

### Environment Variables Not Set

```
Error: process.env.NEXT_PUBLIC_API_URL is undefined
```

**Solution**: 
1. Add in Vercel dashboard
2. Redeploy with "Redeploy" button
3. Not just rebuild - need full redeploy

### Backend Connection Error

```
Error: Failed to connect to http://localhost:3001
```

**Solution**: 
- Update `NEXT_PUBLIC_API_URL` to actual backend URL
- Check backend is running
- Check CORS is enabled

### Database Connection Issues

**Solution**:
- Verify database is accessible from internet
- Check connection string is correct
- Check firewall allows connections
- Add Vercel IP to whitelist

---

## Rollback & Undo

### Revert to Previous Deployment

1. **Deployments** tab
2. Find previous successful deployment
3. Click three dots (•••)
4. **Promote to Production**

### Redeploy

```bash
# Redeploy from CLI
vercel --prod

# Or redeploy specific version
vercel deploy --prod
```

---

## Performance Optimization

### Frontend Optimization

1. **Vercel** automatically handles:
   - Image optimization
   - Code splitting
   - Caching
   - CDN distribution

2. **Check Analytics**:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

### Backend Optimization

1. **Database indexing** for frequent queries
2. **Caching** responses with Redis
3. **Monitor API performance**
4. **Optimize token usage** for Claude API

---

## Security Best Practices

### Secrets Management

- ✅ Store in Vercel environment variables
- ✅ Never commit .env file
- ✅ Use .env.example as template
- ❌ Never hardcode API keys

### HTTPS/SSL

- ✅ Vercel provides free SSL/TLS
- ✅ All connections are encrypted
- ✅ Automatic certificate renewal

### CORS

Configure in backend:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### Rate Limiting

Implement in backend to prevent abuse:
```typescript
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { ttl: 60, limit: 100 }, // 100 requests per minute
    ]),
  ],
})
export class AppModule {}
```

---

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel (Frontend) | Yes | $20+/month |
| Render (Backend) | No | $7+/month |
| PostgreSQL | No | $15+/month |
| Redis | Yes (limited) | $0-10/month |
| Anthropic API | No | Usage-based (~$12-15/month typical) |
| **Total** | **$0** | **$34-40+/month** |

---

## Next Steps

### Immediate (Today)
1. [ ] Create Vercel account with awouapit@gmail.com
2. [ ] Deploy frontend to Vercel
3. [ ] Configure environment variables
4. [ ] Test production deployment

### Short-term (Week 1)
1. [ ] Deploy backend (Render/Railway)
2. [ ] Set up production database
3. [ ] Configure custom domain
4. [ ] Monitor logs and performance

### Long-term (Month 1+)
1. [ ] Optimize performance
2. [ ] Set up monitoring/alerting
3. [ ] Plan scaling strategy
4. [ ] Monitor API costs

---

## Deployment Summary

```
Local Development
    ↓
GitHub Push (automatic)
    ↓
Vercel CI/CD (automatic)
    ↓
Preview & Production URLs
    ↓
Custom Domain (optional)
    ↓
Live Web Application 🚀
```

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **New Project**: https://vercel.com/new
- **Vercel Docs**: https://vercel.com/docs
- **Account**: awouapit@gmail.com
- **Repository**: https://github.com/wouapit999/marketing-lawfirm

---

**Your app will be live on Vercel in minutes!** ✅

See next section for step-by-step commands.
