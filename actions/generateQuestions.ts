import { OpenAI } from "openai";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuestions = async (
  technology: string,
  experienceLevel: string,
) => {
  if (!technology || !experienceLevel) {
    throw new Error("Technology and experience level are required");
  }

  try {
    const prompt = `
      Generate 5 ${experienceLevel} level multiple-choice questions for ${technology}.
      Format the output as a strict JSON array like this:
      [
        {
          "question": "What does HTML stand for?",
          "options": ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language", "None of the above"],
          "correctAnswer": "Hyper Text Markup Language"
        },
        ...
      ]
      Only return valid JSON. Do not include any additional text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates coding questions in JSON format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const responseText = response.choices[0].message?.content || "[]";
    const questions = JSON.parse(responseText);

    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions");
  }
};
