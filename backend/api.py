from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import base64
import tempfile
from pathlib import Path

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
    preset: str = Form(...),
    logoBase64: str | None = Form(None),
    selectedColor: str | None = Form(None),
):
    # Save uploaded file temporarily
    contents = await file.read()
    tmp_dir = Path(tempfile.gettempdir())
    input_path = tmp_dir / file.filename

    with open(input_path, "wb") as f:
        f.write(contents)

    # TODO: هنا تربط Gemini أو أي منطق معالجة صور عندك
    # result_path = process_image(input_path, preset, logoBase64, selectedColor)

    # For now, just return a placeholder image URL (so frontend works end-to-end)
    return {
        "imageUrl": "https://via.placeholder.com/512.png?text=Processed+Image",
        "preset": preset,
        "selectedColor": selectedColor,
    }
