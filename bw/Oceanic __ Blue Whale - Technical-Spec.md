# ![][image1] Oceanic // Blue Whale \- Domain-Specific SLM Integration

**Technical Specification v1.0 \- Esteemed Agents → Oceanic**

**Created:** November 16, 2025  
**Owner:** Cetacean Labs \- Chris McGrath  
**Status:** Implementation Ready

---

## Executive Summary

**Blue Whale** is a curated catalog of domain-specific small language models (3B-13B parameters) that add industry expertise to applications built in Esteemed Agents. These specialized SLMs outperform general-purpose models on domain tasks while being 10-100x faster and cheaper.

### What Blue Whale Provides

- **Legal SLMs** (Llama Legal, Phi-3 Legal) \- Contract analysis, legal research  
- **Medical SLMs** (MedAlpaca, Medical Llama) \- Clinical notes, diagnosis coding  
- **Financial SLMs** (FinGPT, Mistral Finance) \- Sentiment analysis, risk assessment  
- **Logistics SLMs** \- Route optimization, supply chain analysis  
- **Manufacturing SLMs** \- Quality control, predictive maintenance  
- **Real Estate SLMs** \- Property valuation, market analysis

### Architecture Overview

```
User: "Build legal contract analyzer"
    ↓
Discovery Agent detects: Legal domain
    ↓
Recommends: Llama Legal 7B
    ↓
Generates app + SLM integration code
    ↓
Deploys: App with domain-specific SLM
```

### Relationship to Other Components

- **Agents (Tara, Gemma, Clay)** → Basis of **Dolphin** (separate, already exist)  
- **Blue Whale Library** → Contains both Models and Skills  
  - **Models (Platform Level)** → Domain-specific SLMs \= Knowledge  
  - **Skills (Agent Level)** → Capabilities \= Tools/Actions

---

## 1\. Domain-Specific SLM Catalog

### Legal Domain

**SaulLM-7B** ([Hugging Face](https://huggingface.co/Equall/SaulLM-7B))

- **Training:** Legal documents, case law, contracts  
- **Use Cases:** Contract analysis, clause extraction, compliance  
- **Benchmarks:** CUAD 82% F1, LegalBench 78%  
- **Size:** 4.1GB (4-bit quantized)  
- **Cost:** \~$0.001/request (self-hosted)

**Phi-3 Legal 3.8B**

- **Training:** Legal corpus fine-tuned from Phi-3-mini  
- **Use Cases:** Legal research, document review  
- **Size:** 2.3GB (4-bit)  
- **Speed:** 2x faster than Llama models

### Medical/Healthcare Domain

**MedAlpaca-7B** ([GitHub](https://github.com/kbressem/medAlpaca))

- **Training:** PubMed, medical textbooks, clinical notes  
- **Use Cases:** Clinical summaries, ICD-10 coding, drug interactions  
- **Benchmarks:** MedQA 52%, PubMedQA 71%  
- **Size:** 4.1GB (4-bit)  
- **Compliance:** HIPAA-ready deployment

**ClinicalGPT-7B**

- **Training:** MIMIC-III, clinical guidelines  
- **Use Cases:** Patient chart analysis, decision support  
- **Size:** 4.1GB (4-bit)

### Financial Domain

**FinGPT-7B** ([GitHub](https://github.com/AI4Finance-Foundation/FinGPT))

- **Training:** SEC filings, earnings calls, financial news  
- **Use Cases:** Sentiment analysis, earnings summarization, risk extraction  
- **Benchmarks:** FinancialPhraseBank 94%, F

iQA 89%

- **Size:** 4.1GB (4-bit)  
- **Updates:** Market data integration available

**Mistral-Finance-7B**

- **Training:** Bloomberg data, financial statements  
- **Use Cases:** Portfolio analysis, fraud detection  
- **Size:** 4.3GB (4-bit)  
- **Speed:** Optimized for low-latency trading apps

### Other Domains (Custom Fine-Tunes Required)

**Logistics Llama-7B**

- Route optimization, inventory management, shipping cost analysis

**Manufacturing GPT-7B**

- Quality control, predictive maintenance, production optimization

**RealEstate Llama-7B**

- Property valuation, market trends, zoning analysis

---

## 2\. Model Serving Infrastructure

### 2.1 Inference Engines

**vLLM (GPU Inference)**

- Best for: Production deployments, high throughput  
- Hardware: NVIDIA T4, A10, A100  
- Performance: 50-100 tokens/sec  
- Features: PagedAttention, batching, multi-model serving  
- Cost: $0.50-2.00/hour GPU time

**Ollama (Local Serving)**

- Best for: Development, privacy-sensitive deployments  
- Hardware: Any system with 8GB+ RAM  
- Performance: 20-50 tokens/sec (CPU), 80-150 (Apple Silicon)  
- Features: One-command model serving, auto-quantization  
- Cost: Free (self-hosted)

**llama.cpp (CPU Inference)**

- Best for: Edge deployments, cost optimization  
- Hardware: Any CPU with AVX2  
- Performance: 10-30 tokens/sec  
- Features: Aggressive quantization, GGUF format  
- Cost: Minimal compute costs

### 2.2 Deployment Architecture

```
# docker-compose.yml for SLM serving

services:
  vllm-legal:
    image: vllm/vllm-openai:latest
    command: --model Equall/SaulLM-7B --quantization awq --max-model-len 4096
    ports:
      - "8001:8000"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
  
  ollama-medical:
    image: ollama/ollama:latest
    volumes:
      - ./models:/root/.ollama
    ports:
      - "11434:11434"
    command: serve
  
  blue-whale-registry:
    build: ./registry
    ports:
      - "3000:3000"
    environment:
      - VLLM_ENDPOINT=http://vllm-legal:8000
      - OLLAMA_ENDPOINT=http://ollama-medical:11434
    volumes:
      - ./config:/app/config
```

### 2.3 Model Registry Service

```ts
// /server/src/services/BlueWhaleRegistry.ts

interface SLMModel {
  id: string;
  name: string;
  domain: string;
  description: string;
  size: string;
  quantization: '4-bit' | '8-bit' | 'fp16';
  baseModel: string;
  capabilities: string[];
  benchmarks: Record<string, number>;
  servingEndpoint?: string;
  huggingFaceRepo?: string;
  license: string;
  status: 'ready' | 'custom-required';
}

export class BlueWhaleRegistry {
  private models: Map<string, SLMModel> = new Map();

  constructor() {
    this.loadCatalog();
  }

  private loadCatalog() {
    // Legal models
    this.registerModel({
      id: 'saul-lm-7b',
      name: 'SaulLM-7B',
      domain: 'legal',
      description: 'Legal document analysis and contract review',
      size: '4.1GB',
      quantization: '4-bit',
      baseModel: 'Llama 2 7B',
      capabilities: ['contract-analysis', 'clause-extraction', 'legal-qa'],
      benchmarks: { CUAD: 0.82, LegalBench: 0.78 },
      huggingFaceRepo: 'Equall/SaulLM-7B',
      license: 'Apache 2.0',
      status: 'ready',
    });

    // Medical models
    this.registerModel({
      id: 'med-alpaca-7b',
      name: 'MedAlpaca-7B',
      domain: 'medical',
      description: 'Clinical note summarization and medical coding',
      size: '4.1GB',
      quantization: '4-bit',
      baseModel: 'LLaMA 7B',
      capabilities: ['clinical-notes', 'icd-coding', 'drug-interactions'],
      benchmarks: { MedQA: 0.52, PubMedQA: 0.71 },
      huggingFaceRepo: 'medalpaca/medalpaca-7b',
      license: 'Apache 2.0',
      status: 'ready',
    });

    // Financial models
    this.registerModel({
      id: 'fingpt-7b',
      name: 'FinGPT-7B',
      domain: 'financial',
      description: 'Financial sentiment analysis and earnings summarization',
      size: '4.1GB',
      quantization: '4-bit',
      baseModel: 'LLaMA 7B',
      capabilities: ['sentiment-analysis', 'earnings-summary', 'risk-extraction'],
      benchmarks: { FinancialPhraseBank: 0.94, FiQA: 0.89 },
      huggingFaceRepo: 'FinGPT/fingpt-forecaster_dow30_llama2-7b',
      license: 'Apache 2.0',
      status: 'ready',
    });

    // Add more models...
  }

  registerModel(model: SLMModel): void {
    this.models.set(model.id, model);
  }

  getModelsByDomain(domain: string): SLMModel[] {
    return Array.from(this.models.values())
      .filter(m => m.domain === domain);
  }

  getModel(id: string): SLMModel | undefined {
    return this.models.get(id);
  }

  recommendModel(domain: string, requirements?: {
    maxSize?: string;
    minAccuracy?: number;
    capabilities?: string[];
  }): SLMModel | null {
    const candidates = this.getModelsByDomain(domain)
      .filter(m => m.status === 'ready');

    if (candidates.length === 0) return null;

    // Simple recommendation: return first ready model
    // TODO: Add sophisticated matching based on requirements
    return candidates[0];
  }

  getAllDomains(): string[] {
    return Array.from(new Set(
      Array.from(this.models.values()).map(m => m.domain)
    ));
  }
}
```

---

## 3\. Natural Language Domain Detection

### 3.1 Discovery Agent Enhancement

```ts
// /server/src/services/DiscoveryAgentService.ts

interface DomainDetection {
  domain: 'legal' | 'medical' | 'financial' | 'logistics' | 'manufacturing' | 'real-estate' | 'general';
  confidence: number;
  suggestedSLMs: string[];
  reasoning: string;
}

class DiscoveryAgentService {
  private registry: BlueWhaleRegistry;

  constructor() {
    this.registry = new BlueWhaleRegistry();
  }

  async detectDomain(userInput: string): Promise<DomainDetection> {
    const lower = userInput.toLowerCase();

    // Legal domain
    if (this.matchesKeywords(lower, [
      'legal', 'contract', 'agreement', 'clause', 'law', 'lawyer',
      'litigation', 'compliance', 'regulation', 'attorney', 'nda',
      'm&a', 'merger', 'acquisition', 'due diligence'
    ])) {
      return {
        domain: 'legal',
        confidence: 0.9,
        suggestedSLMs: ['saul-lm-7b', 'phi-3-legal'],
        reasoning: 'Detected legal terminology and contract-related keywords',
      };
    }

    // Medical domain
    if (this.matchesKeywords(lower, [
      'medical', 'clinical', 'patient', 'diagnosis', 'healthcare',
      'hospital', 'doctor', 'nurse', 'medication', 'treatment',
      'icd', 'cpt', 'hipaa', 'ehr', 'emr', 'prescription'
    ])) {
      return {
        domain: 'medical',
        confidence: 0.9,
        suggestedSLMs: ['med-alpaca-7b', 'clinical-gpt-7b'],
        reasoning: 'Detected medical and healthcare terminology',
      };
    }

    // Financial domain
    if (this.matchesKeywords(lower, [
      'financial', 'finance', 'trading', 'investment', 'portfolio',
      'stock', 'market', 'earnings', 'revenue', 'profit', 'loss',
      'sec filing', 'analyst', 'hedge fund', 'risk', 'fraud'
    ])) {
      return {
        domain: 'financial',
        confidence: 0.9,
        suggestedSLMs: ['fingpt-7b', 'mistral-finance-7b'],
        reasoning: 'Detected financial and investment terminology',
      };
    }

    // Logistics domain
    if (this.matchesKeywords(lower, [
      'logistics', 'supply chain', 'warehouse', 'shipping', 'delivery',
      'route', 'inventory', 'freight', 'distribution', 'tracking'
    ])) {
      return {
        domain: 'logistics',
        confidence: 0.85,
        suggestedSLMs: ['logistics-llama-7b'],
        reasoning: 'Detected logistics and supply chain terminology',
      };
    }

    // Default
    return {
      domain: 'general',
      confidence: 0.5,
      suggestedSLMs: [],
      reasoning: 'No specific domain detected',
    };
  }

  private matchesKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }
}
```

### 3.2 UI Integration

```ts
// /client/src/components/DomainSLMSelector.tsx

import React from 'react';

interface Props {
  domain: string;
  suggestedSLMs: SLMModel[];
  onSelect: (slmId: string) => void;
}

export const DomainSLMSelector: React.FC<Props> = ({
  domain,
  suggestedSLMs,
  onSelect,
}) => {
  return (
    <div className="domain-slm-selector">
      <h3>Domain-Specific AI Detected: {domain}</h3>
      <p>Blue Whale recommends these specialized models:</p>
      
      {suggestedSLMs.map(slm => (
        <div key={slm.id} className="slm-card">
          <h4>{slm.name}</h4>
          <p>{slm.description}</p>
          
          <div className="slm-specs">
            <span>Size: {slm.size}</span>
            <span>Speed: {slm.quantization}</span>
            <span>License: {slm.license}</span>
          </div>
          
          <div className="slm-benchmarks">
            {Object.entries(slm.benchmarks).map(([test, score]) => (
              <div key={test}>
                <span>{test}:</span>
                <span>{(score * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          
          <button onClick={() => onSelect(slm.id)}>
            Use This Model
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## 4\. Blue Whale Library Structure

### 4.1 Two-Category Framework

**Blue Whale Library** contains two distinct categories:

#### 1\. Models (Platform Level) \= Knowledge

Domain-specific SLMs that provide expertise:

- **Legal Models** \- SaulLM, Phi-3 Legal  
- **Medical Models** \- MedAlpaca, ClinicalGPT  
- **Financial Models** \- FinGPT, Mistral Finance  
- **Logistics/Manufacturing/Real Estate Models**

**Characteristic:** Passive knowledge, trained expertise, inference-based

#### 2\. Skills (Agent Level) \= Capabilities

Tools and actions that agents can perform:

- **Tools/MCPs** \- API integrations, database access, external services  
- **Workflows** \- Pre-built automation patterns, task sequences  
- **Custom Functions** \- Domain-specific actions

**Characteristic:** Active capabilities, executable functions, action-based

### 4.2 Distinction: Models vs Skills

| Aspect | Models (Knowledge) | Skills (Capabilities) |
| :---- | :---- | :---- |
| **Nature** | Passive, inference-based | Active, execution-based |
| **Provides** | Domain expertise | Functional abilities |
| **Example** | SaulLM knows legal terminology | API tool can fetch case law |
| **Usage** | Query for analysis | Execute for action |
| **Level** | Platform (foundational) | Agent (operational) |

### 4.3 Skill Structure (Agent Level)

```ts
interface Skill {
  id: string;
  name: string;
  type: 'tool' | 'workflow' | 'function';
  description: string;
  addedCapabilities: string[];
  requirements: {
    apiKeys?: string[];
    permissions?: string[];
  };
}

// Example: Legal research API skill
const legalResearchSkill: Skill = {
  id: 'skill-legal-research-api',
  name: 'Case Law Research (CourtListener API)',
  type: 'tool',
  description: 'Search and retrieve case law from CourtListener database',
  addedCapabilities: [
    'Search case law',
    'Fetch court opinions',
    'Track citations',
    'Access dockets',
  ],
  requirements: {
    apiKeys: ['COURTLISTENER_API_KEY'],
    permissions: ['read:cases', 'read:opinions'],
  },
};
```

### 4.4 Combining Models \+ Skills

**Powerful Pattern:** Agents use Models (knowledge) \+ Skills (actions) together

```ts
// Example: Legal analysis agent
const legalAgent = {
  name: 'Legal Analyst',
  
  // Knowledge layer (Models)
  models: [
    'saul-lm-7b',  // Understands legal terminology and concepts
  ],
  
  // Capability layer (Skills)
  skills: [
    'courtlistener-api',  // Can fetch case law
    'document-parser',    // Can extract text from PDFs
    'contract-comparison', // Can compare contracts
  ],
  
  // Workflow: Analyze contract
  workflow: async (contract) => {
    // 1. Use Model for analysis
    const analysis = await models['saul-lm-7b'].analyze(contract);
    
    // 2. Use Skills for actions
    const precedents = await skills['courtlistener-api'].search(analysis.issues);
    const comparison = await skills['contract-comparison'].compare(contract, precedents);
    
    return { analysis, precedents, comparison };
  },
};
```

### 4.5 Roadmap for Skills Category

**Phase 1 (Current):** Focus on Models

- Catalog domain-specific SLMs  
- Build serving infrastructure  
- Integrate into App Builder

**Phase 2 (Future):** Add Skills

- MCP tool integrations  
- Pre-built workflows  
- Custom function library

**Phase 3 (Future):** Marketplace

- Community-contributed skills  
- Third-party model integrations  
- Skill certification program

```

---

## 5. Implementation Plan

### Phase 1: Catalog & Infrastructure (Weeks 1-2)

**Week 1: Model Research**
- [ ] Research and document all available domain SLMs
- [ ] Test SaulLM-7B, MedAlpaca, FinGPT locally
- [ ] Benchmark performance on domain tasks
- [ ] Document licensing and deployment requirements

**Week 2: Serving Infrastructure**
- [ ] Set up vLLM inference server
- [ ] Set up Ollama for local development
- [ ] Create Docker Compose configuration
- [ ] Build BlueWhaleRegistry service
- [ ] Create model download/deployment scripts

### Phase 2: Integration (Weeks 3-4)

**Week 3: Discovery & Recommendation**
- [ ] Enhance Discovery Agent with domain detection
- [ ] Build SLM recommendation engine
- [ ] Create domain-SLM mapping logic
- [ ] Test natural language → domain → SLM flow

**Week 4: Code Generation**
- [ ] Create code templates for SLM integration
- [ ] Generate FastAPI/Express endpoints for SLMs
- [ ] Add Docker configs for model serving
- [ ] Test end-to-end: user input → deployed app with SLM

### Phase 3: Polish & Documentation (Week 5)

- [ ] Write integration guides for each domain
- [ ] Create example apps using Blue Whale SLMs
- [ ] Document performance benchmarks
- [ ] Add cost calculators
- [ ] Internal testing and feedback

### Phase 4: Launch in EA (Week 6)

- [ ] Beta release to EA users
- [ ] Gather feedback on SLM recommendations
- [ ] Monitor performance and costs
- [ ] Fix critical bugs
- [ ] **Official launch of Blue Whale Foundation in EA**

### Phase 5: Fork to Oceanic (Post-Launch)

- Fork EA codebase → Oceanic repository
- Rebrand Blue Whale Foundation → Blue Whale Library
- Add Porpoise training UI
- Add SLM marketplace
- Launch Oceanic MVP

---

## 6. Success Metrics

**Catalog Metrics:**
- 10+ domain-specific SLMs cataloged
- 5+ domains covered (legal, medical, financial, logistics, manufacturing)
- 3+ SLMs production-ready (tested, deployed)

**Usage Metrics:**
- 20%+ of new apps use domain-specific SLMs
- 90%+ accuracy in domain detection
- <5 minutes to integrate SLM into app

**Performance Metrics:**
- 50+ tokens/sec inference speed (vLLM)
- <$0.01 per request (self-hosted)
- 99% uptime for SLM serving

---

## Summary

This spec defines the **Blue Whale Foundation** - infrastructure for cataloging, serving, and integrating domain-specific SLMs into Esteemed Agents applications:

**Core Components:**
1. **SLM Catalog (Models)** - Curated library of legal, medical, financial, logistics, manufacturing, and real estate models
2. **Serving Infrastructure** - vLLM, Ollama, llama.cpp deployment options  
3. **Domain Detection** - Natural language → domain → SLM recommendation
4. **Blue Whale Library Structure** - Two categories: Models (platform/knowledge) and Skills (agent/capabilities)

**Timeline:** 6 weeks to launch in EA, then fork to Oceanic

**What's NOT included** (separate efforts):
- Agent templates (agents already exist, basis of Dolphin)
- General LLM integration (agent feature, not Blue Whale)
- Custom training UI (Porpoise - added post-fork)
- Skills category development (Phase 2, post-Models launch)

This creates the **Models category of Blue Whale Library** - focused, domain-specific SLMs that become the knowledge foundation for the Oceanic Platform MVP. Skills category to follow in Phase 2.
```

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAB80lEQVR4Xu2Z3U3DMBCAMwIjMAIjdBRvUDZgBEYIUhM6BiN0hI7AC1Jp+1BqQUv62a5/4taOdJ/0veDz+S4KtglNIwiCIAiCIAiCIDSN6nfzoweLK9VuHhk/aa4063LNHJNC9V9PlqZinN4DUN3u09JIksxdLSw8h1yjOlhwTrlWNbDQ3HK9KlDd9o2FjlCfAraToOW6xbEUGe/SPMf1z87j3e6D40UxGkhzxbwnzjGLzYxjRbE0ES1zDgmJuTtsIFXmHeIbLwIbSJV5q0b12zUbSLK2TcuH0cAImbtaWPhYmb9K9N/NLHy0tR1VNoyiM8l1qoLF5pbrVQGLvJFrrluUbEdXoFy/CDm/psTKWu4GCymo95Kj2sPDKZ5jwdzkyLqj7CeIkq92LtlTFNEbmuPOnfiZec48mtAvPZyXhPcBHN8QznFhzKWBNzjfA2B8MhefgIYeNxTG+rAWHfHwhhh5fm0Z5+U8ebl/4VgIeh4LYUwolr3G+quUhTFFcy4MvpGp9/2rZf6/t/jnorHIn4wbwliPztdQLfYzS7zbnA/ASD5R2ZcXJpiq7CsK507u8soOb93J3V7dDyzxhpyThOo3iokvDDx7NZadOrlgzk3N40XfzC4WcNzUQmChMQ9viOq+n1FT0n1AEARBEARBEAShCD88Y5gXhEDk4QAAAABJRU5ErkJggg==>