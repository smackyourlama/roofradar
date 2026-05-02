const { Lead } = require('../models/Lead');

class LeadDiscovery {
  constructor(source) {
    this.source = source;
  }

  async discoverLeads(query, location) {
    console.log(`[Discovery] Searching for intent-driven leads ("${query}") in ${location} via ${this.source}...`);
    return this.mockApiCall();
  }

  async mockApiCall() {
    const rawData = [
      {
        businessName: "Main Street Bakery",
        phoneNumber: "555-1111",
        physicalAddress: "123 Main St, Springfield",
        website: "https://bakery.example.com",
        email: "contact@bakery.example.com",
        metadata: { intent: "Roof leaking near the oven" }
      },
      {
        // Competitor - should be disqualified
        businessName: "Elite Roofing Pros LLC",
        phoneNumber: "555-0101",
        physicalAddress: "222 Roof St, Springfield",
      },
      {
        // Valid personal lead
        fullName: "Jane Smith",
        phoneNumber: "555-0104",
        physicalAddress: "789 Oak Ave, Springfield",
        metadata: { intent: "Hail damage from last night" }
      },
      {
        // Missing phone - should be disqualified
        fullName: "Bob Jones",
        physicalAddress: "456 High St, Springfield",
        metadata: { intent: "Missing shingles" }
      },
      {
        // Competitor
        fullName: "Joe's Construction Inc",
        phoneNumber: "555-9999",
        physicalAddress: "111 Build Blvd, Springfield"
      }
    ];

    return rawData.map(data => new Lead(data));
  }
}

module.exports = { LeadDiscovery };
