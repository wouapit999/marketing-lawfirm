# Layer 5: AI Content Generation - Testing Guide

## Environment Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Anthropic API Key

### Installation
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Environment Configuration
```bash
# backend/.env
cp .env.example .env
# Edit .env:
NODE_ENV=development
PORT=3001
ANTHROPIC_API_KEY=sk-ant-... (your actual key)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=lawfirm_hub
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_test_secret_key_here
```

## Backend Testing

### 1. Start Backend Services

```bash
# Terminal 1: Start backend
cd backend
npm run start:dev

# Terminal 2: Start Redis (if not running as service)
redis-server

# Terminal 3: Start PostgreSQL (if not running as service)
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Services -> PostgreSQL -> Start
```

Verify backend is running:
```bash
curl http://localhost:3001
```

### 2. Test AI Content Generation Endpoint (Non-Streaming)

#### Basic Generation Request
```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "topic": "DUI Defense Strategies",
    "tone": "professional",
    "platforms": ["facebook", "linkedin"]
  }'
```

**Expected Response:**
```json
{
  "title": "Understanding DUI Defense Strategies",
  "summary": "Learn effective DUI defense strategies from our experienced legal team.",
  "content": "Comprehensive article content about DUI defense...",
  "platforms": {
    "facebook": "Facebook-optimized content...",
    "linkedin": "LinkedIn-optimized content..."
  },
  "tokenUsage": {
    "input": 1234,
    "output": 5678
  }
}
```

#### Test All Content Types
```bash
# Case Study
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "case_study",
    "topic": "Successful Federal Crime Defense",
    "tone": "authoritative",
    "platforms": ["linkedin"]
  }'

# Practice Area
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "practice_area",
    "topic": "Criminal Defense",
    "tone": "professional",
    "platforms": ["facebook", "linkedin", "youtube"]
  }'

# Firm Announcement
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "firm_announcement",
    "topic": "Firm Expansion to New Office",
    "tone": "friendly",
    "platforms": ["twitter"]
  }'

# Client Testimonial
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "testimonial",
    "topic": "Successful DUI Case Outcome",
    "tone": "conversational",
    "platforms": ["instagram"]
  }'
```

#### Test All Tone Options
```bash
# Professional
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "topic": "Divorce Settlement Process",
    "tone": "professional",
    "platforms": ["linkedin"]
  }'

# Friendly
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "topic": "Understanding Your Legal Rights",
    "tone": "friendly",
    "platforms": ["facebook"]
  }'

# Authoritative
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "practice_area",
    "topic": "Intellectual Property Law",
    "tone": "authoritative",
    "platforms": ["linkedin"]
  }'

# Conversational
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "topic": "What to Expect in Court",
    "tone": "conversational",
    "platforms": ["youtube"]
  }'
```

### 3. Test Streaming Endpoint

```bash
# Stream with EventSource (requires EventSource support)
# Use curl with -N for no buffering
curl -N "http://localhost:3001/api/ai/generate?type=educational&topic=Medical+Malpractice&tone=professional&platforms=linkedin" \
  -H "Authorization: Bearer test-token"
```

**Expected Response (SSE Format):**
```
data: {"type":"chunk","data":"Understanding medical malpractice"}

data: {"type":"chunk","data":" claims is essential"}

data: {"type":"complete","data":{"title":"...","summary":"...","content":"...","platforms":{"linkedin":"..."},"tokenUsage":{"input":1234,"output":5678}}}
```

#### Test Streaming with JavaScript
Create `test-stream.js`:
```javascript
const eventSource = new EventSource(
  'http://localhost:3001/api/ai/generate?type=educational&topic=Real+Estate+Law&tone=professional&platforms=facebook',
  { headers: { Authorization: 'Bearer test-token' } }
);

let fullContent = '';
eventSource.onmessage = (event) => {
  const { type, data, message } = JSON.parse(event.data);
  
  if (type === 'chunk') {
    fullContent += data;
    process.stdout.write(data);
  } else if (type === 'complete') {
    console.log('\n\nGeneration complete!');
    console.log('Token usage:', data.tokenUsage);
    eventSource.close();
  } else if (type === 'error') {
    console.error('Error:', message);
    eventSource.close();
  }
};

eventSource.onerror = () => {
  console.error('Stream error');
  eventSource.close();
};
```

Run with: `node test-stream.js`

### 4. Test Topic Suggestions Endpoint

#### Get Topics for Criminal Defense
```bash
curl -X POST http://localhost:3001/api/ai/suggest-topics \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"practiceArea": "criminal-defense"}'
```

**Expected Response:**
```json
[
  "DUI/DWI Defense Strategies",
  "Federal Crime Representation",
  "Plea Bargaining Benefits",
  "Your Rights During Arrest",
  "White Collar Crime Defense"
]
```

#### Get Topics for All Practice Areas
```bash
# Family Law
curl -X POST http://localhost:3001/api/ai/suggest-topics \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"practiceArea": "family-law"}'

# Personal Injury
curl -X POST http://localhost:3001/api/ai/suggest-topics \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"practiceArea": "personal-injury"}'

# Corporate
curl -X POST http://localhost:3001/api/ai/suggest-topics \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"practiceArea": "corporate"}'

# Real Estate
curl -X POST http://localhost:3001/api/ai/suggest-topics \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"practiceArea": "real-estate"}'
```

### 5. Test Error Handling

#### Missing Required Fields
```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "platforms": ["facebook"]
  }'
```

**Expected:** 400 Bad Request - "Missing required fields: type, topic, tone, platforms"

#### Missing Authorization
```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "topic": "Test",
    "tone": "professional",
    "platforms": ["facebook"]
  }'
```

**Expected:** 401 Unauthorized - "Authorization header missing"

#### Invalid Token
```bash
curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer invalid-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "topic": "Test",
    "tone": "professional",
    "platforms": ["facebook"]
  }'
```

**Expected:** 401 Unauthorized - "Invalid token"

## Frontend Testing

### 1. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend should be available at `http://localhost:3000`

### 2. Test PostEditor Component

Navigate to `http://localhost:3000/posts/create`

#### Test Case 1: Generate and Review Content
1. Click "Generate with AI" button
2. Select "Educational" from Content Type
3. Select "Professional" from Tone
4. Enter topic: "Workplace Injury Claims"
5. Leave Additional Context empty
6. Select platforms: Facebook, LinkedIn
7. Click "Generate Content"
8. Wait for streaming to complete
9. Verify content appears in the form fields
10. Click "Create Post"

**Expected:**
- Content generates in ~5-10 seconds
- Title field populated
- Summary field populated
- Main Content field populated with full article
- Platforms section shows generated content for each platform

#### Test Case 2: Topic Suggestions
1. Click "Generate with AI"
2. Practice Area automatically loads suggested topics
3. Click on a suggested topic
4. Topic field auto-populated
5. Click "Generate Content"

**Expected:**
- Suggested topics appear as clickable pills below topic input
- Clicking topic auto-fills the field

#### Test Case 3: Streaming Preview
1. Click "Generate with AI"
2. Fill in type, tone, topic, select platforms
3. Check "Stream response" checkbox
4. Click "Generate Content"
5. Watch content appear in real-time

**Expected:**
- Content appears character by character
- "Generating..." message displays
- Preview updates in real-time
- Final result displays when complete

#### Test Case 4: Character Limits
1. Generate content for Twitter and Facebook
2. Observe character counts displayed
3. Verify Twitter shows ≤280 characters
4. Verify Facebook shows content within limits

**Expected:**
- Character count displayed for each selected platform
- Warning shown if content exceeds platform limits
- Content automatically fits platform constraints

#### Test Case 5: Edit Generated Content
1. Generate content
2. Modify title in form
3. Modify content in textarea
4. Modify summary
5. Click "Create Post"

**Expected:**
- All fields are editable
- Changes persist
- Post saves with edited content

#### Test Case 6: Schedule Post
1. Generate content
2. Click datetime input under "Schedule (Optional)"
3. Select future date and time
4. Click "Create Post"

**Expected:**
- Datetime picker opens
- Future date/time can be selected
- Post saves with scheduled timestamp

#### Test Case 7: Platform Selection
1. Generate content
2. Deselect some platforms by clicking them
3. Select different platforms
4. Generate new content

**Expected:**
- Platform buttons toggle on/off
- Only selected platforms appear in generated content
- Content regenerates for newly selected platforms

### 3. Test Error States

#### Test Case 8: Network Error
1. Close backend server
2. Click "Generate with AI"
3. Try to generate content

**Expected:**
- Error message displays: "Failed to generate content"
- Loading spinner stops
- User can retry after restarting backend

#### Test Case 9: Missing Topic
1. Click "Generate with AI"
2. Leave topic empty
3. Try to click "Generate Content"

**Expected:**
- Button is disabled
- Cannot submit without topic

### 4. Test Integration with PostEditor

#### Test Case 10: Full Workflow
1. Start at `/posts/create`
2. Use "Generate with AI" panel
3. Generate content for multiple platforms
4. Edit generated content
5. Set schedule date
6. Click "Create Post"
7. Verify post appears in post list

**Expected:**
- Each step completes successfully
- Generated content flows seamlessly into editor
- Post saves with all generated data

## API Testing with Postman

### Import Collection
Create `postman-collection.json`:
```json
{
  "info": {
    "name": "Layer 5 AI Generation API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Generate Content - Educational",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer test-token"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/api/ai/generate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "ai", "generate"]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"type\": \"educational\",\n  \"topic\": \"DUI Defense Strategies\",\n  \"tone\": \"professional\",\n  \"platforms\": [\"facebook\", \"linkedin\"]\n}"
        }
      }
    },
    {
      "name": "Get Topic Suggestions",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer test-token"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:3001/api/ai/suggest-topics",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "ai", "suggest-topics"]
        },
        "body": {
          "mode": "raw",
          "raw": "{\n  \"practiceArea\": \"criminal-defense\"\n}"
        }
      }
    }
  ]
}
```

Import into Postman and test each endpoint.

## Performance Testing

### Token Usage Measurement
Run multiple generations and track cumulative costs:

```bash
#!/bin/bash
total_input=0
total_output=0
total_cost=0

for i in {1..5}; do
  response=$(curl -s -X POST http://localhost:3001/api/ai/generate \
    -H "Authorization: Bearer test-token" \
    -H "Content-Type: application/json" \
    -d '{
      "type": "educational",
      "topic": "Legal Topic '$i'",
      "tone": "professional",
      "platforms": ["linkedin"]
    }')
  
  input=$(echo $response | jq '.tokenUsage.input')
  output=$(echo $response | jq '.tokenUsage.output')
  
  total_input=$((total_input + input))
  total_output=$((total_output + output))
done

# Calculate cost (Opus 4.8: $5/$25 per 1M tokens)
total_cost=$(echo "scale=4; ($total_input * 5 + $total_output * 25) / 1000000" | bc)
echo "Total input tokens: $total_input"
echo "Total output tokens: $total_output"
echo "Total cost: \$$total_cost"
```

### Latency Testing
```bash
# Measure response time
time curl -X POST http://localhost:3001/api/ai/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "educational",
    "topic": "Test Topic",
    "tone": "professional",
    "platforms": ["facebook"]
  }' > /dev/null
```

## Test Checklist

### Backend
- [ ] POST /api/ai/generate returns valid response
- [ ] GET /api/ai/generate returns SSE stream
- [ ] POST /api/ai/suggest-topics returns topic array
- [ ] JWT authentication is required on all endpoints
- [ ] Invalid tokens are rejected with 401
- [ ] Missing fields return 400 with clear error
- [ ] Content type variations are distinct
- [ ] Tone variations are evident in output
- [ ] Platform variations respect character limits
- [ ] Token usage is accurately tracked
- [ ] Error responses follow standard format

### Frontend
- [ ] PostEditor component renders
- [ ] AiGenerationPanel can be toggled open/closed
- [ ] Content type dropdown works
- [ ] Tone dropdown works
- [ ] Topic suggestions load and are clickable
- [ ] Platform buttons toggle selection
- [ ] Character limits display for each platform
- [ ] Streaming checkbox controls generation mode
- [ ] Stream preview updates in real-time
- [ ] Generated content populates form fields
- [ ] Form fields are editable after generation
- [ ] Schedule datetime picker works
- [ ] Create Post button saves content
- [ ] Error messages display on failure
- [ ] Loading spinner shows during generation
- [ ] Success message displays after save

### Integration
- [ ] Full end-to-end generation works
- [ ] Generated content flows into post editor
- [ ] Post saves with generated data
- [ ] Multiple platforms handled correctly
- [ ] Token tracking shows accurate counts
- [ ] Streaming provides real-time feedback

## Troubleshooting

### Backend Issues

**Error: Cannot find module '@anthropic-ai/sdk'**
```bash
cd backend
npm install @anthropic-ai/sdk
```

**Error: ECONNREFUSED on port 3001**
- Backend not running: `npm run start:dev`
- Port already in use: Kill process on port 3001

**Error: "ANTHROPIC_API_KEY" is not set**
- Set in `.env` file in backend directory
- Verify key starts with `sk-ant-`

**Error: "Authorization header missing"**
- Include `-H "Authorization: Bearer token"` in requests
- Token doesn't need to be valid for basic tests (guard is minimal)

### Frontend Issues

**Error: Cannot POST to /api/ai/generate**
- Backend not running
- Frontend .env.local points to wrong backend URL
- Verify backend URL: `http://localhost:3001`

**EventSource error in browser**
- Check browser console for CORS errors
- Verify backend CORS settings include frontend URL
- Check network tab for 401 errors (auth issue)

**"Stream error" message**
- Backend might have crashed
- Check backend terminal for error logs
- Try non-streaming mode to isolate issue

## Documentation Generation

Generate API docs:
```bash
cd backend
npm install -D @nestjs/swagger swagger-ui-express
# Add @nestjs/swagger integration
# Access at http://localhost:3001/api/docs
```
