'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Send, Loader2 } from 'lucide-react';
import { AiGenerationPanel } from './AiGenerationPanel';

interface Post {
  id?: string;
  title: string;
  content: string;
  summary: string;
  platforms: string[];
  scheduledFor?: Date;
  createdAt?: Date;
}

interface PostEditorProps {
  initialPost?: Post;
  practiceArea?: string;
  onSave: (post: Post) => Promise<void>;
  onCancel?: () => void;
}

export function PostEditor({
  initialPost,
  practiceArea,
  onSave,
  onCancel,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [summary, setSummary] = useState(initialPost?.summary || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    initialPost?.platforms || ['facebook', 'linkedin'],
  );
  const [scheduledFor, setScheduledFor] = useState<string>(
    initialPost?.scheduledFor ? new Date(initialPost.scheduledFor).toISOString().slice(0, 16) : '',
  );

  const platforms = ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'];
  const characterLimits = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3000,
    youtube: 5000,
  };

  const saveMutation = useMutation({
    mutationFn: async (post: Post) => {
      const endpoint = post.id ? `/api/posts/${post.id}` : '/api/posts';
      const method = post.id ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to save post');
      return res.json();
    },
    onSuccess: () => {
      setTitle('');
      setContent('');
      setSummary('');
      setSelectedPlatforms(['facebook', 'linkedin']);
      setScheduledFor('');
    },
  });

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    await saveMutation.mutate({
      id: initialPost?.id,
      title,
      content,
      summary,
      platforms: selectedPlatforms,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
    });
  };

  const handleContentGenerated = (generatedContent: any) => {
    setTitle(generatedContent.title);
    setContent(generatedContent.content);
    setSummary(generatedContent.summary);

    if (generatedContent.platforms) {
      Object.entries(generatedContent.platforms).forEach(([platform, text]) => {
        if (!selectedPlatforms.includes(platform.toLowerCase())) {
          setSelectedPlatforms((prev) => [...prev, platform.toLowerCase()]);
        }
      });
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  };

  const getCharacterCount = (platform: string) => {
    const limit = characterLimits[platform as keyof typeof characterLimits] || 5000;
    const count = content.length;
    const percentage = (count / limit) * 100;

    return { count, limit, percentage };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {initialPost?.id ? 'Edit Post' : 'Create New Post'}
        </h2>
      </div>

      {/* AI Generation Panel */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Start</h3>
        <AiGenerationPanel
          practiceArea={practiceArea}
          onContentGenerated={handleContentGenerated}
          disabled={saveMutation.isPending}
        />
      </div>

      {/* Title */}
      <div className="border-t pt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/200</p>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief summary for social media"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">{summary.length}/160</p>
        </div>

        {/* Main Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here"
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Target Platforms
          </label>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => {
              const { count, limit } = getCharacterCount(platform);
              const selected = selectedPlatforms.includes(platform);

              return (
                <div key={platform}>
                  <button
                    onClick={() => togglePlatform(platform)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </button>
                  {selected && (
                    <p className="text-xs text-gray-500 mt-1">
                      {count}/{limit} chars
                      {count > limit ? (
                        <span className="text-red-600 ml-1">⚠️ Over limit</span>
                      ) : null}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule (Optional)
          </label>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to publish immediately
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending || !title.trim() || !content.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium transition-colors"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Send size={20} />
              {initialPost?.id ? 'Update Post' : 'Create Post'}
            </>
          )}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Status Messages */}
      {saveMutation.isSuccess && (
        <div className="text-green-600 bg-green-50 p-3 rounded-lg text-sm">
          Post {initialPost?.id ? 'updated' : 'created'} successfully!
        </div>
      )}
      {saveMutation.isError && (
        <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
          {saveMutation.error instanceof Error
            ? saveMutation.error.message
            : 'Failed to save post'}
        </div>
      )}
    </div>
  );
}
