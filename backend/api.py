from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/enhance")
async def enhance_image(
    file: UploadFile = File(...),
    preset: str = Form(...)
):
    # TODO: Call Gemini or your processing logic here
    # result_url = process_image(file, preset)

    return {
        "message": "Processed",
        "preset": preset,
        # "imageUrl": result_url
    }
