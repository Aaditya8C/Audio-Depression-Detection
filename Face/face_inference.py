import os
import cv2
import torch
import numpy as np
from PIL import Image
from torchvision import transforms
from models.face_model_arch import ResEmoteNet

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

emotion_labels = ["angry","disgust","fear","happy","sad","surprise","neutral"]


# ---------------- LOAD MODEL ----------------
def load_face_model(model_path):
    model = ResEmoteNet(num_classes=7)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model


# ---------------- TRANSFORM ----------------
inference_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],
                         [0.229,0.224,0.225])
])


face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)


# ---------------- EMOTION VECTOR ----------------
def get_emotion_vector(model, image_tensor):
    with torch.no_grad():
        image_tensor = image_tensor.unsqueeze(0).to(device)
        outputs = model(image_tensor)
        probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
    return probs


# ---------------- MAIN FUNCTION ----------------
def get_face_emotion_from_image(image_path, model):

    try:
        img = cv2.imread(image_path)

        if img is None:
            print("Invalid image path")
            return np.zeros(7)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            print("No face detected")
            return np.zeros(7)

        for (x,y,w,h) in faces:
            face = img[y:y+h, x:x+w]

        face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
        face = Image.fromarray(face)
        image = inference_transform(face).to(device)
        emotion_vector = get_emotion_vector(model, image)

        return emotion_vector

    except Exception as e:
        print(f"Face inference error: {e}")
        return np.zeros(7)
    
  
