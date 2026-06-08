import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface GenerationRequest {
  type: 'case_study' | 'practice_area' | 'firm_announcement' | 'testimonial' | 'educational';
  topic: string;
  tone: 'professional' | 'friendly' | 'authoritative' | 'conversational';
  platforms: string[];
  additionalContext?: string;
}

export interface GenerationResult {
  title: string;
  summary: string;
  content: string;
  platforms: Record<string, string>;
  tokenUsage: {
    input: number;
    output: number;
  };
}

export function useAiGeneration() {
  const generateContent = useCallback(
    (request: GenerationRequest) =>
      fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      }).then((res) => {
        if (!res.ok) throw new Error('Generation failed');
        return res.json() as Promise<GenerationResult>;
      }),
    [],
  );

  const generateContentStream = useCallback(
    (request: GenerationRequest, onChunk: (chunk: string) => void) =>
      new Promise<GenerationResult>((resolve, reject) => {
        const params = new URLSearchParams({
          type: request.type,
          topic: request.topic,
          tone: request.tone,
          platforms: request.platforms.join(','),
          context: request.additionalContext || '',
        });

        const eventSource = new EventSource(`/api/ai/generate?${params}`);

        eventSource.onmessage = (event) => {
          try {
            const { type, data, message } = JSON.parse(event.data);
            if (type === 'chunk') {
              onChunk(data);
            } else if (type === 'complete') {
              eventSource.close();
              resolve(data);
            } else if (type === 'error') {
              eventSource.close();
              reject(new Error(message));
            }
          } catch (error) {
            eventSource.close();
            reject(error);
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
          reject(new Error('Stream error'));
        };
      }),
    [],
  );

  const mutation = useMutation({
    mutationFn: generateContent,
  });

  const streamMutation = useMutation({
    mutationFn: ({ request, onChunk }: { request: GenerationRequest; onChunk: (chunk: string) => void }) =>
      generateContentStream(request, onChunk),
  });

  return {
    generate: mutation.mutate,
    generateStream: streamMutation.mutate,
    isLoading: mutation.isPending || streamMutation.isPending,
    isSuccess: mutation.isSuccess || streamMutation.isSuccess,
    isError: mutation.isError || streamMutation.isError,
    error: mutation.error || streamMutation.error,
    reset: () => {
      mutation.reset();
      streamMutation.reset();
    },
  };
}

export function useAiTopicSuggestions(practiceArea?: string) {
  return useQuery({
    queryKey: ['ai-topics', practiceArea],
    queryFn: async () => {
      const res = await fetch('/api/ai/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ practiceArea: practiceArea || 'default' }),
      });

      if (!res.ok) throw new Error('Failed to fetch topics');
      return res.json() as Promise<string[]>;
    },
    enabled: !!practiceArea,
  });
}
