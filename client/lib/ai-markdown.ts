'use client';

// ── Shared LaTeX + Markdown renderer for AI tutor responses ──
// Used by the /tutor page AND the admin dashboards (tutor conversation modals),
// so AI output renders identically everywhere (bold, lists, links, display/inline math).

function cleanLatex(math: string): string {
  return math
    // Functions & roots
    .replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\tfrac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\cfrac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    // Operators
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈')
    .replace(/\\geq/g, '≥')
    .replace(/\\leq/g, '≤')
    .replace(/\\neq/g, '≠')
    .replace(/\\ne/g, '≠')
    .replace(/\\equiv/g, '≡')
    .replace(/\\propto/g, '∝')
    .replace(/\\pm/g, '±')
    .replace(/\\infty/g, '∞')
    .replace(/\\prime/g, '′')
    .replace(/\\in/g, '∈')
    .replace(/\\notin/g, '∉')
    .replace(/\\subset/g, '⊂')
    .replace(/\\subseteq/g, '⊆')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    // Greek & units (order matters: multi-char first, \Omega before \pi)
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\Phi/g, 'Φ')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\Theta/g, 'Θ')
    .replace(/\\Lambda/g, 'Λ')
    .replace(/\\varphi/g, 'φ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\eta/g, 'η')
    .replace(/\\mu/g, 'μ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\varepsilon/g, 'ε')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\tau/g, 'τ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\kappa/g, 'κ')
    .replace(/\\pi/g, 'π')
    .replace(/\\deg/g, '°')
    .replace(/\\degree/g, '°')
    // Functions
    .replace(/\\arcsin/g, 'arcsin')
    .replace(/\\arccos/g, 'arccos')
    .replace(/\\arctan/g, 'arctan')
    .replace(/\\sinh/g, 'sinh')
    .replace(/\\cosh/g, 'cosh')
    .replace(/\\tanh/g, 'tanh')
    .replace(/\\cot/g, 'cot')
    .replace(/\\sec/g, 'sec')
    .replace(/\\csc/g, 'csc')
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    .replace(/\\exp/g, 'exp')
    .replace(/\\cos/g, 'cos')
    .replace(/\\sin/g, 'sin')
    .replace(/\\tan/g, 'tan')
    // Spaces & misc
    .replace(/\\quad/g, ' ')
    .replace(/\\qquad/g, ' ')
    .replace(/\\,/g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\:/g, ' ')
    .replace(/\\!/g, '')
    .replace(/\\ /g, ' ')
    // Decimal separators in French LaTeX: 0{,}63 → 0,63 (must run before \{ → {)
    .replace(/\\\{,\\\}/g, ',')
    .replace(/\\\{\.\\\}/g, '.')
    .replace(/\\%/g, '%')
    .replace(/\\displaystyle/g, '')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\begin\{[^}]*\}/g, '')
    .replace(/\\end\{[^}]*\}/g, '')
    .replace(/\\(?:mathrm|mathbf|mathit|mathbb|mathcal)\{([^}]*)\}/g, '$1')
    .replace(/\\overline\{([^}]*)\}/g, '$1')
    .replace(/\\underline\{([^}]*)\}/g, '$1')
    .replace(/\\vec\{([^}]*)\}/g, '$1')
    .replace(/\\hat\{([^}]*)\}/g, '$1')
    .replace(/\\bar\{([^}]*)\}/g, '$1')
    .replace(/\\dot\{([^}]*)\}/g, '$1')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    // Any leftover backslash (e.g. line-break \\ inside align) becomes a space
    .replace(/\\\\/g, ' ')
    // Superscripts & subscripts (after \text/\mathrm cleanup)
    .replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>')
    .replace(/\^([0-9]+)/g, '<sup>$1</sup>')
    .replace(/\_\{([^}]*)\}/g, '<sub>$1</sub>')
    .replace(/\_([a-zA-Z0-9]+)/g, '<sub>$1</sub>')
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
    // Bold markers — block-level bold lines become their own paragraph
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Horizontal rules
    .replace(/^---+/gm, '<hr class="border-[#2D3A52] my-2" />')
    // Lines starting with - as list items
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1.5 text-[#94A3B8]">$1</li>')
    // Numbered list items (1. item)
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1.5 text-[#94A3B8]">$1. $2</li>');

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
    return `<pre class="bg-[#1A2332] border border-[#2D3A52] p-3 rounded-lg my-2.5 text-sm font-mono overflow-x-auto text-[#F8FAFC]">${cleaned}</pre>`;
  });

  // Inline math \( ... \)
  html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_m, math: string) => {
    const cleaned = cleanLatex(math);
    return `<code class="bg-[#1A2332] px-2 py-0.5 rounded text-xs font-mono text-[#E2E8F0]">${cleaned}</code>`;
  });

  // ── Markdown tables: | a | b | with --- separator → real <table> ──
  const tableBlocks: string[] = [];
  html = html.replace(/((?:^\s*\|.*\|\s*$[\r\n]*)+)/gm, (block) => {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('|') && l.endsWith('|') && l.length > 2);
    if (lines.length < 2) return block;
    const isSep = (l: string) => /^\|[\s:|-]+\|$/.test(l);
    const cells = (r: string) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    let header: string | null = null;
    let body = lines;
    if (isSep(lines[1] ?? '')) {
      header = lines[0];
      body = lines.slice(2);
    }
    let t = '<div class="overflow-x-auto my-2.5"><table class="w-full text-xs border-collapse">';
    if (header) {
      t += '<thead><tr>' + cells(header)
        .map((c) => `<th class="border border-[#2D3A52] bg-[#1A2332] px-2 py-1.5 text-left font-semibold text-[#F8FAFC]">${c}</th>`)
        .join('') + '</tr></thead>';
    }
    t += '<tbody>';
    for (const r of body) {
      t += '<tr>' + cells(r)
        .map((c) => `<td class="border border-[#2D3A52] px-2 py-1.5 text-[#94A3B8]">${c}</td>`)
        .join('') + '</tr>';
    }
    t += '</tbody></table></div>';
    const idx = tableBlocks.length;
    tableBlocks.push(t);
    return `\u0000TABLE${idx}\u0000`;
  });

  // ── Convert remaining newlines to visible spacing (HTML collapses raw \n) ──
  // Double newlines = paragraph break; single newlines = line break.
  html = html.replace(/\n{2,}/g, '<div class="h-2.5"></div>').replace(/\n/g, '<br/>');

  // ── Re-insert the preserved SVG blocks ──
  html = html.replace(/\u0000SVG(\d+)\u0000/g, (_m, i: string) => svgBlocks[Number(i)] ?? '');

  // ── Re-insert the preserved table blocks ──
  html = html.replace(/\u0000TABLE(\d+)\u0000/g, (_m, i: string) => tableBlocks[Number(i)] ?? '');

  return html;
}
