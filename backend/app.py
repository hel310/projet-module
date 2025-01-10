from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Make sure the API key is properly set
api_key = "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"

# Initialize Groq client
client = Groq(api_key=api_key)

@app.route('/api/ask', methods=['POST'])
def ask_bot():
    try:
        # Get the message from the request
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "No message provided"}), 400

        user_message = data['message']
        
        # Create the chat completion with proper error handling
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a French-speaking web development expert assistant. Provide helpful, detailed responses in French."
                    },
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                model="mixtral-8x7b-32768",  # Updated model name
                temperature=0.7,
                max_tokens=2048
            )
            
            # Extract the response
            if chat_completion and chat_completion.choices and len(chat_completion.choices) > 0:
                bot_response = chat_completion.choices[0].message.content
                return jsonify({"response": bot_response})
            else:
                return jsonify({"error": "No response generated"}), 500

        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            return jsonify({"error": f"Error with Groq API: {str(e)}"}), 500

    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    # Run on port 5001 as discussed earlier
    app.run(debug=True, port=5001)




