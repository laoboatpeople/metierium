'use client';

export interface ChapterResult {
  chapterNumber: number;
  chapterName: string;
  correct: number;
  total: number;
  tradeName?: string;
  chapterId?: string;
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

  // Aggregate chapter performance — keyed by chapterId for accuracy
  const chapterMap = new Map<string, { chapterNumber: number; name: string; correct: number; total: number }>();
  const chapterIdMap = new Map<string, string>();
  for (const record of history) {
    for (const cr of record.chapterResults) {
      const key = cr.chapterId || `ch_${cr.chapterNumber}`;
      const existing = chapterMap.get(key) || {
        chapterNumber: cr.chapterNumber,
        name: cr.chapterName,
        correct: 0,
        total: 0,
      };
      existing.correct += cr.correct;
      existing.total += cr.total;
      chapterMap.set(key, existing);
      if (cr.chapterId && !chapterIdMap.has(key)) {
        chapterIdMap.set(key, cr.chapterId);
      }
    }
  }

  const chapterPerformance = Array.from(chapterMap.entries())
    .map(([key, data]) => ({
      chapterNumber: data.chapterNumber,
      chapterId: chapterIdMap.get(key) || key,
      chapterName: data.name,
      correct: data.correct,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      tradeName,
      tradeId: firstTradeId,
    }))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const strengths = chapterPerformance.filter(c => c.total >= 5 && c.percentage >= 75).slice(0, 3);
  const weaknesses = chapterPerformance.filter(c => c.total >= 5 && c.percentage < 60).slice(0, 3);
  const needsReview = chapterPerformance.filter(c => c.total >= 3 && c.percentage < 60);

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
