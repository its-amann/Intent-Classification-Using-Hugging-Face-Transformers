from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import DebertaTokenizerFast, TFDebertaForSequenceClassification
import numpy as np
from pathlib import Path
from typing import Dict
import tensorflow as tf

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load DeBERTa model and tokenizer
model_id = "microsoft/deberta-base"
tokenizer = DebertaTokenizerFast.from_pretrained(model_id)
model = TFDebertaForSequenceClassification.from_pretrained(model_id, num_labels=12)  # Update num_labels based on your training

# Map intent indices to labels
intent_labels = {
    0: "account_creation",
    1: "account_update",
    2: "billing_inquiry",
    3: "product_information",
    4: "technical_support",
    5: "order_status",
    6: "payment_issue",
    7: "shipping_info",
    8: "refund_request",
    9: "complaint",
    10: "general_inquiry",
    11: "feedback"
}

@app.get("/")
def read_root():
    return {"message": "Intent Classification API"}

@app.post("/predict")
async def predict(request: Request) -> Dict:
    try:
        # Get JSON data from request body
        data = await request.json()
        text = data.get('text', '')
        
        if not text:
            return {
                "status": "error",
                "message": "No text provided"
            }
            
        # Tokenize the input text
        inputs = tokenizer(text, return_tensors="tf", padding=True, truncation=True)
        
        # Get model prediction
        outputs = model(inputs)
        logits = outputs.logits.numpy()
        
        # Get probabilities using softmax
        probs = tf.nn.softmax(logits, axis=-1).numpy()[0]
        
        # Get the predicted class and confidence
        predicted_class = np.argmax(probs)
        confidence = float(probs[predicted_class] * 100)
        
        # Get the intent label
        intent = intent_labels[int(predicted_class)]
        
        return {
            "status": "success",
            "prediction": {
                "intent": intent,
                "confidence": confidence
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
