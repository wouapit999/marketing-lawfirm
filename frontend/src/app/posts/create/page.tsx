'use client';

import { useRouter } from 'next/navigation';
import { PostEditor } from '@/components/content/PostEditor';
import { useAuth } from '@/hooks/useAuth';

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="text-gray-600">You need to be authenticated to create posts.</p>
        </div>
      </div>
    );
  }

  const handleSave = async (post: any) => {
    // Save will be handled by PostEditor component
    router.push('/posts');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <PostEditor onSave={handleSave} onCancel={handleCancel} practiceArea={user?.practiceArea} />
    </div>
  );
}
