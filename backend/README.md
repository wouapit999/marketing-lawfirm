# LawFirm Marketing Hub - Backend

NestJS backend for the LawFirm Marketing Hub platform with AI-powered content generation.

## Features

- **OAuth 2.0** Authentication for 5 social platforms
- **AI Content Generation** using Claude Opus 4.8 API
- **Job Scheduling** with BullMQ and Redis
- **Social Media Publishing** to Facebook, Instagram, LinkedIn, Twitter/X, YouTube
- **Metrics Tracking** and engagement analytics
- **Real-time Streaming** for content generation via SSE

## Layer 5: AI Content Generation

### Endpoints

#### POST /api/ai/generate
Generate content using Claude AI.

```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "topic": "DUI Defense Strategies",
    "tone": "professional",
    "platforms": ["facebook", "linkedin"],
    "additionalContext": "Focus on recent case wins"
  }'
```

**Request Body:**
- `type`: 'case_study' | 'practice_area' | 'firm_announcement' | 'testimonial' | 'educational'
- `topic`: string - The topic to generate content about
- `tone`: 'professional' | 'friendly' | 'authoritative' | 'conversational'
- `platforms`: string[] - Target platforms (facebook, instagram, linkedin, twitter, youtube)
- `additionalContext`: string (optional) - Additional context for generation
- `stream`: boolean (optional) - Enable SSE streaming

**Response:**
```json
{
  "title": "Understanding DUI Defense Strategies",
  "summary": "Learn how our firm defends DUI cases effectively.",
  "content": "Full article content...",
  "platforms": {
    "facebook": "Platform-specific content...",
    "linkedin": "Platform-specific content..."
  },
  "tokenUsage": {
    "input": 1234,
    "output": 5678
  }
}
```

#### GET /api/ai/generate (Streaming)
Stream content generation in real-time via Server-Sent Events.

```bash
curl -X GET "http://localhost:3001/api/ai/generate?type=educational&topic=DUI+Defense&tone=professional&platforms=facebook,linkedin" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**
- `type`: Content type
- `topic`: Topic to generate
- `tone`: Writing tone
- `platforms`: Comma-separated platform list
- `context`: Additional context (optional)

**Response (SSE):**
```
data: {"type":"chunk","data":"Generated text chunk..."}

data: {"type":"complete","data":{...result object...}}
```

#### POST /api/ai/suggest-topics
Get suggested topics for a practice area.

```bash
curl -X POST http://localhost:3001/api/ai/suggest-topics \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"practiceArea": "criminal-defense"}'
```

**Response:**
```json
[
  "DUI/DWI Defense Strategies",
  "Federal Crime Representation",
  "Plea Bargaining Benefits",
  "Your Rights During Arrest",
  "White Collar Crime Defense"
]
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
npm run typeorm migration:run
```

4. Start development server:
```bash
npm run start:dev
```

## Architecture

### AI Module (`src/ai/`)
- **ai-generation.service.ts** - Core Claude API integration
- **ai-generation.controller.ts** - REST endpoints with streaming support
- **ai.module.ts** - NestJS module registration

### Key Technologies
- **Claude Opus 4.8** - AI content generation
- **Anthropic SDK** - Official Claude API client
- **Server-Sent Events (SSE)** - Real-time streaming to frontend
- **NestJS** - Backend framework
- **TypeORM** - Database ORM
- **BullMQ** - Job queue
- **Redis** - Caching and queue broker

## Streaming Content Generation

The frontend can consume AI generation results in two ways:

### Non-streaming (POST)
Request returns complete result when generation is finished.

### Streaming (GET with EventSource)
Real-time chunks are delivered as they're generated, improving UX:

```typescript
const eventSource = new EventSource('/api/ai/generate?...');
eventSource.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === 'chunk') {
    // Update UI with streaming chunk
  } else if (type === 'complete') {
    // Generation finished
  }
};
```

## Token Usage Tracking

All generation responses include token usage for cost monitoring:

```json
{
  "tokenUsage": {
    "input": 1234,
    "output": 5678
  }
}
```

Calculate costs:
- Opus 4.8: $5/1M input tokens, $25/1M output tokens
- Sonnet 4.6: $3/1M input tokens, $15/1M output tokens

## Content Quality

Generated content includes:
- **Title** - SEO-optimized, under 100 characters
- **Summary** - Social media friendly, under 160 characters
- **Full Content** - 300-500 words for blog/main post
- **Platform Variations** - Optimized for each platform's constraints
- **Hashtags** - 3-5 relevant hashtags

## Security

- All endpoints protected by JwtAuthGuard
- API key stored securely in environment variables
- CORS enabled for frontend domain
- Request validation with class-validator

## Performance

- Streaming reduces perceived latency
- Claude Opus 4.8 provides high-quality output
- Platform-specific variations generated in single API call
- Token usage tracking enables cost optimization

## Production Deployment

See `docker-compose.yml` and deployment scripts for containerization and cloud deployment setup.
