import os
import boto3
import json
from dotenv import load_dotenv

load_dotenv()

def list_models():
    print("Fetching available models...")
    try:
        bedrock = boto3.client('bedrock-runtime', region_name=os.getenv('AWS_DEFAULT_REGION', 'ap-south-1'))
        
        # Test Embeddings (Titan v2)
        print("1. Testing Amazon Titan Embeddings v2...")
        body = json.dumps({"inputText": "Test sentence for embeddings.", "dimensions": 1024, "normalize": True})
        response = bedrock.invoke_model(
            body=body,
            modelId="amazon.titan-embed-text-v2:0",
            accept='application/json',
            contentType='application/json'
        )
        print("   ✅ Embeddings successful!")
        
        # Test Claude 3.5 Sonnet
        print("2. Testing Anthropic Claude 3.5 Sonnet...")
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 10,
            "messages": [{"role": "user", "content": "Say hello!"}]
        })
        response = bedrock.invoke_model(
            body=body,
            modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
            accept='application/json',
            contentType='application/json'
        )
        print("   ✅ Claude 3.5 successful!")
        print("\nAll AWS services configured properly!")
    except Exception as e:
        print(f"\n Error accessing AWS Bedrock: {str(e)}")

if __name__ == "__main__":
    list_models()
