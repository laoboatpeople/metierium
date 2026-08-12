'use client';

export interface ChapterResult {
  chapterNumber: number;
  chapterName: string;
  correct: number;
  total: number;
  tradeName?: string;
  chapterId?: string;
  /** Full approved question count of the chapter (denominator for stats). */
  questionCount?: number;
  /** Question ids answered correctly for this chapter (dedup numerator). */
  correctQuestionIds?: string[];
  /** Question ids attempted for this chapter (dedup confidence threshold). */
  attemptedQuestionIds?: string[];
}

export interface ExamRecord {
  id: string;
  date: string;
  tradeId: string;
  tradeName: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  score: number;
  timeSpent: number;
  chapterResults: ChapterResult[];
  difficulty: string;
  passed: boolean;
  reviewMode: boolean;
}

const STORAGE_KEY = 'metierium_exam_history';
const MAX_RECORDS = 100;

export function saveExamResult(record: ExamRecord): void {
  try {
    const history = getExamHistory();
    history.unshift(record);
    if (history.length > MAX_RECORDS) history.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch { /* localStorage full or unavailable */ }
}

export function getExamHistory(): ExamRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExamRecord[];
  } catch {
    return [];
  }
}

export function clearExamHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

/** Get stats aggregated across all exam attempts for a given trade */
export function getTradeStats(tradeId: string) {
  const history = getExamHistory().filter(r => r.tradeId === tradeId);
  if (history.length === 0) return null;

  const totalExams = history.length;
  const scores = history.map(r => r.score);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const bestScore = Math.max(...scores);
  const worstScore = Math.min(...scores);
  const passed = history.filter(r => r.passed).length;
  const passRate = Math.round((passed / totalExams) * 100);
  const totalTime = history.reduce((a, r) => a + r.timeSpent, 0);
  const totalQuestions = history.reduce((a, r) => a + r.totalQuestions, 0);
  const totalCorrect = history.reduce((a, r) => a + r.correct, 0);
  const recent = history.slice(0, 5);
  const scoreTrend = recent.length >= 2
    ? recent[0].score - recent[recent.length - 1].score
    : 0;

  const tradeName = history[0]?.tradeName || '';
  const firstTradeId = history[0]?.tradeId || '';

  // Aggregate chapter performance — keyed by chapterId for accuracy.
  // Denominator = the chapter's full question bank (questionCount), so
  // unanswered questions count as incorrect (same rule as realtylicence).
  const chapterMap = new Map<string, { chapterNumber: number; name: string; correctIds: Set<string>; attemptedIds: Set<string>; total: number }>();
  const chapterIdMap = new Map<string, string>();
  for (const record of history) {
    for (const cr of record.chapterResults) {
      const key = cr.chapterId || `ch_${cr.chapterNumber}`;
      const existing = chapterMap.get(key) || {
        chapterNumber: cr.chapterNumber,
        name: cr.chapterName,
        correctIds: new Set<string>(),
        attemptedIds: new Set<string>(),
        total: 0,
      };
      // Attempted: unique question ids actually tried (confidence thresholds)
      if (cr.attemptedQuestionIds?.length) {
        for (const qid of cr.attemptedQuestionIds) existing.attemptedIds.add(qid);
      } else {
        // Legacy records without attempted ids: fall back to correct ids + a
        // synthesized key per wrong answer (best-effort count preservation).
        if (cr.correctQuestionIds?.length) {
          for (const qid of cr.correctQuestionIds) existing.attemptedIds.add(qid);
        }
        const wrongCount = Math.max(0, (cr.total || 0) - cr.correct);
        for (let i = 0; i < wrongCount; i++) {
          existing.attemptedIds.add(`legacy_attempt_${record.id}_${key}_${i}`);
        }
      }
      // Numerator: unique question ids answered correctly (dedup across attempts)
      if (cr.correctQuestionIds?.length) {
        for (const qid of cr.correctQuestionIds) existing.correctIds.add(qid);
      } else if (cr.correct > 0) {
        // Legacy records without question ids: synthesize unique keys so the
        // count is preserved (capped at the chapter bank).
        for (let i = 0; i < cr.correct; i++) {
          existing.correctIds.add(`legacy_${record.id}_${key}_${i}`);
        }
      }
      // Denominator: full chapter bank (keep the largest known count)
      existing.total = Math.max(existing.total, cr.questionCount || 0);
      chapterMap.set(key, existing);
      if (cr.chapterId && !chapterIdMap.has(key)) {
        chapterIdMap.set(key, cr.chapterId);
      }
    }
  }

  const chapterPerformance = Array.from(chapterMap.entries())
    .map(([key, data]) => {
      const correct = data.correctIds.size;
      const total = data.total;
      const attempted = data.attemptedIds.size;
      return {
        chapterNumber: data.chapterNumber,
        chapterId: chapterIdMap.get(key) || key,
        chapterName: data.name,
        correct,
        total,
        attempted,
        // Denominator = what the user actually attempted, so a 10-question
        // quiz shows 3/10, not 3/57. The full bank (total) is shown as context.
        percentage: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
        tradeName,
        tradeId: firstTradeId,
      };
    })
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  // Confidence thresholds use ATTEMPTED (unique questions actually tried), not
  // the full bank — otherwise every chapter passes and the sections duplicate.
  const strengths = chapterPerformance.filter(c => c.attempted >= 5 && c.percentage >= 75).slice(0, 3);
  const weaknesses = chapterPerformance.filter(c => c.attempted >= 5 && c.percentage < 60).slice(0, 3);
  const needsReview = chapterPerformance.filter(c => c.attempted >= 3 && c.percentage < 60);

  return {
    totalExams,
    averageScore,
    bestScore,
    worstScore,
    passed,
    passRate,
    totalTime,
    totalQuestions,
    totalCorrect,
    scoreTrend,
    chapterPerformance,
    strengths,
    weaknesses,
    needsReview,
    recentHistory: recent,
  };
}

export function getAllTradesStats() {
  const history = getExamHistory();
  const tradeIds = [...new Set(history.map(r => r.tradeId))];
  return tradeIds.map(id => ({
    tradeId: id,
    tradeName: history.find(r => r.tradeId === id)?.tradeName || '',
    stats: getTradeStats(id),
  }));
}
