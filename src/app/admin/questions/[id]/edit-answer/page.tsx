'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { AdminDrawingAnswerEditor } from '@/components/admin/AdminDrawingAnswerTools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditAnswerPage() {
  const params = useParams();
  const search = useSearchParams();

  const questionId = params?.id as string;
  const imageUrl = decodeURIComponent(search.get('image') || '');
  const mode = (search.get('mode') || 'encircle') as 'encircle' | 'matching' | 'pattern';

  if (!questionId || !imageUrl)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <p className="text-red-500 font-semibold text-lg">Missing question ID or image URL.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-muted/40 py-10 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Edit Interactive Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <AdminDrawingAnswerEditor
              questionId={questionId}
              imageUrl={imageUrl}
              mode={mode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
