from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    return thresh

def compareImages(imageA, imageB):
    imgB_resized = cv2.resize(imageB, (imageA.shape[1], imageA.shape[0]))
    threshA = preprocess_image(imageA)
    threshB = preprocess_image(imgB_resized)
    score, _ = ssim(threshA, threshB, full=True)

    if score <= 0.5:
        return {'error': 'The images do not match; they are not of the same place.'}

    diff = cv2.absdiff(threshA, threshB)
    waste_pixels = np.count_nonzero(diff)
    total_pixels = diff.size
    cleaned_percentage = (1 - ((waste_pixels) / total_pixels)) * 100

    return {'cleaned': cleaned_percentage < 90}

def decode_image(base64_str):
    img_data = base64.b64decode(base64_str.split(',')[1])
    image = Image.open(BytesIO(img_data)).convert('RGB')
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

@app.route('/compare_images', methods=['POST'])
def compare_images_route():
    data = request.json
    try:
        imageA = decode_image(data['uncleanedSrc'])
        imageB = decode_image(data['cleanedSrc'])
        result = compareImages(imageA, imageB)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
