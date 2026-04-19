const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateDescription(title, location) {
  const prompt = `Write a short travel description for ${title} in ${location}`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "user", content: prompt }
    ],
    model: "llama-3.1-8b-instant", // ✅ latest working model
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = { generateDescription };