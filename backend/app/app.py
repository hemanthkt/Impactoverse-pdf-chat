from docling.document_converter import DocumentConverter
from fastapi import FastAPI,UploadFile,File, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware
import sys
import time
print(sys.executable)

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
    return {"message": "Welcome to AI Study Buddy!"}


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, file.filename)

    try:
        with open(temp_file_path,"wb") as buffer:

            # shutil.copyfileobj(file.file, buffer)
            
            # time.sleep(0.5)
            # os.remove(temp_file_path)

            content = await file.read()
            buffer.write(content)
            await file.close()
            converter = DocumentConverter()
            result =  converter.convert(temp_file_path)
            parsed_content = result.document.export_to_markdown()

            max_retries = 3
            for attempt in range(max_retries):
                try:
                    time.sleep(0.5)
                    os.remove(temp_file_path)
                    break
                except PermissionError:
                    if attempt == max_retries - 1:
                        print(f"Warning: Could not delete temprory file {temp_file_path}")  
                    continue  

            return JSONResponse(content={"parsed_content": parsed_content}, status_code=200)
        

    except Exception as e:
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except:
                print(f"Warning: could not delete temporary file{temp_file_path}")
        raise HTTPException(status_code=500, detail=str(e))