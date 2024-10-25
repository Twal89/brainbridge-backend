const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
  res.send('BrainBridge API is running');
});

app.post('/api/explain', async (req, res) => {
  try {
    const { name, age, question } = req.body;
    console.log('Requête reçue:', { name, age, question });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Explique à ${name}, qui a ${age} ans, le concept suivant : ${question}`
      }]
    });

    res.json({ explanation: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
