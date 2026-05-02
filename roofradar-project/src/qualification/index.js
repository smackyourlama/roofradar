class LeadQualification {
  /**
   * Qualifies a lead based on mandatory fields.
   * Required: (fullName OR businessName) AND phoneNumber AND physicalAddress
   * @param {Lead} lead 
   * @returns {boolean}
   */
  static qualify(lead) {
    const hasName = Boolean(lead.fullName || lead.businessName);
    const hasPhone = Boolean(lead.phoneNumber);
    const hasAddress = Boolean(lead.physicalAddress);

    const name = (lead.businessName || lead.fullName || "").toLowerCase();
    
    const stopWords = ["roofing", "contractors", "llc", "inc", "services", "builders", "construction"];
    // use word boundaries? actually simple includes is fine as requested: "contains words that strongly indicate"
    const isCompetitor = stopWords.some(word => name.includes(word));

    const isValid = hasName && hasPhone && hasAddress && !isCompetitor;
    lead.isQualified = isValid;
    
    if (!isValid) {
      if (isCompetitor) {
        console.log(`[Qualification] Lead disqualified as competitor: ${lead.businessName || lead.fullName}`);
      } else {
        console.log(`[Qualification] Lead disqualified. Missing requirements (Name: ${hasName}, Phone: ${hasPhone}, Address: ${hasAddress})`);
      }
    } else {
      console.log(`[Qualification] Lead qualified: ${lead.businessName || lead.fullName}`);
    }

    return isValid;
  }

  static processLeads(leads) {
    return leads.map(lead => {
      this.qualify(lead);
      return lead;
    });
  }
}

module.exports = { LeadQualification };
