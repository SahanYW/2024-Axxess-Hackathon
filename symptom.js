import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const OPEN_API_KEY = process.env.OPEN_API_KEY;
const openai = new OpenAI({ apiKey: OPEN_API_KEY });

const systemInstruction = "You are an assistant for diagnosing diseases/illnesses.\nRespond in this specific manner\nFirst give a list of likely diseases and explanations for why.\nThen Specifically add the token '|' (required) between and give a list of suggested medications if exist, if not, then don't type anything";

const userInput = "I have a headache and have a bit of a fever for the past few days";

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemInstruction }, { role: "user", content: userInput }],
    model: "gpt-3.5-turbo",
  });

  const rawResponse = completion.choices[0].message.content;
  const responseParts = rawResponse.split('|');
  const jsonResponse = {
    illness: responseParts[0].trim(),
    medication: responseParts.length > 1 ? responseParts[1].trim() : ""
  };

  return jsonResponse;
}

// Correct way to log the result
async function logResult() {
  const res = await main(); // Await the result of main
  console.log(`Illness: ${res.illness} \nMedication: ${res.medication}`);
}

logResult();
