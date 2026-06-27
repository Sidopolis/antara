from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import os
import json
import boto3
import urllib.request
from jose import jwt as jose_jwt
import lancedb
import pyarrow as pa
from datetime import datetime
from dotenv import load_dotenv
import os
import json
import boto3
import urllib.request
from jose import jwt as jose_jwt
import lancedb
import pyarrow as pa
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# --- LanceDB Setup ---
lancedb_uri = "./lancedb_data"
db = lancedb.connect(lancedb_uri)

# Journals Schema (Vectors + Relational Data)
journal_schema = pa.schema([
    pa.field("vector", pa.list_(pa.float32(), 1024)), 
    pa.field("email", pa.string()),
    pa.field("content", pa.string()),
    pa.field("stress_score", pa.int32()),
    pa.field("focus_score", pa.int32()),
    pa.field("positivity_score", pa.int32()),
    pa.field("cognitive_distortions", pa.string()),
    pa.field("timestamp", pa.string())
])

# Chat History Schema (No vectors needed for pure history, but we keep it structured)
chat_schema = pa.schema([
    pa.field("email", pa.string()),
    pa.field("role", pa.string()),
    pa.field("content", pa.string()),
    pa.field("timestamp", pa.string())
])

try:
    journal_table = db.open_table("journals")
except:
    journal_table = db.create_table("journals", schema=journal_schema)

try:
    chat_table = db.open_table("chat_history")
except:
    chat_table = db.create_table("chat_history", schema=chat_schema)


app = FastAPI(title="Antara AI Backend - Pure LanceDB Architecture")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS Bedrock Clients
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.getenv('AWS_REGION', 'ap-south-1')
)
MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0"
EMBEDDING_MODEL_ID = "amazon.titan-embed-text-v2:0"

# --- AWS Cognito Auth Configuration ---
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID", "ap-south-1_RQE0iqB6L")
COGNITO_CLIENT_ID = os.getenv("COGNITO_CLIENT_ID", "3dc82s1j1bks6lpdooohkf8f5d")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")

JWKS_URL = f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}/.well-known/jwks.json"
JWKS = None
try:
    with urllib.request.urlopen(JWKS_URL) as response:
        JWKS = json.loads(response.read().decode("utf-8"))
except Exception as e:
    print("Failed to fetch JWKS on startup:", e)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Models ---
class JournalEntry(BaseModel):
    content: str

class ChatMessage(BaseModel):
    message: str

# --- Auth Helper Functions ---
async def get_current_user(token: str = Depends(oauth2_scheme)):
    if not JWKS:
        raise HTTPException(status_code=500, detail="Cognito JWKS not loaded")
    try:
        unverified_header = jose_jwt.get_unverified_header(token)
        rsa_key = {}
        for key in JWKS["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            payload = jose_jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=COGNITO_CLIENT_ID,
                issuer=f"https://cognito-idp.{AWS_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}"
            )
            email: str = payload.get("email") # ID token contains email
            if not email:
                email = payload.get("username") # Fallback for Access Token
            if not email:
                raise HTTPException(status_code=401, detail="Invalid token: no email")
            return email
        raise HTTPException(status_code=401, detail="Invalid token: kid not found")
    except Exception as e:
        print("AWS Cognito Auth Error:", str(e))
        raise HTTPException(status_code=401, detail="Authentication failed")

# --- AWS AI Helper Functions ---

def get_embedding(text: str):
    body = json.dumps({
        "inputText": text,
        "dimensions": 1024,
        "normalize": True
    })
    try:
        response = bedrock_runtime.invoke_model(
            body=body,
            modelId=EMBEDDING_MODEL_ID,
            accept='application/json',
            contentType='application/json'
        )
        response_body = json.loads(response.get('body').read())
        return response_body.get('embedding')
    except Exception as e:
        print("Bedrock Embedding Error:", str(e))
        raise HTTPException(status_code=500, detail="Embedding Service Unavailable")

def call_bedrock(system_prompt: str, user_prompt: str, max_tokens=300):
    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "temperature": 0.7,
        "system": system_prompt,
        "messages": [{"role": "user", "content": user_prompt}]
    })

    try:
        response = bedrock_runtime.invoke_model(
            body=body,
            modelId=MODEL_ID,
            accept='application/json',
            contentType='application/json'
        )
        response_body = json.loads(response.get('body').read())
        return response_body.get('content')[0].get('text')
    except Exception as e:
        print("Bedrock AI Error:", str(e))
        raise HTTPException(status_code=500, detail="AI Service Unavailable")

@app.post("/api/journal/analyze")
def analyze_journal(entry: JournalEntry, current_user: str = Depends(get_current_user)):
    if not entry.content:
        raise HTTPException(status_code=400, detail="Content cannot be empty")
        
    system_prompt = """
    You are an expert Cognitive Behavioral Therapy (CBT) engine analyzing student journal entries for Indian competitive exams (JEE/NEET).
    You must return ONLY a raw JSON object (no markdown, no backticks, just the { object }) with exactly these keys:
    "stress_score": integer (0-100),
    "focus_score": integer (0-100),
    "positivity_score": integer (0-100),
    "cognitive_distortions": short comma separated string of detected CBT distortions. If none, return "None".
    """
    
    ai_response = call_bedrock(system_prompt, entry.content, max_tokens=150)
    clean_json = ai_response.replace("```json", "").replace("```", "").strip()
    
    try:
        analysis = json.loads(clean_json)
    except Exception:
        analysis = {"stress_score": 50, "focus_score": 50, "positivity_score": 50, "cognitive_distortions": "General Stress"}
        
    # --- Store in LanceDB ---
    vector = get_embedding(entry.content)
    
    data = [{
        "vector": vector,
        "email": current_user,
        "content": entry.content,
        "stress_score": analysis.get("stress_score", 50),
        "focus_score": analysis.get("focus_score", 50),
        "positivity_score": analysis.get("positivity_score", 50),
        "cognitive_distortions": analysis.get("cognitive_distortions", "None"),
        "timestamp": datetime.utcnow().isoformat()
    }]
    journal_table.add(data)
    
    return {"id": len(journal_table), **analysis}

@app.get("/api/journal/history")
def get_history(current_user: str = Depends(get_current_user)):
    try:
        # Retrieve all journals for user and sort by timestamp descending using pandas
        df = journal_table.to_pandas()
        if df.empty:
            return []
        
        user_df = df[df['email'] == current_user]
        user_df = user_df.sort_values(by="timestamp", ascending=False).head(10)
        
        # Convert to list of dicts without the vector column for lightweight JSON
        results = user_df.drop(columns=['vector']).to_dict(orient="records")
        return results
    except Exception as e:
        print("LanceDB error:", str(e))
        raise HTTPException(status_code=500, detail="Database error")

@app.post("/api/chat")
def chat_with_ai(chat: ChatMessage, current_user: str = Depends(get_current_user)):
    if not chat.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    # --- RAG: Retrieve Similar Past Context from LanceDB ---
    query_vector = get_embedding(chat.message)
    
    try:
        # Search LanceDB for top 2 most semantically similar past journals
        results = journal_table.search(query_vector).where(f"email = '{current_user}'").limit(2).to_pandas()
        
        if not results.empty:
            past_journals = "\n".join(results['content'].tolist())
            context = f"Here are similar past feelings this student had:\n{past_journals}"
        else:
            context = "No similar past journal context found."
    except Exception as e:
        print("LanceDB search error:", e)
        context = "No past context available."
    
    system_prompt = f"You are Antara, an expert CBT coach for Indian students facing tough exams. Context (Past emotions): '{context}'. Identify their cognitive distortions gently, use cognitive restructuring to break down their panic logically, and give an actionable, realistic next step. Keep responses concise."
    
    ai_response = call_bedrock(system_prompt, chat.message, max_tokens=300)
    
    timestamp = datetime.utcnow().isoformat()
    data = [
        {"email": current_user, "role": "user", "content": chat.message, "timestamp": timestamp},
        {"email": current_user, "role": "ai", "content": ai_response, "timestamp": timestamp}
    ]
    chat_table.add(data)
    
    return {"response": ai_response}

@app.get("/api/chat/history")
def get_chat_history(current_user: str = Depends(get_current_user)):
    try:
        df = chat_table.to_pandas()
        if df.empty:
            return []
            
        user_df = df[df['email'] == current_user]
        user_df = user_df.sort_values(by="timestamp", ascending=True).head(50)
        
        return user_df.to_dict(orient="records")
    except Exception as e:
        print("Error fetching chat history:", str(e))
        raise HTTPException(status_code=500, detail="Database Error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
