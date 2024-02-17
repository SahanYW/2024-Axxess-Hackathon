const OPEN_API_KEY='notanAPIKey';
import OpenAI from "openai";

const openai = new OpenAI({apiKey: OPEN_API_KEY});
// Prompt for GPT
const systemInstruction = "You are an assistant for diagnosing diseases/illnesses.\nRespond in this specific manner\nFirst give a list of likely diseases and explanations for why.\nThen Specifically add the token '|' (required) between and give a list of suggested medications if exist, if not, then don't type anything"

// User Input, change this to whatever the input is
const userInput = "I have a headache and have a bit of a fever for the past few days";
// Function for API, returns the JSON of response
async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemInstruction}, {role:"user", content: userInput}],
    model: "gpt-3.5-turbo",
  });
  const rawResponse = completion.choices[0].message.content;
  const responseParts = rawResponse.split('|');
  const jsonResponse = {
        illness: responseParts[0].trim(),
        medication: responseParts[1].trim()
  };
  return jsonResponse;

}

main();