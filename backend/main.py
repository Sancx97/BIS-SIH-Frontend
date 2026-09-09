from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://bis-sih-frontend-xbn3.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "BIS Backend is running!"}


@app.post("/api/ask")
def ask_bis(request: QuestionRequest):

    question = request.question.lower()

    if "bis" in question:
        answer = "BIS stands for Bureau of Indian Standards."

    elif "certification" in question:
        answer = (
            "BIS certification demonstrates conformity with applicable "
            "Indian Standards."
        )

    else:
        answer = (
            "I am a sample BIS AI assistant. "
            "The real AI/RAG system will answer this question later."
        )

    return {
        "answer": answer,
        "confidence": "medium",
        "sources": [
            {
                "title": "BIS Official Website",
                "url": "https://www.bis.gov.in"
            }
        ]
    }