import os
from flask import Flask, request, send_file
from flask_cors import CORS
import pyttsx3
import fitz
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/convert', methods=['POST'])
def convert_pdf_to_audio():
    if request.method == 'POST':
        file = request.files['file']
        
        if not file or file.filename == '':
            return 'No file uploaded.', 400
        
        if not file.filename.endswith('.pdf'):
            return 'Invalid file format. Please upload a PDF file.', 400
        
        print("Received file:", file.filename)  # Add debug statement
        
        # Save the uploaded PDF file temporarily
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_pdf:
            temp_pdf.write(file.read())
            temp_pdf_path = temp_pdf.name
        
        try:
            # Read PDF content
            pdf_document = fitz.open(temp_pdf_path)
            text = ""
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                text += page.get_text()
            
            # Convert text to audio
            output_file_path = os.path.join(tempfile.gettempdir(), 'output.mp3')
            engine = pyttsx3.init()
            engine.save_to_file(text, output_file_path)
            engine.runAndWait()
            
            # Send the audio file
            return send_file(output_file_path, mimetype='audio/mpeg', as_attachment=True, download_name='output.mp3')
        except Exception as e:
            print("Error:", str(e))
            return 'Error occurred while processing the PDF.', 500
        finally:
            # Clean up temporary files
            pdf_document.close()  # Close the PDF document
            try:
                os.remove(temp_pdf_path)
            except Exception as e:
                print("Error removing temp PDF file:", str(e))
            try:
                os.remove(output_file_path)
            except Exception as e:
                print("Error removing output audio file:", str(e))

@app.route('/')
def index():
    return 'Welcome to the PDF to Audio Converter!'

if __name__ == '__main__':
    app.run(debug=True)
