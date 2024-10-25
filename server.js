const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();

app.use(cors({
  origin: ['https://twal89.github.io', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  console.log('Request headers:', req.headers);
  next();
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
  res.send('BrainBridge API is running');
});

app.post('/api/explain', async (req, res) => {
  try {
    console.log('Requête reçue sur /api/explain');
    console.log('Body:', req.body);
    
    const { name, age, question } = req.body;
    if (!name || !age || !question) {
      return res.status(400).json({ error: 'Il manque des informations requises' });
    }

    console.log('Appel à OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Explique à ${name}, qui a ${age} ans, le concept suivant : ${question}`
      }]
    });
    console.log('Réponse reçue d\'OpenAI');

    res.json({ explanation: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur détaillée:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
