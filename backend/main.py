from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
from s3 import PhotoService

app = FastAPI()
photo_service = PhotoService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/get_photos")
async def get_photos() -> List[dict]:
    return await photo_service.list_photos()

@app.post("/upload_photo")
async def upload_photo(file: UploadFile = File(...)):
    return await photo_service.upload_photo(file.file, file.filename)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)