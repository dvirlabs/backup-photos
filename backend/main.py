from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from s3 import *


app = FastAPI()

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
async def get_photos():
    return await list_photos()
    




if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)