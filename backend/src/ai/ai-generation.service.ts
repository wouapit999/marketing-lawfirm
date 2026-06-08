import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

interface GenerateContentRequest {
  type: 'case_study' | 'practice_area' | 'firm_announcement' | 'testimonial' | 'educational';
  topic: string;
  tone: 'professional' | 'friendly' | 'authoritative' | 'conversational';
  platforms: string[];
  additionalContext?: string;
}

interface GeneratedContent {
  content: string;
  title: string;
  summary: string;
  platforms: Record<string, string>;
  tokenUsage: {
    input: number;
    output: number;
  };
}

@Injectable()
export class AiGenerationService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  private getSystemPrompt(): string {
    return `You are an expert legal marketing content strategist specializing in creating compelling marketing materials for law firms.

Your expertise includes:
- Case study writing with compelling narratives and measurable outcomes
- Practice area overviews that educate while showcasing expertise
- Professional announcements and firm updates
- Client testimonial frameworks
- Educational content that establishes thought leadership

Guidelines:
- Maintain professional tone while being relatable
- Include specific examples and metrics where appropriate
- Ensure content is SEO-friendly with natural keyword inclusion
- Adapt content for different social platforms (character limits, formatting)
- Include call-to-action elements where appropriate
- Maintain compliance with legal advertising standards`;
  }

  private getPromptTemplate(request: GenerateContentRequest): string {
    const typeDescriptions = {
      case_study: 'Create a compelling case study about',
      practice_area: 'Write an overview of our',
      firm_announcement: 'Draft a professional announcement about',
      testimonial: 'Create a client testimonial framework about',
      educational: 'Write an educational article about',
    };

    const toneInstructions = {
      professional: 'Use a formal, authoritative tone.',
      friendly: 'Use a warm, approachable tone.',
      authoritative: 'Establish thought leadership with expert confidence.',
      conversational: 'Write as if speaking directly to potential clients.',
    };

    return `${typeDescriptions[request.type]} "${request.topic}".

Tone: ${toneInstructions[request.tone]}
${request.additionalContext ? `Additional Context: ${request.additionalContext}` : ''}

Platforms: ${request.platforms.join(', ')}

Please provide:
1. A compelling title (under 100 characters)
2. A brief summary (under 160 characters for social media)
3. Full content suitable for a blog post or main post (300-500 words)
4. Platform-specific variations for each selected platform with character limits respected
5. 3-5 relevant hashtags

Format the response as JSON with the following structure:
{
  "title": "...",
  "summary": "...",
  "fullContent": "...",
  "platformVariations": {
    "facebook": "...",
    "instagram": "...",
    "linkedin": "...",
    "twitter": "...",
    "youtube": "..."
  },
  "hashtags": ["...", "..."]
}`;
  }

  async generateContent(request: GenerateContentRequest): Promise<GeneratedContent> {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.getPromptTemplate(request);

    const message = await this.client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    let responseText = '';
    for (const block of message.content) {
      if (block.type === 'text') {
        responseText += block.text;
      }
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const platforms: Record<string, string> = {};
    for (const platform of request.platforms) {
      const key = platform.toLowerCase();
      platforms[key] = parsed.platformVariations[key] || parsed.fullContent;
    }

    return {
      content: parsed.fullContent,
      title: parsed.title,
      summary: parsed.summary,
      platforms,
      tokenUsage: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
      },
    };
  }

  async generateContentStream(
    request: GenerateContentRequest,
    onChunk: (text: string) => void,
  ): Promise<GeneratedContent> {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.getPromptTemplate(request);

    let fullResponse = '';
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    const stream = await this.client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const text = event.delta.text;
        fullResponse += text;
        onChunk(text);
      } else if (event.type === 'message_delta' && event.usage) {
        totalInputTokens = event.usage.input_tokens;
        totalOutputTokens = event.usage.output_tokens;
      }
    }

    const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const platforms: Record<string, string> = {};
    for (const platform of request.platforms) {
      const key = platform.toLowerCase();
      platforms[key] = parsed.platformVariations[key] || parsed.fullContent;
    }

    return {
      content: parsed.fullContent,
      title: parsed.title,
      summary: parsed.summary,
      platforms,
      tokenUsage: {
        input: totalInputTokens,
        output: totalOutputTokens,
      },
    };
  }
}
