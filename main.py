from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import numpy as np

# Load the trained model
model = tf.keras.models.load_model("../models/exercise_classifier.h5")

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (for frontend-backend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request schema
class ExerciseInput(BaseModel):
    features: list[float]

# Prediction endpoint
@app.post("/predict")
def predict(data: ExerciseInput):
    input_data = np.array([data.features])
    prediction = model.predict(input_data)
    predicted_class = int(np.argmax(prediction, axis=1)[0])
    return {
        "prediction": predicted_class,
        "probabilities": prediction.tolist()
    }
