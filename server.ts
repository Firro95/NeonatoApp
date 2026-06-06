import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI Client to prevent startup failure if API key is not configured yet
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return null or throw clear error on use
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Check health and if Gemini API Key is loaded
app.get('/api/health', (req, res) => {
  const aiClient = getGenAI();
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    currentTime: new Date().toISOString()
  });
});

/**
 * Endpoint to generate personalized tips based on the baby's current age, stats, and achievements.
 */
app.post('/api/gemini/tips', async (req, res) => {
  try {
    const ai = getGenAI();
    if (!ai) {
      return res.status(200).json({
        success: false,
        error: "GEMINI_API_KEY non configurata. Impostala nella scheda Secrets.",
        tips: [
          "Mantieni un ritmo regolare per il sonno del neonato in camera fresca e buia.",
          "Fai sempre ruttare il bimbo a metà e a fine pasto per ridurre l'aria nella pancia.",
          "Parla al tuo bambino durante il giorno pronunciando chiaramente il nome degli oggetti.",
          "Fai fare piccoli giochi a pancia in giù (Tummy Time) per rafforzare collo e schiena."
        ]
      });
    }

    const { name, gender, ageMonths, weight, height, headCirc, achievedMilestones, completedVisits } = req.body;

    const prompt = `Sei un assistente pediatrico virtuale professionale, autorevole ma caloroso e rassicurante.
Analizza i dati di crescita di questo bambino per proporre 4 consigli (tips) pratici, mirati ed altamente rilevanti per questo specifico mese di vita nel primo anno del neonato.

Dati del Bambino:
- Nome: ${name || 'Nostro neonato'}
- Genere: ${gender === 'male' ? 'Maschietto' : 'Femminuccia'}
- Età: ${ageMonths ? ageMonths.toFixed(1) : 'Mese corrente'} mesi
- Peso attuale: ${weight ? weight + ' kg' : 'Non specificato'}
- Altezza attuale: ${height ? height + ' cm' : 'Non specificato'}
- Circonferenza Cranica: ${headCirc ? headCirc + ' cm' : 'Non specificata'}
- Tappe dello sviluppo raggiunte: ${achievedMilestones ? achievedMilestones.join(', ') : 'Varie tappe tipiche'}
- Visite pediatriche superate con successo: ${completedVisits ? completedVisits.join(', ') : 'Nessuna o prime visite'}

Genera una lista di ESATTAMENTE 4 consigli brevi, pratici e mirati in lingua ITALIANA.
Adotta uno stile umano, costruttivo e focalizzato sullo stimolo psicomotorio precoce, l'alimentazione corretta per l'età e il benessere familiare.
Includi sempre un disclaimer discreto che ricorda che i consigli dell'AI non sostituiscono mai la consultazione del pediatra di fiducia.

Restituisci la risposta esclusivamente in formato JSON valido, aderente al seguente schema:
{
  "success": true,
  "tips": [
    "Tip 1...",
    "Tip 2...",
    "Tip 3...",
    "Tip 4..."
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const textOutput = response.text || '';
    try {
      const parsedData = JSON.parse(textOutput.trim());
      res.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", textOutput);
      res.json({
        success: true,
        tips: [
          `Fase ${Math.round(ageMonths || 1)} Mesi: Incentiva l'esplorazione autonoma su un tappeto morbido e sicuro.`,
          `Continua ad assecondare l'allattamento o svezzamento secondo le indicazioni del Pediatra.`,
          `Parla tanto col bambino cantando canzoncine ed effettuando contatto visivo prolungato.`,
          `Pianifica i controlli medici periodici d'accordo col piano vaccinale territoriale.`
        ]
      });
    }
  } catch (error: any) {
    console.error("Gemini API error (tips):", error);
    res.status(500).json({ error: "Errore interno durante la generazione dei consigli", details: error.message });
  }
});

/**
 * Endpoint for interactive virtual pediatrician chat assistant.
 */
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const ai = getGenAI();
    if (!ai) {
      return res.status(200).json({
        success: false,
        reply: "Ciao! Sarei felicissimo di rispondere a tutte le tue domande sullo sviluppo, la nanna e la crescita del tuo bimbo. Tuttavia, per attivare le mie funzionalità intelligenti di Assistente Virtuale, è necessario aggiungere la chiave 'GEMINI_API_KEY' nella scheda 'Settings > Secrets' dell'ambiente AI Studio. Fino ad allora, ricorda di affidarti sempre alle raccomandazioni del tuo pediatra di fiducia per ogni dubbio medico!"
      });
    }

    const { message, chatHistory, babyContext } = req.body;

    const formattedContext = babyContext ? `
Contesto del neonato:
- Nome: ${babyContext.name || 'Neonato'}
- Genere: ${babyContext.gender === 'male' ? 'Maschio' : 'Femmina'}
- Data di Nascita: ${babyContext.birthDate}
- Età in mesi: ${babyContext.ageMonths?.toFixed(1) || 'Non calcolata'}
- Ultimo peso registrato: ${babyContext.currentWeight ? babyContext.currentWeight + ' kg' : 'Non inserito'}
- Ultima altezza registrata: ${babyContext.currentHeight ? babyContext.currentHeight + ' cm' : 'Non inserita'}
` : '';

    const systemInstruction = `Sei un Assistente Pediatrico Virtuale AI specializzato nella gestione e nello sviluppo del neonato nel primo anno di vita.
Fornisci risposte chiare, affettuose, rassicuranti ed estremamente dettagliate a domande relative a:
- Tappe di sviluppo motorio, cognitivo e sociale.
- Sonno infantile (ritmi circadiani, igiene del sonno, sicurezza nella culla).
- Alimentazione (allattamento al seno, artificiale, pappe, e avvio dello svezzamento).
- Pratiche di stimolazione sensoriale precoce (tummy time, lettura, giochi di interazione).
- Gestione di coliche, rigurgiti, eruzioni cutanee normali o fastidi per i primi dentini.

REGOLA FONDAMENTALE DI SICUREZZA: Non diagnosticare patologie cliniche o prescrivere farmaci (come antibiotici, antipiretici con dosi specifiche o integratori). Consiglia sempre di consultare il pediatra curante per problemi febbrili persistenti o campanelli d'allarme gravi.
Esprimiti sempre con calore e comprensione, usando la lingua italiana.`;

    const contents = [];

    // Add brief chat history if exists to maintain context
    if (chatHistory && Array.isArray(chatHistory)) {
      const recentHistory = chatHistory.slice(-6); // Last 6 messages to stay lightweight
      for (const msg of recentHistory) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current user prompt along with baby context
    const fullUserPrompt = `${formattedContext}
Nuova domanda dell'utente:
${message}`;

    contents.push({
      role: 'user',
      parts: [{ text: fullUserPrompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      success: true,
      reply: response.text || "Mi scuso, si è verificato un errore nel formulare la risposta."
    });

  } catch (error: any) {
    console.error("Gemini API error (chat):", error);
    res.status(500).json({ error: "Errore di connessione con l'AI", details: error.message });
  }
});

// Setup Vite & Static content hosting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BabyGrowth Server] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
