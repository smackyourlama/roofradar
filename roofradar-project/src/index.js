const crypto = require('crypto');
const { LeadDiscovery } = require('./discovery');
const { LeadQualification } = require('./qualification');
const { LeadScoring } = require('./scoring');

async function runPhase3() {
  console.log("=== Roofradar Phase 3: Pipeline Started ===");

  // 1. Discovery
  const discovery = new LeadDiscovery("GooglePlacesMock");
  let leads = await discovery.discoverLeads("Roofing Contractors", "Springfield");
  console.log(`\nDiscovered ${leads.length} potential leads.\n`);

  // 2. Qualification
  leads = LeadQualification.processLeads(leads);
  
  const qualifiedLeads = leads.filter(l => l.isQualified);
  console.log(`\nQualified ${qualifiedLeads.length} out of ${leads.length} leads.\n`);

  // 3. Scoring
  leads = LeadScoring.processLeads(leads);

  console.log("\n=== Final Lead Report ===");
  leads.forEach(lead => {
    console.log(`- ${lead.businessName || lead.fullName}`);
    console.log(`  Qualified: ${lead.isQualified ? 'Yes' : 'No'}`);
    if (lead.isQualified) {
      console.log(`  Score: ${lead.score}`);
      console.log(`  Phone: ${lead.phoneNumber}`);
      console.log(`  Address: ${lead.physicalAddress}`);
    }
    console.log('---');
  });
}

// Make crypto available globally for our mock ID generation if needed, or rely on node's native crypto
if (!global.crypto) {
  global.crypto = crypto;
}

runPhase3().catch(console.error);
