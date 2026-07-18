import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

interface ChatRequest {
  message: string;
  history?: { role: string; content: string }[];
}

/**
 * POST /api/tutor
 * AI tutor powered by DeepSeek.
 * Answers questions about trades (CMEQ, CMMTQ, QBQ), theory, and exam preparation.
 */
router.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body as ChatRequest;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ message: 'Message is required' });
      return;
    }

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
- When a question matches a trade covered by this platform (electrician, plumber, welder, HVAC, heavy vehicle mechanic, fire safety, sheet metal, bricklayer, heavy equipment operator, gas technician, elevator mechanic, refrigeration, builder-renovator, building inspector, safety coordinator, general contractor), feel free to mention the platform as a study resource and include a link to the theory page: https://metierium.com/theory
- If the question is about a trade or topic NOT covered here, do NOT promote the platform — instead give the best external answer you can or suggest where to find that information
- Be honest: if you don't have good info on a topic, say so

SCOPE RESTRICTION:
- ONLY answer questions related to Quebec construction trades, trade certification exams, building codes, or exam/chapter context
- If a user asks about anything unrelated (cooking, sports, general trivia, personal advice, etc.), politely decline and redirect back to trade topics
- Do NOT engage with off-topic conversation, even if the user insists

Remember: students are preparing for high-stakes licensing exams. Accuracy and educational value are critical.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-10),
      { role: 'user', content: message },
    ];

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      // Fallback response if no API key configured
      res.json({
        response: `Je suis votre tuteur IA. Pour vous donner une réponse précise sur "${message}", j'ai besoin que la clé API DeepSeek soit configurée par l'administrateur. En attendant, voici un conseil général :\n\nConsultez le contenu théorique dans la section Théorie et pratiquez avec les examens blancs. Si vous avez une question spécifique sur un chapitre ou un article du Code, référez-vous d'abord au matériel d'étude fourni.`,
        model: 'fallback',
      });
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
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Tutor] DeepSeek API error:', response.status, errorText);
      res.json({
        response: `Désolé, le service IA est temporairement indisponible. Veuillez réessayer plus tard ou consulter la section Théorie pour vos révisions.`,
        model: 'error',
      });
      return;
    }

    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const reply = data.choices?.[0]?.message?.content || 'Je n\'ai pas de réponse pour le moment.';

    res.json({ response: reply, model: 'deepseek-chat' });
  } catch (err) {
    console.error('[Tutor] Error:', err);
    res.status(500).json({ message: 'Erreur lors du traitement de votre question.' });
  }
});

export default router;
