'use client';

// ── Shared LaTeX + Markdown renderer for AI tutor responses ──
// Used by the /tutor page AND the admin dashboards (tutor conversation modals),
// so AI output renders identically everywhere (bold, lists, links, display/inline math).

function cleanLatex(math: string): string {
  return math
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\times/g, '×')
    .replace(/\\,/g, ' ')
    .replace(/\\ /g, ' ')
    .replace(/\\%/g, '%')
    .replace(/\\displaystyle/g, '')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\(?:mathrm|mathbf|mathit)\{([^}]*)\}/g, '$1')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    .replace(/\s+/g, ' ')
    .trim();
}

export function renderAIResponse(content: string): string {
  // ── Protect inline <svg>...</svg> blocks from the markdown regexes below ──
  // The tutor emits raw SVG for schema/diagram questions; we must not mangle it.
  const svgBlocks: string[] = [];
  let html = content.replace(/<svg[\s\S]*?<\/svg>/gi, (m) => {
    svgBlocks.push(m);
    return `\u0000SVG${svgBlocks.length - 1}\u0000`;
  });

  html = html
    // Markdown headings (# → h3, ## → h4, ### → h5) — keep visual hierarchy small in chat
    .replace(/^### (.+)$/gm, '<h5 class="text-sm font-semibold mt-3 mb-1 text-[#F8FAFC]">$1</h5>')
    .replace(/^## (.+)$/gm, '<h4 class="text-base font-semibold mt-3 mb-1 text-[#F8FAFC]">$1</h4>')
    .replace(/^# (.+)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-1 text-[#F8FAFC]">$1</h3>')
    // Bold markers
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Horizontal rules
    .replace(/^---+/gm, '<hr class="border-[#2D3A52] my-2" />')
    // Lines starting with - as list items
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-[#94A3B8]">$1</li>');

  // ── Links: markdown [text](url) first, then bare URLs ──
  // Markdown links
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#3B82F6] hover:underline break-all">$1</a>'
  );
  // Bare URLs (not already inside an href="..."). The // in https:// can never
  // appear inside an attribute value, so we won't double-link existing anchors.
  html = html.replace(
    /(^|[\s(>])(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g,
    (_m, pre: string, url: string) =>
      `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#3B82F6] hover:underline break-all">${url}</a>`
  );

  // Display math \[ ... \]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_m, math: string) => {
    const cleaned = cleanLatex(math);
    return `<pre class="bg-[#1A2332] border border-[#2D3A52] p-3 rounded-lg my-2 text-sm font-mono overflow-x-auto text-[#F8FAFC]">${cleaned}</pre>`;
  });

  // Inline math \( ... \)
  html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_m, math: string) => {
    const cleaned = cleanLatex(math);
    return `<code class="bg-[#1A2332] px-1.5 py-0.5 rounded text-xs font-mono text-[#E2E8F0]">${cleaned}</code>`;
  });

  // ── Re-insert the preserved SVG blocks ──
  html = html.replace(/\u0000SVG(\d+)\u0000/g, (_m, i: string) => svgBlocks[Number(i)] ?? '');

  return html;
}
