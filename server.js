require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors({ origin: 'https://twal89.github.io' }));
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",  // Utilisez un modèle plus récent
      prompt: prompt,
      max_tokens: 500
    });
      console.log('Réponse d\'OpenAI reçue:', completion.data);
      
      res.json({ explanation: completion.data.choices[0].text });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({ error: error.message || 'Une erreur est survenue lors de la génération de la réponse.' });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
