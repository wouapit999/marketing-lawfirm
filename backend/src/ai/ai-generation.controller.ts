import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { AiGenerationService } from './ai-generation.service';

interface GenerateContentDto {
  type: 'case_study' | 'practice_area' | 'firm_announcement' | 'testimonial' | 'educational';
  topic: string;
  tone: 'professional' | 'friendly' | 'authoritative' | 'conversational';
  platforms: string[];
  additionalContext?: string;
  stream?: boolean;
}

@Controller('api/ai')
@UseGuards(JwtAuthGuard)
export class AiGenerationController {
  constructor(private aiGenerationService: AiGenerationService) {}

  @Post('generate')
  async generateContent(
    @Body() dto: GenerateContentDto,
    @Res() res: Response,
  ): Promise<void> {
    if (!dto.type || !dto.topic || !dto.tone || !dto.platforms?.length) {
      throw new BadRequestException('Missing required fields: type, topic, tone, platforms');
    }

    if (dto.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const result = await this.aiGenerationService.generateContentStream(
          {
            type: dto.type,
            topic: dto.topic,
            tone: dto.tone,
            platforms: dto.platforms,
            additionalContext: dto.additionalContext,
          },
          (chunk) => {
            res.write(`data: ${JSON.stringify({ type: 'chunk', data: chunk })}\n\n`);
          },
        );

        res.write(
          `data: ${JSON.stringify({
            type: 'complete',
            data: result,
          })}\n\n`,
        );
        res.end();
      } catch (error) {
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
          })}\n\n`,
        );
        res.end();
      }
    } else {
      const result = await this.aiGenerationService.generateContent({
        type: dto.type,
        topic: dto.topic,
        tone: dto.tone,
        platforms: dto.platforms,
        additionalContext: dto.additionalContext,
      });

      res.json(result);
    }
  }

  @Get('generate')
  async generateContentStream(
    @Query('type') type: string,
    @Query('topic') topic: string,
    @Query('tone') tone: string,
    @Query('platforms') platformsParam: string,
    @Query('context') context: string,
    @Query('stream') stream: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!type || !topic || !tone || !platformsParam) {
      throw new BadRequestException('Missing required query parameters: type, topic, tone, platforms');
    }

    const platforms = platformsParam.split(',').map((p) => p.trim());
    if (platforms.length === 0) {
      throw new BadRequestException('At least one platform must be selected');
    }

    const request = {
      type: type as any,
      topic,
      tone: tone as any,
      platforms,
      additionalContext: context,
    };

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const result = await this.aiGenerationService.generateContentStream(
        request,
        (chunk) => {
          res.write(`data: ${JSON.stringify({ type: 'chunk', data: chunk })}\n\n`);
        },
      );

      res.write(
        `data: ${JSON.stringify({
          type: 'complete',
          data: result,
        })}\n\n`,
      );
      res.end();
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        })}\n\n`,
      );
      res.end();
    }
  }

  @Post('suggest-topics')
  async suggestTopics(@Body() dto: { practiceArea: string }): Promise<string[]> {
    const topics = {
      'criminal-defense': [
        'DUI/DWI Defense Strategies',
        'Federal Crime Representation',
        'Plea Bargaining Benefits',
        'Your Rights During Arrest',
        'White Collar Crime Defense',
      ],
      'family-law': [
        'Navigating Divorce Settlement',
        'Custody Rights and Responsibilities',
        'Adoption Process Guide',
        'Spousal Support Explained',
        'Child Support Calculations',
      ],
      'personal-injury': [
        'Car Accident Claim Process',
        'Workplace Injury Rights',
        'Medical Malpractice Explained',
        'Product Liability Cases',
        'Slip and Fall Claims',
      ],
      'corporate': [
        'Mergers and Acquisitions Basics',
        'Employment Contract Review',
        'Intellectual Property Protection',
        'Business Formation Guide',
        'Corporate Compliance Requirements',
      ],
      'real-estate': [
        'Property Purchase Checklist',
        'Landlord-Tenant Rights',
        'Commercial Lease Negotiation',
        'Real Estate Fraud Prevention',
        'Title Search Importance',
      ],
      default: [
        'Legal Rights Overview',
        'When to Hire a Lawyer',
        'Legal Process Explained',
        'Document Preparation Guide',
        'Dispute Resolution Options',
      ],
    };

    return topics[dto.practiceArea.toLowerCase()] || topics.default;
  }
}
