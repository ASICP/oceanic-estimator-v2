import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { CompleteCostEstimate } from '@shared/schema';

export class PDFGenerator {
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
      doc.text(`Description: ${estimate.workflow.description}`, 20, yPosition);
      yPosition += 20;
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
        doc.text(`   Description: ${agent.description}`, 25, yPosition);
        yPosition += 8;
        if (agent.capabilities && agent.capabilities.length > 0) {
          doc.text(`   Capabilities: ${agent.capabilities.join(', ')}`, 25, yPosition);
          yPosition += 8;
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