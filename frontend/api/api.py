from flask import Flask, request
from flask_cors import CORS  # Import CORS
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/api/translate', methods=['GET'])
def translate_text():
    # Get the target language and text from the query parameters
    target_lang = request.args.get('target_lang')
    text_to_translate = request.args.get('text')

    # Check if the required parameters are provided
    if not target_lang or not text_to_translate:
        return {"error": "Both 'target_lang' and 'text' parameters are required"}, 400

    # Perform the translation
    try:
        translated_text = GoogleTranslator(source='auto', target=target_lang).translate(text_to_translate)
        return {"translated_text": translated_text}, 200
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)
