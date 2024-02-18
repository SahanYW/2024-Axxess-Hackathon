from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

app = Flask(__name__)
CORS(app)

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    userInput = data.get('userInput')

    if not userInput:
        return jsonify({"error": "userInput is required"}), 400

    systemInstruction = "You are an assistant for diagnosing diseases/illnesses.\nRespond in this specific manner\nFirst give a list of likely diseases and explanations for why.\nThen Specifically add the token '|' (required) between and give a list of suggested medications if exist, if not, then don't type anything"

    try:
        completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": systemInstruction},
            {"role": "user", "content": userInput}
        ]
    )

        # Access the text content of the response

        response_text = completion.choices[0].message.content  # Adjusted to access 'content' or the correct attribute

        # Split the response into diagnosis and medications
        response_parts = response_text.split('|')
        diagnosis = response_parts[0].strip()
        medications = response_parts[1].strip() if len(response_parts) > 1 else ""
        return jsonify({"diagnosis": diagnosis, "medications": medications})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

    


if __name__ == '__main__':
    app.run(debug=True)
