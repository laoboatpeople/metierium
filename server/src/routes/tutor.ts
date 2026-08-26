import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { prisma } from '../config/database';
import { sendTutorFeedbackNotification } from '../lib/email';

const router = Router();

const FREE_TUTOR_MESSAGE_LIMIT = 100;

interface ChatRequest {
  message: string;
  sessionId?: string;
  chapterId?: string;
  history?: { role: string; content: string }[];
}

/**
 * POST /api/tutor
 * AI tutor powered by DeepSeek.
 * Persists every conversation in ChatSession / ChatMessage so the admin
 * dashboard can surface recent tutor activity.
 */
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as Request & { user: { id: string } }).user.id;
    const { message, sessionId, chapterId, history } = req.body as ChatRequest;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ message: 'Message is required' });
      return;
    }

    // ── Enforce free-plan message cap ───────────────────────
    const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    if (dbUser?.plan === 'FREE') {
      const messageCount = await prisma.chatMessage.count({
        where: { role: 'user', session: { userId, source: 'tutor' } },
      });
      if (messageCount >= FREE_TUTOR_MESSAGE_LIMIT) {
        res.status(403).json({
          code: 'TUTOR_LIMIT_REACHED',
          message: 'Free plan limit reached',
          limit: FREE_TUTOR_MESSAGE_LIMIT,
          count: messageCount,
        });
        return;
      }
    }

    // ── Resolve or create the chat session ──────────────────
    let session = null;
    if (sessionId) {
      session = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
      });
    }
    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId,
          source: 'tutor',
          topic: message.slice(0, 60),
        },
      });
    }

    // ── Store the user message ──────────────────────────────
    const userMessage = await prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'user', content: message },
    });

    // Touch session so updatedAt reflects latest activity
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    const systemPrompt = `You are an expert AI tutor specializing in Quebec trade certification examinations (CMEQ, CMMTQ, QBQ, RBQ, CCQ).

Your role:
- Help students prepare for Quebec trade certification exams
- Provide accurate, detailed explanations of construction trades concepts
- Reference relevant building codes, regulations, and best practices where applicable
- Be clear, educational, and encourage deep understanding — not just memorization

Your expertise covers:
- Electrical systems (Code de construction du Québec, Chapitre V — Électricité, CMEQ)
- Plumbing and piping (Code de plomberie, CMMTQ)
- Welding (CSA W47.1, W59, QBQ)
- Building inspection, HVAC, refrigeration, fire safety
- Elevators, gas fitting, heavy equipment, sheet metal
- Construction regulations (RBQ, CCQ)
- Safety coordination (ASP Construction, IRSST, RSST)
- Building codes and standards

Communication style:
- Be technical but accessible
- Uses a professional and educational tone
- Use practical examples and real exam scenarios
- Cite Code articles when relevant (e.g., "Article 26-012 du Code de construction")
- Stay precise and technical — no fluff
- Maximum 300 words per response
- If a question is outside your knowledge, say so honestly
- ALWAYS respond in the same language as the user's question (French or English)
- When a question matches a trade covered by this platform, mention the platform as a study resource and include a PRECISE deep link to that trade's theory section (NOT the generic /theory page). Use this exact map of trade → URL slug:
  * Électricien / electrician (CMEQ) → https://metierium.com/theory?trade=cmeq
  * Plombier / plumber (CMMTQ) → https://metierium.com/theory?trade=cmmtq
  * Soudeur / welder (QBQ) → https://metierium.com/theory?trade=qbq
  * HVAC / réfrigération-climatisation → https://metierium.com/theory?trade=hvac
  * Mécanicien véhicules lourds / heavy vehicle mechanic → https://metierium.com/theory?trade=mvl
  * Sécurité incendie / fire safety → https://metierium.com/theory?trade=securite-incendie
  * Ferblantier / sheet metal → https://metierium.com/theory?trade=ferblantier
  * Briqueteur-maçon / bricklayer-mason → https://metierium.com/theory?trade=briqueteur
  * Opérateur d'équipement lourd / heavy equipment operator → https://metierium.com/theory?trade=operateur-equipement-lourd
  * Technicien en gaz / gas technician → https://metierium.com/theory?trade=gaz
  * Mécanicien d'ascenseurs / elevator mechanic → https://metierium.com/theory?trade=ascenseurs
  * Réfrigération / refrigeration → https://metierium.com/theory?trade=refrigeration
  * Constructeur-rénovateur / builder-renovator → https://metierium.com/theory?trade=constructeur
  * Entrepreneur général / general contractor → https://metierium.com/theory?trade=entrepreneur-general
  * Inspecteur en bâtiment / building inspector → https://metierium.com/theory?trade=inspecteur
  * Coordonnateur SST / safety coordinator → https://metierium.com/theory?trade=coordonnateur-sst
  * Gestion des travaux / construction project management → https://metierium.com/theory?trade=gestion-travaux
  ALWAYS pick the single best-matching trade and give its specific ?trade= link. Only fall back to https://metierium.com/theory if the question genuinely spans multiple trades and none fits.
  IMPORTANT PRIORITY: If a PRECISE DEEP LINK instruction is present later in this prompt (a chapterId provided for the user's question), that exact ?chapterId= link takes priority over this trade map — use it and do NOT use the ?trade= links for that question.
- CROSS-SELL RULE: When a question touches on MULTIPLE trades offered by the platform (e.g., a Catégorie 16 electrician needs BOTH technical CMEQ content AND business management / RBQ exam prep), you MUST suggest ALL relevant trades the platform covers — not just the primary one. Never tell the user to "find external resources" for a topic that IS covered by another trade on this platform. Example: "Pour la partie technique → https://metierium.com/theory?trade=cmeq. Pour la gestion d'entreprise et la réglementation RBQ → https://metierium.com/theory?trade=gestion-travaux."
- If the question is about a trade or topic NOT covered here, do NOT promote the platform — instead give the best external answer you can or suggest where to find that information. IMPORTANT: Start your response with the exact marker [UNCOVERED_TOPIC] on the first line so the system can flag it.
- EXCEPTION: When the user asks you to explain an exam question that includes Question/Options/Correct answer fields (messages starting with "Question d'examen:" / "Exam question:" — sent by the platform's own quiz "ask AI tutor" button), the topic IS covered by the platform. NEVER mark such questions as [UNCOVERED_TOPIC] — explain them fully and reference the platform as a study resource with the relevant trade theory link.
- Be honest: if you don't have good info on a topic, say so

SCOPE RESTRICTION:
- ONLY answer questions related to Quebec construction trades, trade certification exams, building codes, or exam/chapter context
- If a user asks about anything unrelated (cooking, sports, general trivia, personal advice, etc.), politely decline and redirect back to trade topics
- Do NOT engage with off-topic conversation, even if the user insists

SCHÉMAS ET DIAGRAMMES / SCHEMATICS:
- When a student asks for a schema, diagram, circuit, schematic, montage, câblage, or wiring (schéma, diagramme, circuit, montage, câblage, branchement), DO NOT produce ASCII art (no pipes |, dashes -, plus +, or box-drawing characters). Instead generate a clean INLINE SVG diagram.
- SVG rules (apply to ANY electrical or trades diagram — generators, motors, loads, panels, piping, etc.):
  * Root element MUST include xmlns, a viewBox, and an explicit width (use width="600" so it scales; the viewBox sets the aspect ratio).
  * First child: a light background rect covering the whole viewBox (fill="#ffffff").
  * Wires: dark navy (stroke="#16233b"), stroke-width ~2.6, straight lines with right-angle corners only, stroke-linecap="round".
  * Use standard electrical symbols: resistor = IEC rectangle (a small <rect> outline), inductor/coil = a series of semicircle bumps (an SVG <path> with arc "A" commands), DC source = one long + one short parallel line, ground = three decreasing horizontal lines. Add small filled circles (r~4) at connection nodes.
  * Label every component and terminal (A1/A2, F1/F2, L1/N, etc.) with <text>. Labels MUST be in the SAME LANGUAGE as the user's question (French labels for French questions). Use a sans-serif font, dark navy fill.
  * Add a short bold title <text> at the top describing the diagram.
- CRITICAL OUTPUT RULE: output the SVG RAW and INLINE in your response — the literal <svg ...>...</svg> markup. NEVER wrap it in a \`\`\` code fence and NEVER escape it. The frontend renders raw SVG as a real image; a code fence would break it.
- Keep the surrounding explanation short (you still have a 300-word limit): one brief caption sentence before and/or after the SVG is enough.
- Example of the expected style for "schéma d'une génératrice shunt" (compact — match this quality and structure):
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600"><rect width="600" height="400" fill="#ffffff"/><text x="300" y="30" font-family="Arial, sans-serif" font-size="20" fill="#0b5394" text-anchor="middle" font-weight="bold">Génératrice shunt</text><circle cx="140" cy="210" r="45" fill="#ffffff" stroke="#16233b" stroke-width="2.6"/><text x="140" y="208" font-family="Arial, sans-serif" font-size="14" fill="#16233b" text-anchor="middle" font-weight="bold">Induit</text><text x="140" y="226" font-family="Arial, sans-serif" font-size="13" fill="#0b5394" text-anchor="middle">(E)</text><line x1="140" y1="165" x2="140" y2="110" stroke="#16233b" stroke-width="2.6"/><line x1="140" y1="110" x2="480" y2="110" stroke="#16233b" stroke-width="2.6"/><line x1="140" y1="255" x2="140" y2="320" stroke="#16233b" stroke-width="2.6"/><line x1="140" y1="320" x2="480" y2="320" stroke="#16233b" stroke-width="2.6"/><path d="M 300 110 L 300 160 A 8 8 0 0 1 300 176 A 8 8 0 0 1 300 192 A 8 8 0 0 1 300 208 A 8 8 0 0 1 300 224 L 300 260" fill="none" stroke="#16233b" stroke-width="2.6"/><line x1="300" y1="260" x2="300" y2="320" stroke="#16233b" stroke-width="2.6"/><text x="312" y="195" font-family="Arial, sans-serif" font-size="14" fill="#16233b" font-weight="bold">Inducteur shunt</text><rect x="467" y="185" width="26" height="60" rx="2" fill="#ffffff" stroke="#16233b" stroke-width="2.6"/><line x1="480" y1="110" x2="480" y2="185" stroke="#16233b" stroke-width="2.6"/><line x1="480" y1="245" x2="480" y2="320" stroke="#16233b" stroke-width="2.6"/><text x="500" y="220" font-family="Arial, sans-serif" font-size="14" fill="#16233b" font-weight="bold">Charge (R)</text><text x="126" y="105" font-family="Arial, sans-serif" font-size="13" fill="#0b5394" text-anchor="end" font-weight="bold">A1</text><text x="126" y="335" font-family="Arial, sans-serif" font-size="13" fill="#0b5394" text-anchor="end" font-weight="bold">A2</text></svg>

- COMPLETENESS: When generating multiple schemas in one response, you MUST complete ALL of them. Never stop mid-diagram. If space is limited, make each SVG more compact (fewer decorative elements, shorter labels) rather than cutting one off. Every schema must have its full <svg>...</svg> block closed properly.
- ANIMATIONS (SMIL): When the concept involves flow, motion, cycles, or sequences (electrical current, fluid flow, mechanical movement, process steps), add SMIL animations to make the diagram come alive:
  * Moving particles (current, fluid, air): <circle r="4" fill="#3B82F6"><animateMotion dur="2s" repeatCount="indefinite" path="M100 100 L400 100"/></circle> — stagger multiple particles with begin="0.5s", begin="1s"
  * Oscillating parts (pistons, valves): <animate attributeName="y" values="150;175;150" dur="2s" repeatCount="indefinite"/>
  * Rotation (crankshafts, motors): <animateTransform attributeName="transform" type="rotate" from="0 cx cy" to="360 cx cy" dur="2s" repeatCount="indefinite"/>
  * Highlight sequences: animate a colored rect stepping through stages via x/y with keyTimes
  * Scanning bar over tables/data: <rect x="0" y="0" width="100%" height="30" fill="#3B82F6" opacity="0.1"><animate attributeName="x" values="-600;0;-600" dur="6s" repeatCount="indefinite"/></rect> (inject at END of svg, before </svg>)
- CRITICAL: Every animated element must be VISIBLE — test that the animation changes pixel values over time. A static-looking SVG with broken SMIL is worse than no animation.

Remember: students are preparing for high-stakes licensing exams. Accuracy and educational value are critical.`;

    // Build conversation history — prefer DB-persisted messages, fall back to client history
    let dbHistory: { role: string; content: string }[] = [];
    try {
      const stored = await prisma.chatMessage.findMany({
        where: { sessionId: session.id },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });
      dbHistory = stored.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }));
    } catch {
      dbHistory = [];
    }
    const contextHistory = dbHistory.length > 1 ? dbHistory.slice(0, -1) : (history || []).slice(-10);

    // Detect questions coming from the platform's own exam bank (the quiz "ask AI tutor"
    // button sends "Question d'examen:" / "Exam question:" + options + answers).
    // Add an invisible system instruction so the tutor never says such a topic is "not covered".
    const isExamBankQuestion = /(Question d'examen|Exam question|Question d\u2019examen)/.test(message);
    const examBankInstruction = isExamBankQuestion
      ? '\n\nIMPORTANT: The user is asking about a question from this platform\'s own exam question bank (it includes Question/Options/Correct answer fields). This topic IS covered by the platform — NEVER tell the user it is not covered or outside scope. Explain it fully and reference the platform as a study resource with the relevant trade theory link.'
      : '';

    // Precise theory deep-link: when the quiz passes the question's chapterId, force
    // the tutor to link to that exact chapter (?chapterId=) instead of the generic trade section.
    const chapterLinkInstruction = chapterId
      ? `\n\nPRECISE DEEP LINK: The user's current question belongs to a specific theory chapter (chapterId: ${chapterId}). When you reference the platform as a study resource, use EXACTLY this deep link (it opens the correct chapter, NOT the generic section): https://metierium.com/theory?chapterId=${chapterId} — never use the ?trade= links for this question.`
      : '';

    const messages = [
      { role: 'system', content: systemPrompt + examBankInstruction + chapterLinkInstruction },
      ...contextHistory,
      { role: 'user', content: message },
    ];

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      const fallback = `Je suis votre tuteur IA. Pour vous donner une réponse précise sur "${message}", j'ai besoin que la clé API DeepSeek soit configurée par l'administrateur. En attendant, voici un conseil général :\n\nConsultez le contenu théorique dans la section Théorie et pratiquez avec les examens blancs. Si vous avez une question spécifique sur un chapitre ou un article du Code, référez-vous d'abord au matériel d'étude fourni.`;
      const fallbackMsg = await prisma.chatMessage.create({
        data: { sessionId: session.id, role: 'assistant', content: fallback },
      });
      res.json({ response: fallback, model: 'fallback', sessionId: session.id, userMessageId: userMessage.id, assistantMessageId: fallbackMsg.id });
      return;
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Tutor] DeepSeek API error:', response.status, errorText);
      const errMsg = `Désolé, le service IA est temporairement indisponible. Veuillez réessayer plus tard ou consulter la section Théorie pour vos révisions.`;
      const errMsgRec = await prisma.chatMessage.create({
        data: { sessionId: session.id, role: 'assistant', content: errMsg },
      });
      res.json({ response: errMsg, model: 'error', sessionId: session.id, userMessageId: userMessage.id, assistantMessageId: errMsgRec.id });
      return;
    }

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    let reply = data.choices?.[0]?.message?.content || 'Je n\'ai pas de réponse pour le moment.';

    // ── Detect uncovered topics and notify Discord ──────────
    const isUncovered = reply.includes('[UNCOVERED_TOPIC]');
    if (isUncovered) {
      // Strip the marker from the user-facing reply
      reply = reply.replace('[UNCOVERED_TOPIC]', '').trim();

      // Fire-and-forget Discord notification via bot API
      const botToken = process.env.DISCORD_BOT_TOKEN;
      const alertChannel = process.env.TUTOR_ALERTS_CHANNEL_ID;
      if (botToken && alertChannel) {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }).catch(() => null);
        const embed = {
          embeds: [{
            title: '🔍 Sujet non couvert détecté',
            description: `**Question :** ${message.slice(0, 500)}`,
            color: 0xF59E0B,
            fields: [
              { name: 'Utilisateur', value: user?.name || user?.email || userId, inline: true },
              { name: 'Session', value: session.id, inline: true },
            ],
            footer: { text: 'Metierium Tutor Alert' },
            timestamp: new Date().toISOString(),
          }],
        };
        fetch(`https://discord.com/api/v10/channels/${alertChannel}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${botToken}`,
          },
          body: JSON.stringify(embed),
        }).catch((err) => console.error('[Tutor] Discord alert failed:', err));
      }
    }

    // ── Store the assistant reply ───────────────────────────
    const assistantMessage = await prisma.chatMessage.create({
      data: { sessionId: session.id, role: 'assistant', content: reply },
    });

    // Track last activity (tutor question = user activity)
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});

    res.json({
      response: reply,
      model: 'deepseek-chat',
      sessionId: session.id,
      userMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id,
    });
  } catch (err) {
    console.error('[Tutor] Error:', err);
    res.status(500).json({ message: 'Erreur lors du traitement de votre question.' });
  }
});

// ─── POST /api/tutor/feedback ──────────────────────────────
// Submit (or update) thumbs up/down feedback on an AI tutor message.

router.post('/feedback', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as Request & { user: { id: string } }).user.id;
  const { chatMessageId, rating, comment } = req.body as {
    chatMessageId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  if (typeof chatMessageId !== 'string' || chatMessageId.length === 0 || chatMessageId.length > 64) {
    res.status(400).json({ message: 'chatMessageId is required' });
    return;
  }
  if (rating !== 'up' && rating !== 'down') {
    res.status(400).json({ message: 'rating must be "up" or "down"' });
    return;
  }
  if (comment !== undefined && (typeof comment !== 'string' || comment.length > 2000)) {
    res.status(400).json({ message: 'comment must be a string (max 2000 chars)' });
    return;
  }

  try {
    // The message must belong to a chat session owned by this user
    const message = await prisma.chatMessage.findFirst({
      where: { id: chatMessageId, session: { userId } },
      select: { id: true, content: true, session: { select: { topic: true } } },
    });
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    const feedback = await prisma.tutorFeedback.upsert({
      where: { chatMessageId_userId: { chatMessageId, userId } },
      create: { chatMessageId, userId, rating, comment: comment || null },
      // Never wipe an existing comment with an empty one — only update rating
      update: { rating, ...(comment ? { comment } : {}) },
    });

    // Track last activity (tutor feedback = user activity)
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    }).catch(() => {});

    // Fire-and-forget notification email to site owner
    sendTutorFeedbackNotification({
      siteName: 'Metierium',
      adminUrl: 'https://metierium.com',
      rating,
      comment: comment || null,
      userEmail: (req as any).user.email as string,
      userName: (req as any).user.name ?? null,
      messagePreview: message.content,
      sessionTopic: message.session.topic,
    }).catch(() => {});

    res.json({ data: feedback });
  } catch (err) {
    console.error('[Tutor Feedback Error]', err);
    res.status(500).json({ message: 'Failed to save feedback' });
  }
});

// ─── GET /api/tutor/feedback?sessionId= ────────────────────
// Get the current user's feedback for a session (restore icon state).

router.get('/feedback', authenticate, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as Request & { user: { id: string } }).user.id;
  const sessionId = req.query.sessionId as string | undefined;
  if (!sessionId) {
    res.status(400).json({ message: 'sessionId query param is required' });
    return;
  }
  try {
    const feedbacks = await prisma.tutorFeedback.findMany({
      where: { userId, message: { sessionId } },
      select: { chatMessageId: true, rating: true, comment: true },
    });
    res.json({ data: feedbacks });
  } catch (err) {
    console.error('[Tutor Feedback Error]', err);
    res.status(500).json({ message: 'Failed to load feedback' });
  }
});

export default router;
