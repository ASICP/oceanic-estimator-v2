# Project Blue Whale 🐋

**PE Tech Due Diligence SLM - Automated Investment Analysis**

[![GCP](https://img.shields.io/badge/GCP-Vertex%20AI-4285F4?logo=google-cloud)](https://cloud.google.com/vertex-ai)
[![Model](https://img.shields.io/badge/Model-Gemma%202%209B-blue)](https://ai.google.dev/gemma)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Building the first AI-native technical due diligence platform for Private Equity firms investing in technology disruption.

---

## 🎯 Overview

Project Blue Whale is a specialized Small Language Model (SLM) designed to automate technical due diligence for PE firms evaluating AI and Web3 investment opportunities. The system combines automated deal sourcing with comprehensive technology assessment across 8 critical dimensions.

### Core Capabilities

- **🔍 Automated Deal Sourcing**: Interactive qualification flow that pre-screens opportunities
- **🏗️ Tech Architecture Assessment**: Evaluates scalability, maintainability, and technical debt
- **👥 Engineering Team Analysis**: Assesses talent quality, leadership, and retention risks
- **🔒 Security & Compliance**: Reviews cybersecurity posture and regulatory readiness
- **📊 Multi-Modal Analysis**: Processes architecture diagrams and technical documentation
- **📝 Dual Output Format**: Generates both structured JSON and narrative Markdown reports

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloud Function API                        │
│                  (Python, Serverless)                        │
└────────────────┬────────────────────────────┬────────────────┘
                 │                            │
                 ▼                            ▼
    ┌────────────────────────┐   ┌──────────────────────┐
    │   Gemma 2 9B (Fine-    │   │  Gemini 1.5 Flash    │
    │   tuned on Vertex AI)  │   │  (Visual Analysis)   │
    │   • Tech DD Analysis   │   │  • Diagram Reading   │
    │   • CoT Reasoning      │   │  • Stack Detection   │
    └────────────────────────┘   └──────────────────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │   Structured Output     │
    │   • JSON (API)          │
    │   • Markdown (Reports)  │
    └────────────────────────┘
```

**Tech Stack:**
- **Model**: Gemma 2 9B (fine-tuned) + Gemini 1.5 Flash (multi-modal)
- **Platform**: GCP Vertex AI (training & inference)
- **API**: Cloud Functions (Python 3.11)
- **Storage**: Cloud Storage (training data, artifacts)
- **Framework**: Modified Deloitte Tech DD + YC Technical Diligence

---

## 📁 Repository Structure

```
blue-whale-pe-dd/
├── README.md                 # This file
├── requirements.txt          # Python dependencies
├── .gitignore               # Git ignore patterns
│
├── data/                    # Training and test data
│   ├── raw/                 # Unprocessed source data
│   │   ├── sec_filings/     # SEC S-1s and 10-Ks
│   │   ├── vc_reports/      # VC/PE white papers
│   │   ├── github_analyses/ # Repo code quality metrics
│   │   └── synthetic/       # GPT-4 generated examples
│   ├── processed/           # Formatted for training
│   │   ├── train.jsonl
│   │   ├── val.jsonl
│   │   └── test.jsonl
│   └── sources.md           # Data source documentation
│
├── scripts/                 # Data collection & processing
│   ├── data_collection/
│   │   ├── sec_scraper.py
│   │   ├── vc_report_scraper.py
│   │   ├── github_analyzer.py
│   │   └── synthetic_generator.py
│   ├── data_processing/
│   │   ├── format_converter.py
│   │   ├── quality_control.py
│   │   └── upload_to_gcs.py
│   └── training/
│       ├── fine_tune_gemma.py
│       └── evaluate.py
│
├── api/                     # Cloud Function API
│   ├── main.py              # Primary API endpoint
│   ├── requirements.txt     # API-specific dependencies
│   ├── visual_analyzer.py   # Gemini diagram analysis
│   ├── sourcing_agent.py    # Deal qualification flow
│   └── report_generator.py  # Output formatting
│
├── tests/                   # Test suite
│   ├── test_api.py
│   ├── test_data_quality.py
│   └── test_model_outputs.py
│
├── docs/                    # Documentation
│   ├── API_SPEC.md          # API documentation
│   ├── SETUP.md             # Setup instructions
│   ├── LESSONS_LEARNED.md   # Post-mortem insights
│   └── FUTURE_ROADMAP.md    # Next phase planning
│
└── examples/                # Usage examples
    ├── sample_requests.json
    └── sample_outputs/
```

---

## 🚀 Quick Start

### Prerequisites

- **GCP Account** with billing enabled
- **Python 3.11+** installed locally
- **Git** for version control
- **API Keys**: Anthropic/OpenAI (for synthetic data generation)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/blue-whale-pe-dd.git
cd blue-whale-pe-dd

# Create virtual environment
python -m venv blue-whale-env
source blue-whale-env/bin/activate  # On Windows: blue-whale-env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up GCP credentials
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Environment Setup

```bash
# Create .env file
cat > .env << EOF
GCP_PROJECT_ID=blue-whale-pe-dd
GCP_REGION=us-central1
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here
EOF

# Create GCS buckets
gsutil mb gs://bw-training-data-raw
gsutil mb gs://bw-training-data-processed
gsutil mb gs://bw-model-artifacts

# Enable required GCP APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable storage.googleapis.com
```

---

## 📊 Month 1 Implementation Plan

### Week 1: Data Collection & Environment Setup
- **Days 1-2**: GCP infrastructure setup
- **Days 3-5**: Data collection sprint (SEC, VC reports, GitHub)
- **Days 6-7**: Synthetic data generation (300 examples)
- **Deliverable**: 800-1,000 training examples

### Week 2: Data Processing & Model Fine-Tuning
- **Days 8-9**: Data preparation and JSONL formatting
- **Days 10-12**: Fine-tune Gemma 2 9B on Vertex AI
- **Day 13**: Model evaluation and validation
- **Deliverable**: Fine-tuned model deployed to endpoint

### Week 3: API Development & Multi-Modal Integration
- **Days 14-15**: Core API wrapper (Cloud Function)
- **Days 16-17**: Multi-modal pipeline (Gemini integration)
- **Days 18-19**: Chain-of-thought implementation
- **Day 20**: Testing and documentation
- **Deliverable**: Working API with multi-modal support

### Week 4: Deal Sourcing & Integration
- **Days 21-22**: Deal sourcing model (Use Case A)
- **Days 23-24**: Integration layer with data enrichment
- **Days 25-26**: Output formatting (JSON + Markdown)
- **Day 27**: End-to-end testing
- **Days 28-30**: Documentation, demo, and handoff
- **Deliverable**: Complete MVP with sourcing + tech DD

**Total Budget**: <$500 USD  
**Projected Spend**: ~$245  

---

## 🎯 Technical Due Diligence Framework

### 8 Assessment Dimensions

| Dimension | Score Range | Focus Areas |
|-----------|-------------|-------------|
| **Architecture Quality** | 0-10 | Modern stack, scalability, maintainability |
| **Engineering Team** | 0-10 | Talent quality, leadership, retention |
| **Technical Debt** | 0-10 | Code quality, test coverage, documentation |
| **Security Posture** | 0-10 | Vulnerabilities, compliance, practices |
| **Scalability** | 0-10 | Horizontal/vertical scaling, bottlenecks |
| **Development Velocity** | 0-10 | Release frequency, iteration speed |
| **Technical Moat** | 0-10 | Proprietary tech, patents, differentiation |
| **Infrastructure Maturity** | 0-10 | DevOps, monitoring, reliability |

**Output**: Overall DD Score (0-100) + narrative + risk flags + caveats

---

## 💻 Usage Examples

### API Call

```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/blue-whale-dd \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "TechCo AI",
    "tech_stack": "Python, FastAPI, PostgreSQL, AWS ECS",
    "team_size": 12,
    "description": "B2B SaaS for supply chain optimization using ML",
    "architecture_diagrams": ["gs://bucket/diagram.png"]
  }'
```

### Python SDK

```python
from blue_whale import DueDiligenceClient

client = DueDiligenceClient(project_id="blue-whale-pe-dd")

# Run tech DD
result = client.analyze_company(
    company_name="TechCo AI",
    tech_stack="Python, FastAPI, PostgreSQL, AWS ECS",
    team_size=12,
    description="B2B SaaS for supply chain optimization"
)

print(f"Overall Score: {result['overall_score']}/100")
print(f"Recommendation: {result['recommendation']}")
print(f"Narrative:\n{result['narrative']}")
```

### Output Example

**Structured (JSON)**:
```json
{
  "company_name": "TechCo AI",
  "overall_score": 78,
  "recommendation": "Pass",
  "scores_by_dimension": {
    "architecture_quality": 8,
    "engineering_team": 7,
    "technical_debt": 7,
    "security_posture": 8,
    "scalability": 8,
    "development_velocity": 9,
    "technical_moat": 7,
    "infrastructure_maturity": 8
  },
  "key_risks": [
    "Single cloud provider lock-in (AWS)",
    "Limited DevOps automation"
  ],
  "caveats": [
    "Proprietary ML models not reviewed",
    "Team size estimate based on LinkedIn"
  ]
}
```

---

## 📈 Performance Metrics

### Target Metrics (MVP)

- **Accuracy**: 90%+ (MAE < 10 points on 100-point scale)
- **Latency**: 500ms - 10 seconds per analysis
- **Query Volume**: 25/day (MVP stage)
- **JSON Validity**: 95%+
- **Budget**: <$500 total, <$50/month operational

### Model Performance

- **Base Model**: Gemma 2 9B
- **Fine-tuning**: 3 epochs, LoRA rank 16
- **Training Data**: 800-1,200 examples
- **Validation MAE**: Target <10 points

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Month 1) - Current
- [x] Data collection pipeline
- [x] Model fine-tuning infrastructure
- [x] API development
- [x] Use Cases A & B (Sourcing + Tech DD)

### 🔄 Phase 2: Enhancement (Months 2-3)
- [ ] Use Cases C & D (Risk/Cost + Strategic Alignment)
- [ ] Model improvement with real feedback
- [ ] Production hardening (auth, monitoring)
- [ ] User interface development

### 🔮 Phase 3: Scale (Months 4-6)
- [ ] Multi-region deployment
- [ ] Integration with deal management systems
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features

---

## 🤝 Contributing

This is currently a private project for internal development. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Documentation

- **[Setup Guide](docs/SETUP.md)**: Detailed setup instructions
- **[API Documentation](docs/API_SPEC.md)**: Complete API reference
- **[Month 1 Plan](Blue_Whale_Month1_Plan.pdf)**: Detailed implementation plan
- **[Data Sources](data/sources.md)**: Training data documentation

---

## 🐛 Known Issues & Limitations

### MVP Limitations
- Single-region deployment (us-central1 only)
- No authentication/authorization (add in Phase 2)
- Limited to 25 queries/day (serverless cold starts)
- Multi-modal analysis requires manual diagram upload

### Future Improvements
- Real-time tech stack detection from website scraping
- Integration with Crunchbase/PitchBook APIs
- Automated GitHub repository analysis
- Comparative analysis across portfolio companies

---

## 📊 Data Sources

### Training Data (800-1,200 examples)

**Tier 1: High-Quality (200-300 examples)**
- SEC filings (S-1s, 10-Ks) from tech IPOs
- VC/PE white papers (Bessemer, a16z, Sequoia)
- M&A acquisition post-mortems

**Tier 2: Synthetic (300-500 examples)**
- GPT-4 generated DD reports
- GitHub repository analyses

**Tier 3: Community (200-400 examples)**
- Reddit/HackerNews discussions
- Engineering blogs from acquired companies

---

## 💰 Budget & Costs

### Month 1 Budget: <$500

| Category | Cost |
|----------|------|
| Data Collection | $45 |
| Model Training (Vertex AI) | $120 |
| Inference (25 queries/day) | $8 |
| Multi-modal (Gemini) | $15 |
| Testing | $5 |
| Contingency | $50 |
| **Total** | **$245** |

### Ongoing Monthly Costs (Projected)

- Vertex AI endpoint: ~$8-10
- Cloud Storage: ~$2
- Cloud Functions: Free tier
- **Total**: <$50/month

---

## 🔐 Security & Privacy

- All training data anonymized before use
- No customer data stored on disk (in-memory processing only)
- GCP Secret Manager for API keys
- HTTPS-only API endpoints
- Regular security audits planned for Phase 2

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Deloitte Tech DD Framework**: Industry-standard methodology
- **YC Technical Diligence**: Startup-specific assessment criteria
- **Google Vertex AI**: Model training and deployment platform
- **Anthropic Claude**: Synthetic data generation and planning

---

## 📧 Contact

**Project Maintainer**: [Your Name]  
**Email**: [your.email@domain.com]  
**Project Link**: [https://github.com/YOUR_USERNAME/blue-whale-pe-dd](https://github.com/YOUR_USERNAME/blue-whale-pe-dd)

---

## 🎓 Learn More

- [Cetacean Labs Business Plan](./Cetacean_Labs__Business_Plan__Draft_v2_copy.pdf)
- [Project Blue Whale Whitepaper](./CLabsWPv1.pdf)
- [GCP Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemma Model Card](https://ai.google.dev/gemma)

---

<div align="center">

**Built with ❤️ for the future of PE technology investments**

[Report Bug](https://github.com/YOUR_USERNAME/blue-whale-pe-dd/issues) · 
[Request Feature](https://github.com/YOUR_USERNAME/blue-whale-pe-dd/issues) · 
[Documentation](docs/)

</div>
