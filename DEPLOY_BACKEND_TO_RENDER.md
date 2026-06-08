# Deploy Backend to Render.com

Deploy your NestJS backend to Render.com in 5 minutes.

## Why Render?

- ✅ Free tier available (with limitations)
- ✅ Easy GitHub integration
- ✅ Automatic deployments on push
- ✅ Built-in PostgreSQL and Redis
- ✅ Good performance for NestJS
- ✅ $7/month minimum for production

## Prerequisites

- GitHub account with code pushed ✅
- Render.com account (create free at https://render.com)
- Backend code in `backend/` directory ✅

## Step 1: Create Render Account

1. Go to: https://render.com
2. Click **Sign Up**
3. Choose **Sign up with GitHub**
4. Authorize Render to access your GitHub
5. Verify email

## Step 2: Create Web Service

1. In Render dashboard, click **New** → **Web Service**
2. Select **Deploy from Git repository**
3. Click **Connect GitHub**
4. Search for: `marketing-lawfirm`
5. Click **Connect** next to your repo

## Step 3: Configure Service

### Basic Configuration
- **Name**: `marketing-lawfirm-api`
- **Runtime**: `Node`
- **Build Command**: 
  ```
  cd backend && npm install && npm run build
  ```
- **Start Command**: 
  ```
  cd backend && npm run start:prod
  ```
- **Instance Type**: Free (or Starter for production)

### Environment Variables

Click **Advanced** and add these:

```
ANTHROPIC_API_KEY = sk-ant-...
NODE_ENV = production
PORT = 3001
JWT_SECRET = your-random-secret-key
DB_HOST = your-database-host
DB_PORT = 5432
DB_USER = postgres
DB_PASSWORD = your-password
DB_NAME = lawfirm_hub
REDIS_HOST = your-redis-host
REDIS_PORT = 6379
FRONTEND_URL = https://marketing-lawfirm.vercel.app
```

**Don't have database/Redis yet?** See "Step 4: Set Up Database" below.

### Deployment Settings

- **Auto-deploy**: Enabled (auto-deploy on push to main)
- **Build Region**: Auto

## Step 4: Set Up Database (Optional)

### Option A: Use Render PostgreSQL

1. In Render dashboard, click **New** → **PostgreSQL**
2. Configure:
   - **Name**: `marketing-lawfirm-db`
   - **Database**: `lawfirm_hub`
   - **User**: `postgres`
   - **Plan**: Free
3. Create

3. Copy the **Internal Database URL**
4. Use in backend environment: `DB_HOST`, `DB_USER`, etc.

### Option B: Use Railway PostgreSQL

1. Go to: https://railway.app
2. Create project → PostgreSQL
3. Get connection string
4. Update backend environment

### Option C: Use Existing Database

If you have a database already:
- Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` accordingly
- Make sure database is accessible from internet

## Step 5: Set Up Redis (Optional)

### Option A: Use Upstash Redis

1. Go to: https://upstash.com
2. Create free Redis database
3. Copy connection URL
4. Set in backend: `REDIS_HOST` and `REDIS_PORT`

### Option B: Use Render Redis

1. In Render, click **New** → **Redis**
2. Configure and create
3. Get connection details

### Option C: Skip for Now

Redis is optional. The app will work without it (some features disabled).

## Step 6: Deploy

1. Click **Create Web Service**
2. Wait for deployment (takes 2-5 minutes)
3. You'll see: "Your service is live"
4. Get your URL: `https://marketing-lawfirm-api.onrender.com` (example)

## Step 7: Connect Frontend to Backend

1. Go to Vercel dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Add/Update: `NEXT_PUBLIC_API_URL`
5. Value: Your Render API URL (e.g., `https://marketing-lawfirm-api.onrender.com`)
6. **Save** and **Redeploy**

## Verify Deployment

### Test Backend

```bash
# Test health check
curl https://marketing-lawfirm-api.onrender.com

# Test AI endpoint (needs auth)
curl -X POST https://marketing-lawfirm-api.onrender.com/api/ai/suggest-topics \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"practiceArea": "criminal-defense"}'
```

### Test Integration

1. Go to your Vercel frontend
2. Navigate to `/posts/create`
3. Click "Generate with AI"
4. Should work without errors ✅

## Environment Variables for Backend

### Required

```env
NODE_ENV=production
ANTHROPIC_API_KEY=sk-ant-your-key
JWT_SECRET=generate-random-secret
PORT=3001
FRONTEND_URL=https://your-vercel-url.vercel.app
```

### Database (if using PostgreSQL)

```env
DB_HOST=db.render.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=lawfirm_hub
```

### Redis (optional)

```env
REDIS_HOST=redis.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

## Monitoring

### View Logs

1. In Render dashboard, select your service
2. Click **Logs**
3. View real-time logs

### Enable Health Checks

1. Service settings → **Health Check Path**
2. Set to: `/`
3. Render will monitor and auto-restart if needed

### Set Up Alerts

1. Settings → **Notifications**
2. Add email for deployment alerts

## Common Issues

### Build Fails

**Error**: `npm ERR! code ENOENT`

**Fix**:
1. Check build command is correct
2. Ensure `backend/package.json` exists
3. Check npm version: `npm --version`
4. View logs for details

### Runtime Error

**Error**: `Cannot find module @nestjs/core`

**Fix**:
1. Check `npm install` ran in build command
2. Build command should be: `cd backend && npm install && npm run build`
3. View logs: Click service → Logs

### Database Connection Error

**Error**: `FATAL: no PostgreSQL user`

**Fix**:
1. Check `DB_HOST`, `DB_USER`, `DB_PASSWORD` are correct
2. Database must be accessible from internet
3. Check firewall/security groups

### CORS Error

**Error**: `Access-Control-Allow-Origin`

**Fix**: Backend needs to know frontend URL:
1. Set `FRONTEND_URL` environment variable
2. Backend should have CORS config:
   ```typescript
   app.enableCors({
     origin: process.env.FRONTEND_URL,
   });
   ```

## Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Create account | 2 min | ⏭️ Do now |
| Deploy backend | 5 min | ⏭️ Do now |
| Deploy database | 3 min | ⏭️ Do now |
| Configure env vars | 2 min | ⏭️ Do now |
| Update frontend | 2 min | ⏭️ Do now |
| Test integration | 2 min | ⏭️ Do now |
| **Total** | **16 min** | **🎉** |

## Next Steps

### Immediate
1. [ ] Deploy backend to Render
2. [ ] Set up PostgreSQL
3. [ ] Configure environment variables
4. [ ] Update frontend with backend URL
5. [ ] Test AI generation

### This Week
1. [ ] Monitor logs and performance
2. [ ] Set up Redis (if needed for scale)
3. [ ] Enable backups for database
4. [ ] Set up monitoring alerts

### Optimization
1. [ ] Enable caching
2. [ ] Optimize database queries
3. [ ] Monitor API costs
4. [ ] Review performance logs

## Pricing

### Free Tier (with limitations)
- Backend: Free (sleeps after inactivity)
- PostgreSQL: Free (512MB storage)
- Redis: Not available

### Starter Tier
- Backend: $7/month (always on)
- PostgreSQL: $15/month
- Redis: $6+/month
- **Total**: ~$28/month

### Production Recommendation
For production, upgrade to Starter tier (~$28/month).

Free tier works for testing but services shut down after inactivity.

## Comparison: Backend Deployment Options

| Platform | Cost | Ease | Performance |
|----------|------|------|-------------|
| **Render** | $7+/month | Easy | Good |
| **Railway** | $5+/month | Easy | Good |
| **Heroku** | Paid only | Easy | Good |
| **AWS Lambda** | Pay-per-use | Hard | Excellent |
| **DigitalOcean** | $5+/month | Medium | Good |

**Recommendation**: Render or Railway (both easy and affordable).

---

## Full Architecture After Deployment

```
Frontend (Vercel)
  └─ https://marketing-lawfirm.vercel.app

Backend (Render)
  └─ https://marketing-lawfirm-api.onrender.com
      └─ PostgreSQL Database (Render)
      └─ Redis Cache (Upstash)

GitHub
  └─ https://github.com/wouapit999/marketing-lawfirm
      └─ Auto-deploy to Vercel + Render on push
```

---

## Resources

- **Render Docs**: https://render.com/docs
- **NestJS Docs**: https://docs.nestjs.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **Redis**: https://redis.io/docs

---

**Your backend is now live!** 🚀

Frontend and backend are connected. AI generation is ready to use.

See `VERCEL_DEPLOYMENT_GUIDE.md` for advanced configuration.
