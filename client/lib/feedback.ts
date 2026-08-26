import { authApi } from '@/lib/api';

export interface TheoryFeedbackResponse {
  data: { id: string; rating: 'up' | 'down'; comment: string | null } | null;
}

/** Restore the current user's theory feedback for a chapter (icon state on mount). */
export function getTheoryFeedback(chapterId: string): Promise<TheoryFeedbackResponse> {
  return authApi(`/api/theory/feedback?chapterId=${encodeURIComponent(chapterId)}`);
}

/** Submit (or update) thumbs up/down feedback on a theory chapter. */
export function submitTheoryFeedback(
  chapterId: string,
  rating: 'up' | 'down',
  comment?: string
): Promise<{ data: { id: string; rating: string; comment: string | null } }> {
  return authApi('/api/theory/feedback', {
    method: 'POST',
    body: JSON.stringify({
      chapterId,
      rating,
      comment: comment || undefined,
    }),
  });
}
