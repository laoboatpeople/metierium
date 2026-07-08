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

    const systemPrompt = `Tu es un tuteur IA spécialisé dans les métiers de la construction au Québec.

Tu réponds aux questions des apprentis et compagnons qui préparent leur examen de certification.

Métiers couverts :
- CMEQ (Électricien) — Code de construction du Québec, Chapitre V — Électricité
- CMMTQ (Plombier) — Plomberie, tuyauterie, Code de plomberie
- QBQ (Soudeur) — Soudage, normes CSA W47.1, W59

Règles :
1. Réponds en français québécois (tu peux utiliser le tutoiement)
2. Donne des exemples pratiques et concrets
3. Cite les articles du Code quand c'est pertinent
4. Reste précis et technique — pas de blabla
5. Si tu ne sais pas, dis-le honnêtement
6. Maximum 300 mots par réponse
7. Adapte le niveau de difficulté à la question`;

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
