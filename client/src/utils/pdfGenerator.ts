import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { CompleteCostEstimate } from '@shared/schema';

export class PDFGenerator {
  // Helper function to wrap text for PDF
  private static wrapText(doc: jsPDF, text: string, x: number, startY: number, maxWidth: number, lineHeight: number = 10): number {
    const lines = doc.splitTextToSize(text, maxWidth);
    let yPosition = startY;
    
    lines.forEach((line: string) => {
      doc.text(line, x, yPosition);
      yPosition += lineHeight;
    });
    
    return yPosition;
  }

  static async generateSummaryPDF(estimate: CompleteCostEstimate): Promise<void> {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Cost Estimation Summary', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Project: ${estimate.title || 'Unnamed Project'}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    
    // Key Metrics
    doc.setFontSize(16);
    doc.text('Key Metrics', 20, 80);
    doc.setFontSize(12);
    
    const totalCost = parseFloat(estimate.totalCost?.toString() || '0');
    const traditionalCost = parseFloat(estimate.traditionalCost?.toString() || '0');
    const savings = parseFloat(estimate.savingsAmount?.toString() || '0');
    const savingsPercent = parseFloat(estimate.savingsPercentage?.toString() || '0');
    
    doc.text(`Total Implementation Cost: $${totalCost.toLocaleString()}`, 20, 100);
    doc.text(`Traditional Approach Cost: $${traditionalCost.toLocaleString()}`, 20, 110);
    doc.text(`Total Savings: $${savings.toLocaleString()} (${savingsPercent}%)`, 20, 120);
    
    // Agent Configuration
    if (estimate.agents && estimate.agents.length > 0) {
      doc.text('Agent Configuration', 20, 140);
      estimate.agents.forEach((agent: any, index: number) => {
        doc.text(`• ${agent.name} - ${agent.role}`, 25, 155 + (index * 10));
      });
    }
    
    // Resource Configuration
    doc.text('Resource Configuration', 20, 180);
    doc.text(`API Calls per Month: ${estimate.apiCalls?.toLocaleString() || 'N/A'}`, 25, 195);
    doc.text(`Data Transfer: ${estimate.dataTransfer || 'N/A'} GB`, 25, 205);
    doc.text(`Error Rate: ${estimate.errorRate || 'N/A'}%`, 25, 215);
    doc.text(`Billing Model: ${estimate.billingModel || 'N/A'}`, 25, 225);
    
    const fileName = `cost_estimate_summary_${Date.now()}.pdf`;
    doc.save(fileName);
  }
  
  static async generateDetailedPDF(estimate: CompleteCostEstimate): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 30;
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > 280) {
        doc.addPage();
        yPosition = 30;
      }
    };
    
    // Header
    doc.setFontSize(20);
    doc.text('Detailed Cost Estimation Report', 20, yPosition);
    yPosition += 20;
    
    doc.setFontSize(12);
    doc.text(`Project: ${estimate.title || 'Unnamed Project'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 20;
    
    // Executive Summary
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    const totalCost = parseFloat(estimate.totalCost?.toString() || '0');
    const traditionalCost = parseFloat(estimate.traditionalCost?.toString() || '0');
    const savings = parseFloat(estimate.savingsAmount?.toString() || '0');
    const savingsPercent = parseFloat(estimate.savingsPercentage?.toString() || '0');
    
    doc.text(`Our AI-powered approach delivers significant cost savings`, 20, yPosition);
    yPosition += 10;
    doc.text(`compared to traditional implementations:`, 20, yPosition);
    yPosition += 15;
    
    doc.text(`• Implementation Cost: $${totalCost.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`• Traditional Cost: $${traditionalCost.toLocaleString()}`, 25, yPosition);
    yPosition += 10;
    doc.text(`• Your Savings: $${savings.toLocaleString()} (${savingsPercent}%)`, 25, yPosition);
    yPosition += 20;
    
    // Workflow Details
    checkPageBreak(50);
    doc.setFontSize(16);
    doc.text('Workflow Configuration', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    if (estimate.workflow) {
      doc.text(`Title: ${estimate.workflow.title}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Domain: ${estimate.workflow.domain}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Complexity: ${estimate.workflow.complexity}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Duration: ${estimate.workflow.duration}`, 20, yPosition);
      yPosition += 10;
      yPosition = this.wrapText(doc, `Description: ${estimate.workflow.description}`, 20, yPosition, 170);
      yPosition += 10;
    }
    
    // Agent Team Details
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.text('Agent Team Configuration', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    if (estimate.agents && estimate.agents.length > 0) {
      estimate.agents.forEach((agent: any, index: number) => {
        checkPageBreak(40);
        doc.text(`${index + 1}. ${agent.name} - ${agent.role}`, 25, yPosition);
        yPosition += 10;
        doc.text(`   Domain: ${agent.domain}`, 25, yPosition);
        yPosition += 8;
        yPosition = this.wrapText(doc, `   Description: ${agent.description}`, 25, yPosition, 165, 8);
        if (agent.capabilities && agent.capabilities.length > 0) {
          yPosition = this.wrapText(doc, `   Capabilities: ${agent.capabilities.join(', ')}`, 25, yPosition, 165, 8);
        }
        yPosition += 5;
      });
    }
    
    // Technical Specifications
    checkPageBreak(80);
    doc.setFontSize(16);
    doc.text('Technical Specifications', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    doc.text(`API Calls per Month: ${estimate.apiCalls?.toLocaleString() || 'N/A'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Data Transfer: ${estimate.dataTransfer || 'N/A'} GB`, 20, yPosition);
    yPosition += 10;
    doc.text(`Error Rate: ${estimate.errorRate || 'N/A'}%`, 20, yPosition);
    yPosition += 10;
    doc.text(`Batch Size: ${estimate.batchSize || 'N/A'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Auto Scale: ${estimate.autoScale ? 'Enabled' : 'Disabled'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Multi Model: ${estimate.multiModel ? 'Enabled' : 'Disabled'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Model Provider: ${estimate.modelProvider || 'N/A'}`, 20, yPosition);
    yPosition += 20;
    
    // Billing & Pricing
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.text('Billing & Pricing Structure', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    doc.text(`Billing Model: ${estimate.billingModel || 'N/A'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Tier: ${estimate.tier || 'N/A'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Volume Discount: ${estimate.volumeDiscount ? 'Applied' : 'Not Applied'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`BYO API Keys: ${estimate.byoApiKeys ? 'Yes' : 'No'}`, 20, yPosition);
    yPosition += 10;
    if (estimate.taxRate) {
      doc.text(`Tax Rate: ${estimate.taxRate}%`, 20, yPosition);
      yPosition += 10;
    }
    if (estimate.margin) {
      doc.text(`Margin: ${estimate.margin}%`, 20, yPosition);
      yPosition += 10;
    }
    yPosition += 10;
    
    // Cost Breakdown
    if (estimate.costBreakdown) {
      checkPageBreak(60);
      doc.setFontSize(16);
      doc.text('Cost Breakdown', 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      
      const breakdown = estimate.costBreakdown as any;
      if (Array.isArray(breakdown)) {
        breakdown.forEach((item: any, index: number) => {
          checkPageBreak(15);
          doc.text(`${item.category}: $${parseFloat(item.cost).toLocaleString()}`, 25, yPosition);
          yPosition += 10;
        });
      }
    }
    
    const fileName = `cost_estimate_detailed_${Date.now()}.pdf`;
    doc.save(fileName);
  }

  static async generateGenericContract(estimate: CompleteCostEstimate): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 30;
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > 280) {
        doc.addPage();
        yPosition = 30;
      }
    };
    
    // Header
    doc.setFontSize(20);
    doc.text('AI Agent Development Service Agreement', 20, yPosition);
    yPosition += 20;
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Project: ${estimate.title || 'Unnamed Project'}`, 20, yPosition);
    yPosition += 20;
    
    // Parties Section
    checkPageBreak(40);
    doc.setFontSize(16);
    doc.text('1. PARTIES', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    yPosition = this.wrapText(doc, 'This Service Agreement ("Agreement") is entered into between CLabs ("Service Provider") and the Client for the development and implementation of AI agent solutions.', 20, yPosition, 170);
    yPosition += 15;
    
    // Scope of Work
    checkPageBreak(80);
    doc.setFontSize(16);
    doc.text('2. SCOPE OF WORK', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    const totalCost = parseFloat(estimate.totalCost?.toString() || '0');
    const savingsPercent = parseFloat(estimate.savingsPercentage?.toString() || '0');
    
    yPosition = this.wrapText(doc, `Service Provider agrees to develop and implement an AI agent solution for ${estimate.title || 'the specified workflow'} with the following specifications:`, 20, yPosition, 170);
    yPosition += 10;
    
    if (estimate.agents && estimate.agents.length > 0) {
      doc.text('Agent Configuration:', 20, yPosition);
      yPosition += 8;
      estimate.agents.forEach((agent: any) => {
        checkPageBreak(15);
        yPosition = this.wrapText(doc, `• ${agent.name} - ${agent.role}: ${agent.description}`, 25, yPosition, 165, 8);
        yPosition += 5;
      });
      yPosition += 10;
    }
    
    doc.text('Technical Specifications:', 20, yPosition);
    yPosition += 8;
    doc.text(`• API Calls: ${estimate.apiCalls?.toLocaleString() || 'TBD'} per month`, 25, yPosition);
    yPosition += 8;
    doc.text(`• Data Processing: ${estimate.dataTransfer || 'TBD'} GB capacity`, 25, yPosition);
    yPosition += 8;
    doc.text(`• Error Rate Target: <${estimate.errorRate || '2'}%`, 25, yPosition);
    yPosition += 8;
    doc.text(`• Billing Model: ${estimate.billingModel || 'Hybrid'}`, 25, yPosition);
    yPosition += 15;
    
    // Project Cost and Timeline
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.text('3. PROJECT COST AND TIMELINE', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    doc.text(`Total Project Cost: $${totalCost.toLocaleString()}`, 20, yPosition);
    yPosition += 10;
    yPosition = this.wrapText(doc, `This AI-powered solution delivers approximately ${savingsPercent}% cost savings compared to traditional development approaches.`, 20, yPosition, 170);
    yPosition += 15;
    
    yPosition = this.wrapText(doc, 'Implementation Timeline: 3 phases over 6-12 weeks', 20, yPosition, 170);
    yPosition += 8;
    doc.text('• Phase 1: Setup & Configuration (1-2 weeks)', 25, yPosition);
    yPosition += 8;
    doc.text('• Phase 2: Testing & Optimization (2-3 weeks)', 25, yPosition);
    yPosition += 8;
    doc.text('• Phase 3: Full Deployment (1 week)', 25, yPosition);
    yPosition += 20;
    
    // Terms and Conditions
    checkPageBreak(100);
    doc.setFontSize(16);
    doc.text('4. TERMS AND CONDITIONS', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    
    const terms = [
      'Payment Terms: 50% upfront, 50% upon project completion and acceptance.',
      'Intellectual Property: Client retains ownership of custom workflows and configurations. CLabs retains ownership of underlying AI agent framework and methodology.',
      'Support: 30 days of post-implementation support included. Extended support available separately.',
      'Confidentiality: Both parties agree to maintain confidentiality of proprietary information.',
      'Warranty: Service Provider warrants that the delivered solution will perform substantially as specified for 90 days from delivery.',
      'Limitation of Liability: Service Provider\'s liability shall not exceed the total contract value.'
    ];
    
    terms.forEach((term, index) => {
      checkPageBreak(25);
      yPosition = this.wrapText(doc, `${index + 1}. ${term}`, 20, yPosition, 170);
      yPosition += 10;
    });
    
    // Signatures
    checkPageBreak(60);
    doc.setFontSize(16);
    doc.text('5. SIGNATURES', 20, yPosition);
    yPosition += 20;
    doc.setFontSize(12);
    
    doc.text('CLabs:', 20, yPosition);
    yPosition += 20;
    doc.text('Signature: _________________________', 20, yPosition);
    yPosition += 10;
    doc.text('Date: _____________', 20, yPosition);
    yPosition += 25;
    
    doc.text('Client:', 20, yPosition);
    yPosition += 20;
    doc.text('Signature: _________________________', 20, yPosition);
    yPosition += 10;
    doc.text('Date: _____________', 20, yPosition);
    
    const fileName = `ai_agent_contract_${Date.now()}.pdf`;
    doc.save(fileName);
  }
  
  static async generateFromElement(elementId: string, fileName: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id '${elementId}' not found`);
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      allowTaint: true,
      useCORS: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(fileName);
  }
}