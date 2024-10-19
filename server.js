require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require("openai");
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors({
  origin: ['https://twal89.github.io', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.send('BrainBridge API is running');
});

app.post('/api/explain', async (req, res) => {
  try {
    console.log('Requête reçue:', req.body);
    const { name, age, question } = req.body;
    
    console.log('Données extraites:', { name, age, question });
    
    const prompt = `Explique à ${name}, qui a ${age} ans, le concept suivant : ${question}`;
    console.log('Prompt généré:', prompt);
    
    console.log('Tentative d\'appel à OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });
    console.log('Réponse d\'OpenAI reçue:', completion);
    
    res.json({ explanation: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur détaillée:', error);
    res.status(500).json({ error: error.message || 'Une erreur est survenue lors de la génération de la réponse.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
