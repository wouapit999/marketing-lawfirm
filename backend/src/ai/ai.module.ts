import { Module } from '@nestjs/common';
import { AiGenerationService } from './ai-generation.service';
import { AiGenerationController } from './ai-generation.controller';

@Module({
  providers: [AiGenerationService],
  controllers: [AiGenerationController],
  exports: [AiGenerationService],
})
export class AiModule {}
