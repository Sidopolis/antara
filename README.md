# Antara Studio: The "Borrowed Brain" for Students

## ?? Chosen Vertical
**Mental Health & Student Wellness for Competitive Exams (JEE/NEET/UPSC)**
Indian students preparing for high-stakes exams face unprecedented pressure. The core issue isn't just academic difficulty; it is the crushing weight of *Financial Guilt* (coaching fees/parental debt) and *Peer Comparison*. Standard mood trackers fail because they only track generic sadness. Antara is a GenAI-powered conversational companion built specifically to uncover these hidden socio-cultural triggers.

## ?? Approach and Logic
Antara acts as a **"Borrowed Brain"**. When students are paralyzed by cognitive overload, they lack the mental bandwidth to organize their thoughts. 
1. **Frictionless Input:** Students log open-ended, messy journals.
2. **Hidden Trigger Parsing:** The backend forces AWS Bedrock (Claude 3.5 Sonnet) to analyze the text and output a strict JSON schema identifying specific triggers (Financial Guilt, Academic Panic).
3. **RAG Vector Search:** Journal entries are embedded using Amazon Titan and stored in **LanceDB**. When a student chats, Antara retrieves semantically similar past emotional states to provide hyper-contextualized Cognitive Behavioral Therapy (CBT).

## ?? How the Solution Works
- **Frontend (Vite + React + Tailwind v4):** A premium, cinematic interface using Shadcn UI and Framer Motion. The UI dynamically reacts—if guilt scores are high, it offers a grounded, structured visual intervention rather than a basic chat bubble.
- **Backend (FastAPI):** A pure Python backend managing API routes and JWT validation.
- **Database (LanceDB):** We unified our database architecture by entirely removing SQLite. We use LanceDB locally to store both 1024-dimensional semantic vectors and relational metadata (timestamps, scores, user emails) for maximum efficiency.
- **Authentication (AWS Cognito):** Secure, enterprise-grade user pools handling login states.

## ?? Assumptions Made
- We assume students prefer frictionless, unstructured journaling rather than filling out clinical surveys.
- We assume the backend is running locally for the MVP, with LanceDB operating as an embedded database rather than a managed cloud instance.
- We assume the AWS IAM roles are properly scoped in the `.env` (which is safely ignored from version control).

---

## ?? Evaluation Focus Areas (For Judges)

### Code Quality
Built on a modern React/FastAPI stack. The codebase strictly separates concerns (UI components in `src/components`, API logic in `main.py`). We use Pydantic models in Python to ensure robust, type-safe API request validation.

### Security
Integrated with **AWS Cognito**. The FastAPI backend securely intercepts and verifies JSON Web Tokens (JWTs) via JWKS validation on every API call. All database queries in LanceDB strictly filter by the authenticated `current_user` email, guaranteeing complete data privacy. `.env` files and AWS keys are strictly `.gitignore`'d.

### Efficiency
Eliminated legacy relational databases to migrate 100% to **LanceDB**, a high-performance columnar PyArrow database. Using LanceDB for both RAG vector search and relational history drastically reduces latency, cloud costs, and architectural complexity.

### Testing
The decoupled architecture between FastAPI endpoints and React components makes the system entirely ready for comprehensive unit testing (pytest/Jest). The backend uses deep `try/except` blocks to gracefully handle AWS Bedrock rate limits or DB locks without crashing.

### Accessibility
All interactive components are built using Shadcn UI (Radix UI foundation) ensuring full WAI-ARIA compliance, keyboard navigation, and screen reader support. The deep space dark mode provides accessible contrast ratios, and animations are kept smooth and subtle to prevent motion sickness.

