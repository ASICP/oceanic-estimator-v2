import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica'
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1a1a1a'
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  label: {
    color: '#666'
  },
  value: {
    fontWeight: 'bold'
  },
  divider: {
    borderBottom: '1 solid #ddd',
    marginVertical: 10
  },
  footer: {
    marginTop: 30,
    fontSize: 9,
    color: '#999',
    textAlign: 'center'
  }
});

interface PorpoisePDFDocumentProps {
  formData: any;
  result: any;
  scalingMultiplier?: number;
  migrationData?: any;
}

export const PorpoisePDFDocument = ({ formData, result, scalingMultiplier = 1, migrationData }: PorpoisePDFDocumentProps) => {
  // Calculate scaling scenarios
  const scalingScenarios = [
    { label: 'Current Scale (1x)', multiplier: 1 },
    { label: '2x Scale', multiplier: 2 },
    { label: '5x Scale', multiplier: 5 },
    { label: '10x Scale', multiplier: 10 }
  ];
  
  // Check if result data is available
  const hasValidData = result && result.customerCosts && result.tierPricing;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Porpoise v2 - Pricing Quote</Text>
        
        {!hasValidData ? (
          <View style={styles.section}>
            <Text>Error: Calculation data not available. Please recalculate pricing.</Text>
          </View>
        ) : (
          <>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuration</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tier:</Text>
          <Text style={styles.value}>{result.tierPricing.tierName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Billing Period:</Text>
          <Text style={styles.value}>{formData.billingPeriod}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Team Size:</Text>
          <Text style={styles.value}>{formData.numUsers} users</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>GPU Hours/Month:</Text>
          <Text style={styles.value}>{formData.gpuHoursMonthly} hours</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Storage:</Text>
          <Text style={styles.value}>{formData.storageGb} GB</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>API Calls/Month:</Text>
          <Text style={styles.value}>{formData.apiCallsMonthly.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Avatars:</Text>
          <Text style={styles.value}>{formData.numAvatars}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Base Cost:</Text>
          <Text style={styles.value}>${result.tierPricing.baseMonthlyCost.toLocaleString()}/month</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Usage Costs:</Text>
          <Text style={styles.value}>${result.usageCosts.totalUsageCost.toFixed(2)}/month</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Monthly Total:</Text>
          <Text style={styles.value}>${result.customerCosts.monthlyCost.toLocaleString()}/month</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Total:</Text>
          <Text style={[styles.value, { fontSize: 14 }]}>${result.customerCosts.annualCost.toLocaleString()}/year</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {result.competitors && result.competitors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competitive Savings</Text>
          {result.competitors.slice(0, 3).map((comp: any, idx: number) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>vs {comp.competitorName}:</Text>
              <Text style={[styles.value, { color: '#16a34a' }]}>
                Save ${Number(comp.savings || 0).toLocaleString()} ({Number(comp.savingsPercent || 0).toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {result.competitors && result.competitors.length > 0 && (
        <>
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ROI Highlights</Text>
            <View style={styles.row}>
              <Text style={styles.label}>First Year Savings:</Text>
              <Text style={styles.value}>${Number(result.competitors[0]?.savings || 0).toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cost Savings:</Text>
              <Text style={styles.value}>{Number(result.competitors[0]?.savingsPercent || 0).toFixed(1)}%</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
        </>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Growth Scenarios - Projected Annual Costs</Text>
        {scalingScenarios.map((scenario, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.label}>{scenario.label}:</Text>
            <Text style={styles.value}>
              ${(result.customerCosts.annualCost * scenario.multiplier).toLocaleString()}/year
            </Text>
          </View>
        ))}
      </View>
      
      {migrationData && migrationData.competitorName && (
        <>
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Migration Analysis - {migrationData.competitorName}</Text>
            {migrationData.dataExportCost !== undefined && (
              <View style={styles.row}>
                <Text style={styles.label}>Data Export Cost:</Text>
                <Text style={styles.value}>${Number(migrationData.dataExportCost).toFixed(2)}</Text>
              </View>
            )}
            {migrationData.totalMigrationCost !== undefined && (
              <View style={styles.row}>
                <Text style={styles.label}>Total Migration Cost:</Text>
                <Text style={styles.value}>${Number(migrationData.totalMigrationCost).toFixed(2)}</Text>
              </View>
            )}
            {migrationData.annualSavings !== undefined && (
              <View style={styles.row}>
                <Text style={styles.label}>Annual Savings:</Text>
                <Text style={[styles.value, { color: '#16a34a' }]}>${Number(migrationData.annualSavings).toFixed(2)}</Text>
              </View>
            )}
            {migrationData.paybackMonths !== undefined && (
              <View style={styles.row}>
                <Text style={styles.label}>Payback Period:</Text>
                <Text style={styles.value}>{Number(migrationData.paybackMonths).toFixed(1)} months</Text>
              </View>
            )}
            {migrationData.threeYearSavings !== undefined && (
              <View style={styles.row}>
                <Text style={styles.label}>3-Year Total Savings:</Text>
                <Text style={[styles.value, { color: '#16a34a', fontSize: 13 }]}>
                  ${Number(migrationData.threeYearSavings).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </>
      )}
          </>
        )}
      
      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} | Porpoise v2 Pricing Calculator
      </Text>
    </Page>
  </Document>
  );
};
