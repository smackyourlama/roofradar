class LeadScoring {
  /**
   * Scores a lead out of 100 based on data completeness and quality.
   * @param {Lead} lead 
   */
  static score(lead) {
    if (!lead.isQualified) {
      lead.score = 0;
      return lead;
    }

    let score = 50; // Base score for being qualified

    if (lead.website) score += 15;
    if (lead.email) score += 15;

    // Bonus points for good rating/reviews
    if (lead.metadata && lead.metadata.rating) {
      const ratingBonus = Math.floor(lead.metadata.rating * 4); // max 20 points for 5.0 rating
      score += ratingBonus;
    }

    // Cap at 100
    lead.score = Math.min(score, 100);
    
    console.log(`[Scoring] Assessed score of ${lead.score}/100 for ${lead.businessName || lead.fullName}`);
    return lead;
  }

  static processLeads(leads) {
    return leads.map(lead => this.score(lead));
  }
}

module.exports = { LeadScoring };
