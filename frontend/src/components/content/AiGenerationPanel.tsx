'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Loader2, Sparkles, RefreshCw, Check } from 'lucide-react';

interface GenerationRequest {
  type: 'case_study' | 'practice_area' | 'firm_announcement' | 'testimonial' | 'educational';
  topic: string;
  tone: 'professional' | 'friendly' | 'authoritative' | 'conversational';
  platforms: string[];
  additionalContext?: string;
  stream?: boolean;
}

interface GenerationResult {
  content: string;
  title: string;
  summary: string;
  platforms: Record<string, string>;
  tokenUsage: {
    input: number;
    output: number;
  };
}

interface AiGenerationPanelProps {
  practiceArea?: string;
  onContentGenerated: (content: GenerationResult) => void;
  disabled?: boolean;
}

export function AiGenerationPanel({
  practiceArea,
  onContentGenerated,
  disabled = false,
}: AiGenerationPanelProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [contentType, setContentType] = useState<GenerationRequest['type']>('educational');
  const [tone, setTone] = useState<GenerationRequest['tone']>('professional');
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'linkedin']);
  const [streaming, setStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');

  const platforms = ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'];

  const { data: suggestedTopics } = useQuery({
    queryKey: ['ai-topics', practiceArea],
    queryFn: async () => {
      const res = await fetch('/api/ai/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ practiceArea: practiceArea || 'default' }),
      });
      return res.json();
    },
    enabled: !!practiceArea && showPanel,
  });

  const generateMutation = useMutation({
    mutationFn: async (request: GenerationRequest) => {
      if (request.stream) {
        return new Promise<GenerationResult>((resolve, reject) => {
          const eventSource = new EventSource(
            `/api/ai/generate?${new URLSearchParams({
              type: request.type,
              topic: request.topic,
              tone: request.tone,
              platforms: request.platforms.join(','),
              context: request.additionalContext || '',
              stream: 'true',
            })}`,
          );

          let result: GenerationResult | null = null;
          setStreamedContent('');

          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chunk') {
              setStreamedContent((prev) => prev + data.data);
            } else if (data.type === 'complete') {
              result = data.data;
              eventSource.close();
              resolve(result);
            } else if (data.type === 'error') {
              eventSource.close();
              reject(new Error(data.message));
            }
          };

          eventSource.onerror = () => {
            eventSource.close();
            reject(new Error('Stream error'));
          };
        });
      } else {
        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        if (!res.ok) throw new Error('Generation failed');
        return res.json();
      }
    },
    onSuccess: (result) => {
      onContentGenerated(result);
      setTopic('');
      setContext('');
      setStreamedContent('');
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) return;

    generateMutation.mutate({
      type: contentType,
      topic,
      tone,
      platforms: selectedPlatforms,
      additionalContext: context,
      stream: streaming,
    });
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-shadow disabled:opacity-50"
      >
        <Sparkles size={18} />
        Generate with AI
      </button>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">AI Content Generator</h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as GenerationRequest['type'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="case_study">Case Study</option>
            <option value="practice_area">Practice Area Overview</option>
            <option value="firm_announcement">Firm Announcement</option>
            <option value="testimonial">Client Testimonial</option>
            <option value="educational">Educational Article</option>
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as GenerationRequest['tone'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="authoritative">Authoritative</option>
            <option value="conversational">Conversational</option>
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic or choose from suggestions"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {suggestedTopics && suggestedTopics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedTopics.map((suggestion: string) => (
                <button
                  key={suggestion}
                  onClick={() => setTopic(suggestion)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Additional Context */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add any specific details or requirements"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Platforms</label>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPlatforms.includes(platform)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={streaming}
              onChange={(e) => setStreaming(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Stream response</span>
          </label>
        </div>

        {/* Streamed Content Preview */}
        {streaming && generateMutation.isPending && streamedContent && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-2">Generating...</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-5">
              {streamedContent}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || generateMutation.isPending || selectedPlatforms.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Content
              </>
            )}
          </button>
          <button
            onClick={() => {
              setTopic('');
              setContext('');
              setStreamedContent('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Status Messages */}
        {generateMutation.isSuccess && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <Check size={18} />
            <span className="text-sm">Content generated successfully!</span>
          </div>
        )}
        {generateMutation.isError && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            {generateMutation.error instanceof Error
              ? generateMutation.error.message
              : 'Failed to generate content'}
          </div>
        )}
      </div>
    </div>
  );
}
