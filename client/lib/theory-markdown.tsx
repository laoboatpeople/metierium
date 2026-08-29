import React from 'react';

/**
 * Server-safe theory markdown renderer (SSG pages).
 * Same parsing logic as the client-side TheoryRenderer in app/(app)/theory/page.tsx
 * but pure (no hooks) — used by /theory/[id] static pages for SEO-indexable HTML.
 */

export type TheorySegment =
  | { type: 'svg'; content: string }
  | { type: 'hr'; content: string }
  | { type: 'heading'; level: number; content: string }
  | { type: 'bullet'; content: string }
  | { type: 'numbered'; content: string }
  | { type: 'table'; content: string }
  | { type: 'paragraph'; content: string };

const inline = (s: string) =>
  s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

export function parseTheorySegments(content: string): TheorySegment[] {
  const result: TheorySegment[] = [];
  const parts = content.split(/(<svg[\s\S]*?<\/svg>)/gi);

  for (const part of parts) {
    if (!part.trim()) continue;

    if (part.trim().toLowerCase().startsWith('<svg')) {
      result.push({ type: 'svg', content: part.trim() });
      continue;
    }

    const lines = part.split('\n');
    let inFence = false;
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed) continue;

      // Markdown table: header row followed by separator (|---|)
      if (trimmed.startsWith('|') && i + 1 < lines.length && /^\|[\s\-|:]+\|?$/.test(lines[i + 1].trim())) {
        const header = trimmed.split('|').map((c) => c.trim()).filter((c) => c !== '');
        const body: string[][] = [];
        i += 1;
        while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
          i += 1;
          body.push(lines[i].split('|').map((c) => c.trim()).filter((c) => c !== ''));
        }
        result.push({ type: 'table', content: JSON.stringify({ header, body }) });
        continue;
      }

      if (trimmed.startsWith('```')) {
        inFence = !inFence;
        continue;
      }
      if (inFence) {
        result.push({ type: 'paragraph', content: inline(trimmed) });
        continue;
      }

      const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (hMatch) {
        const headingText = hMatch[2].trim();
        if (/^diagram$/i.test(headingText)) continue;
        result.push({ type: 'heading', level: hMatch[1].length, content: headingText });
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        result.push({ type: 'bullet', content: inline(trimmed.slice(2)) });
        continue;
      }

      if (trimmed.match(/^\d+\.\s+/)) {
        result.push({ type: 'numbered', content: inline(trimmed.replace(/^\d+\.\s+/, '')) });
        continue;
      }

      if (trimmed === '---') {
        result.push({ type: 'hr', content: '' });
        continue;
      }

      result.push({ type: 'paragraph', content: inline(trimmed) });
    }
  }
  return result;
}

// Static class maps (no dynamic Tailwind class names — JIT pitfall)
const DOT_CLASS: Record<string, string> = {
  blue: 'bg-blue/50',
  amber: 'bg-amber/50',
  cyan: 'bg-cyan/50',
  purple: 'bg-purple/50',
};
const TEXT_CLASS: Record<string, string> = {
  blue: 'text-blue',
  amber: 'text-amber',
  cyan: 'text-cyan',
  purple: 'text-purple',
};

export function TheoryContent({ content, color = 'blue' }: { content: string; color?: string }) {
  const segments = parseTheorySegments(content);
  return (
    <div className="prose prose-sm max-w-none">
      {segments.map((seg, i) => {
        if (seg.type === 'svg') {
          return (
            <div
              key={i}
              className="my-4 flex justify-center overflow-x-auto rounded-card border border-border bg-hover/30 p-3"
              dangerouslySetInnerHTML={{ __html: seg.content }}
            />
          );
        }
        if (seg.type === 'hr') {
          return <hr key={i} className="my-4 border-border" />;
        }
        if (seg.type === 'heading') {
          const H = `h${Math.min(seg.level + 1, 4)}` as keyof React.JSX.IntrinsicElements;
          const sizeClass =
            seg.level === 1
              ? 'text-base font-bold mt-5 mb-2'
              : seg.level === 2
                ? 'text-sm font-semibold mt-4 mb-2'
                : 'text-xs font-semibold mt-3 mb-1';
          return (
            <H key={i} className={`${sizeClass} text-text-primary`}>
              {seg.content}
            </H>
          );
        }
        if (seg.type === 'bullet') {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-text-secondary mb-1 ml-2">
              <span className={`w-1.5 h-1.5 rounded-full ${DOT_CLASS[color] || DOT_CLASS.blue} shrink-0 mt-1.5`} />
              <span dangerouslySetInnerHTML={{ __html: seg.content }} />
            </div>
          );
        }
        if (seg.type === 'numbered') {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-text-secondary mb-1 ml-2">
              <span className={`text-xs font-medium ${TEXT_CLASS[color] || TEXT_CLASS.blue} shrink-0 mt-0.5`}>{i + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: seg.content }} />
            </div>
          );
        }
        if (seg.type === 'table') {
          const { header, body } = JSON.parse(seg.content) as { header: string[]; body: string[][] };
          return (
            <div key={i} className="my-4 overflow-x-auto rounded-card border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {header.map((h, hi) => (
                      <th key={hi} className="border-b border-border px-3 py-2 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`border-b border-border px-3 py-2 ${ci === 0 ? 'font-medium' : ''}`}
                          dangerouslySetInnerHTML={{ __html: cell }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-text-secondary leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: seg.content }} />
        );
      })}
    </div>
  );
}
