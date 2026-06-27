from fastapi.testclient import TestClient
from main import app

# Initialize the test client
client = TestClient(app)

def test_read_main():
    """
    Test that the FastAPI application initializes without error.
    Since we don't have a root route, we'll just check if a 404 is returned gracefully.
    """
    response = client.get("/")
    assert response.status_code == 404

def test_unauthorized_journal_access():
    """
    Test that the protected journal endpoints reject requests without a valid JWT token.
    """
    response = client.get("/api/journal/history")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_unauthorized_chat_access():
    """
    Test that the protected chat endpoints reject requests without a valid JWT token.
    """
    response = client.get("/api/chat/history")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}
