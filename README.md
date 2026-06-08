# LawFirm Marketing Hub

A professional marketing automation platform for law firms with AI-powered content generation, multi-platform publishing, metrics tracking, and scheduling capabilities.

## 🚀 Features

### Layer 1: Backend & Authentication
- NestJS REST API with OAuth 2.0
- JWT-based authentication
- Social media account integration (Facebook, Instagram, LinkedIn, Twitter/X, YouTube)
- Secure token encryption (AES-256)

### Layer 2: Frontend Dashboard
- Next.js 14 with App Router
- React components for content management
- Real-time scheduling interface
- Multi-language support (i18n)
- Responsive design with Tailwind CSS

### Layer 3: Deployment & Infrastructure
- Docker & Docker Compose orchestration
- Nginx reverse proxy with SSL/TLS
- Let's Encrypt certificate automation
- GitHub Actions CI/CD pipeline
- Production-ready deployment scripts

### Layer 4: Metrics & Analytics
- Real-time engagement tracking
- Platform-specific metrics fetchers
- Distributed cron scheduling
- Redis-backed metric synchronization
- Engagement analytics dashboard

### Layer 5: AI Content Generation (NEW)
- Claude Opus 4.8 AI integration
- 5 content types (case study, practice area, announcement, testimonial, educational)
- 4 tone options (professional, friendly, authoritative, conversational)
- Real-time streaming via Server-Sent Events (SSE)
- Platform-specific content variations
- Automatic character limit enforcement
- Topic suggestions per practice area
- Token usage tracking for cost monitoring

## 📋 Technology Stack

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Queue**: BullMQ + Redis
- **AI**: Anthropic Claude Opus 4.8
- **Auth**: JWT + OAuth 2.0

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS
- **State**: React Query (TanStack Query)
- **Language**: TypeScript
- **Icons**: Lucide React

### Infrastructure
- **Container**: Docker & Docker Compose
- **Web Server**: Nginx
- **SSL**: Let's Encrypt
- **CI/CD**: GitHub Actions

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (for production)
- Anthropic API Key (for Layer 5)

### Setup

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY and database credentials
npm install
npm run start:dev
```

Backend runs on `http://localhost:3001`

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Test AI Content Generation
1. Navigate to `http://localhost:3000/posts/create`
2. Click "Generate with AI" button
3. Select content type, tone, topic, and platforms
4. Click "Generate Content"
5. Watch as content streams in real-time

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[LAYER5_INTEGRATION_GUIDE.md](./LAYER5_INTEGRATION_GUIDE.md)** - Detailed integration overview
- **[LAYER5_TESTING_GUIDE.md](./LAYER5_TESTING_GUIDE.md)** - Complete testing procedures
- **[LAYER5_COMPLETION_SUMMARY.md](./LAYER5_COMPLETION_SUMMARY.md)** - Technical specifications
- **[LAYER5_FILES_MANIFEST.md](./LAYER5_FILES_MANIFEST.md)** - File index and structure
- **[backend/README.md](./backend/README.md)** - Backend API documentation

## 📁 Project Structure

```
lawfirm-hub/
├── backend/
│   ├── src/
│   │   ├── ai/                    # Layer 5: AI Content Generation
│   │   ├── auth/                  # Layer 1: Authentication
│   │   ├── social/                # Social media integrations
│   │   ├── scheduler/             # Job scheduling (Layer 3)
│   │   └── metrics/               # Analytics (Layer 4)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── app/                   # Next.js pages
│   │   ├── hooks/                 # Custom hooks
│   │   └── styles/                # Global styles
│   ├── package.json
│   └── next.config.js
├── docker-compose.yml             # Layer 3: Multi-container setup
├── nginx.conf                      # Layer 3: Reverse proxy config
├── .gitignore
├── LICENSE
└── README.md
```

## 🔐 Security

- JWT token-based authentication
- AES-256 encryption for sensitive data
- OAuth 2.0 for social platforms
- HTTPS/TLS in production
- Environment-based configuration
- CORS protection
- SQL injection prevention via TypeORM

## 📊 API Endpoints

### AI Content Generation (Layer 5)
```
POST   /api/ai/generate          Generate content (sync or stream)
GET    /api/ai/generate          Stream content via EventSource
POST   /api/ai/suggest-topics    Get topic suggestions
```

### Other Endpoints
See backend documentation for complete API reference.

## 💰 Cost Estimation

**Claude Opus 4.8 Pricing:**
- Input: $5 per 1M tokens
- Output: $25 per 1M tokens

**Typical Usage:**
- Average post: 1000-1500 input + 1000-1500 output tokens
- Cost per post: $0.10-$0.15
- 100 posts/month: ~$12-15

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# Services:
# - Backend: http://localhost:3001
# - Frontend: http://localhost:3000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - Nginx: https://yourdomain.com
```

### Environment Configuration
Copy `.env.example` to `.env` and set:
- `ANTHROPIC_API_KEY` - Claude API key
- `DB_*` - Database credentials
- `REDIS_*` - Redis connection
- `JWT_SECRET` - JWT signing key

## 🧪 Testing

Comprehensive testing guides available:
- Unit tests
- Integration tests
- E2E tests
- API testing with curl/Postman
- Performance testing

See `LAYER5_TESTING_GUIDE.md` for details.

## 📈 Performance

- Generation speed: 5-10 seconds per post
- Streaming chunks: 100-200ms per chunk
- Concurrent users: 100+ supported
- Database queries: Optimized with indexing
- API rate limits: Based on Anthropic quotas

## 🔄 CI/CD Pipeline

GitHub Actions workflow includes:
- Code linting and formatting
- TypeScript compilation
- Unit test execution
- Build verification
- Docker image creation
- Automated deployment

## 📝 Environment Variables

### Required (Backend)
```env
ANTHROPIC_API_KEY=sk-ant-...
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=lawfirm_hub
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check the documentation files
2. Review `LAYER5_TESTING_GUIDE.md` for troubleshooting
3. Check logs: `npm run start:dev` for backend errors
4. Verify environment variables are set correctly

## 📞 Contact

For questions about the LawFirm Marketing Hub:
- **Email**: support@bouquet-innovation.net
- **Phone**: +258878275656
- **GitHub Issues**: [Report issues](https://github.com/wouapit999/marketing-lawfirm/issues)

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Frontend with [Next.js](https://nextjs.org/)
- AI powered by [Anthropic Claude](https://www.anthropic.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Version**: 1.0.0 (All 5 Layers Complete)
**Last Updated**: June 2026
**Status**: Production Ready ✅
>>>>>>> 19d7733 (feat: initial commit - LawFirm Marketing Hub with Layer 5 AI content generation)
