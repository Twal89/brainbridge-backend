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
    console.log('Clé API utilisée:', process.env.OPENAI_API_KEY.substring(0, 8) + '...');
    console.log('Requête reçue:', { name, age, question });
    
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `Explique à ${name}, qui a ${age} ans, le concept suivant : ${question}`,
      max_tokens: 150
    });

    console.log('Réponse OpenAI:', completion);
    res.json({ explanation: completion.choices[0].text });
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(500).json({ 
      error: error.message, 
      type: error.constructor.name,
      stack: error.stack
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
