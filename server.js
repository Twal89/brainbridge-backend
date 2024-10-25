require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();

// Configuration CORS
app.use(cors({
  origin: ['https://twal89.github.io'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Route test
app.get('/', (req, res) => {
  res.send('BrainBridge API is running');
});

// Route principale
app.post('/api/explain', async (req, res) => {
  try {
    const { name, age, question } = req.body;
    console.log('Requête reçue:', { name, age, question });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Explique à ${name}, qui a ${age} ans, le concept suivant : ${question}`
        }
      ],
      max_tokens: 500
    });

    console.log('Réponse reçue d\'OpenAI');
    res.json({ explanation: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la génération de la réponse.',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
