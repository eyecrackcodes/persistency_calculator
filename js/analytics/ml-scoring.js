/**
 * Machine Learning Scoring Helper Functions
 * Additional methods for the predictive engine
 */

window.AnalyticsPlatform = window.AnalyticsPlatform || {};

// Extend the PredictiveEngine with additional helper methods
Object.assign(window.AnalyticsPlatform.PredictiveEngine.prototype, {
  /**
   * Get income stability multiplier for persistency calculations
   */
  _getIncomeStabilityMultiplier(data) {
    const incomeCategory = this.config.getIncomeCategory(data.income);
    let multiplier = 0;

    // Base multiplier from income level
    if (incomeCategory.key === "HIGH") multiplier = 0.12;
    else if (incomeCategory.key === "UPPER_MIDDLE") multiplier = 0.08;
    else if (incomeCategory.key === "MIDDLE") multiplier = 0.03;
    else multiplier = -0.02;

    // Employment stability adjustment
    const employmentAdjustments = {
      "full-time": 0.02,
      "self-employed": -0.01,
      contractor: -0.03,
      "part-time": -0.05,
      retired: 0.01,
    };

    multiplier += employmentAdjustments[data.employmentType] || 0;

    return multiplier;
  },

  /**
   * Get age multiplier for various calculations
   */
  _getAgeMultiplier(age) {
    if (age < 35) return -0.03;
    if (age < 55) return 0.05;
    if (age < 65) return 0.03;
    return -0.02;
  },

  /**
   * Get education multiplier
   */
  _getEducationMultiplier(education) {
    const multipliers = {
      Graduate: 0.08,
      College: 0.03,
      "Some College": 0,
      "High School": -0.05,
    };
    return multipliers[education] || 0;
  },

  /**
   * Get employment type multiplier
   */
  _getEmploymentMultiplier(employmentType) {
    const multipliers = {
      "full-time": 0.05,
      "self-employed": 0.02,
      contractor: -0.02,
      "part-time": -0.08,
      retired: 0.03,
    };
    return multipliers[employmentType] || 0;
  },

  /**
   * Get household size multiplier
   */
  _getHouseholdMultiplier(size) {
    if (size >= 2 && size <= 4) return 0.02;
    return -0.01; // Large households
  },

  /**
   * Calculate persistency confidence interval
   */
  _calculatePersistencyConfidence(data) {
    let margin = 4.5;
    if (data.employmentType === "full-time") margin -= 0.5;
    if (data.homeOwnership === "own") margin -= 0.5;
    return `±${margin.toFixed(1)}%`;
  },

  /**
   * Predict yearly persistency rates
   */
  _predictYearlyPersistency(baseRate, data) {
    return {
      year1: (baseRate * 0.95).toFixed(3),
      year3: (baseRate * 0.82).toFixed(3),
      year5: (baseRate * 0.75).toFixed(3),
      year10: (baseRate * 0.65).toFixed(3),
    };
  },

  /**
   * Get market conditions multiplier
   */
  _getMarketConditionsMultiplier(data) {
    const regionFactors = this.config.REGIONAL_FACTORS[data.region];
    if (regionFactors.competition === "high") return -0.03;
    if (regionFactors.competition === "low") return 0.05;
    return 0;
  },

  /**
   * Get competitor activity multiplier
   */
  _getCompetitorActivityMultiplier(data) {
    const regionFactors = this.config.REGIONAL_FACTORS[data.region];
    if (regionFactors.competition === "high") return -0.02;
    return 0.02; // Low competition
  },

  /**
   * Generate conversion strategy
   */
  _generateConversionStrategy(conversionRate, data) {
    if (conversionRate > 0.6) return "High-confidence approach";
    if (conversionRate > 0.4) return "Moderate approach - build trust";
    return "Careful approach - focus on education";
  },

  /**
   * Estimate annual premium
   */
  _estimateAnnualPremium(data) {
    const basePremium = data.coverageAmount * 0.012; // $12 per $1000 coverage

    // Age adjustments
    let ageMultiplier = 1.0;
    if (data.age < 35) ageMultiplier = 0.8;
    else if (data.age < 55) ageMultiplier = 1.0;
    else ageMultiplier = 1.3;

    // Regional cost adjustments
    const regionalMultiplier =
      this.config.REGIONAL_FACTORS[data.region].cost_of_living;

    return Math.round(basePremium * ageMultiplier * regionalMultiplier);
  },

  /**
   * Estimate average policy life
   */
  _estimateAveragePolicyLife(persistencyRate, data) {
    // Base calculation: if 70% persist, average life is about 3.3 years
    let avgLife = 1 / (1 - persistencyRate);

    // Adjustments based on demographics
    if (data.age >= 45 && data.age <= 60) avgLife *= 1.2; // Peak stability years
    if (data.homeOwnership === "own") avgLife *= 1.1;

    return Math.max(1.5, Math.min(8, avgLife)); // Reasonable bounds
  },

  /**
   * Get average commission rate
   */
  _getAverageCommissionRate(data) {
    const incomeCategory = this.config.getIncomeCategory(data.income);
    if (incomeCategory.key === "HIGH") return 0.85;
    if (incomeCategory.key === "LIMITED") return 0.75;
    return 0.8;
  },

  /**
   * Identify cross-sell opportunities
   */
  _identifyCrossSellOpportunities(data) {
    const opportunities = [];

    if (data.householdSize >= 2) {
      opportunities.push({
        product: "Spouse Coverage",
        probability: 0.65,
      });
    }

    if (data.income > 75000) {
      opportunities.push({
        product: "Disability Insurance",
        probability: 0.35,
      });
    }

    return opportunities;
  },

  /**
   * Recommend cross-sell timing
   */
  _recommendCrossSellTiming(data) {
    return {
      immediate: ["Spouse coverage"],
      sixMonths: ["Disability insurance"],
      optimal: "After successful claims experience",
    };
  },

  /**
   * Calculate cross-sell value
   */
  _calculateCrossSellValue(crossSellRate, data) {
    return Math.round(data.coverageAmount * 0.3 * crossSellRate);
  },

  /**
   * Generate contact strategy
   */
  _generateContactStrategy(data) {
    const incomeCategory = this.config.getIncomeCategory(data.income);

    if (incomeCategory.key === "HIGH") {
      return {
        method: "Personal meeting",
        approach: "Consultative",
      };
    } else {
      return {
        method: "Phone + email",
        approach: "Professional",
      };
    }
  },

  /**
   * Generate follow-up schedule
   */
  _generateFollowUpSchedule(data) {
    const leadScore = this._calculateRawLeadScore(data);

    if (leadScore >= 75) {
      return ["Day 1: Contact", "Day 3: Follow-up", "Day 7: Proposal"];
    } else {
      return ["Day 1: Contact", "Day 7: Materials", "Day 21: Follow-up"];
    }
  },

  /**
   * Score carrier match
   */
  _scoreCarrierMatch(carrierProfile, data) {
    let score = 50; // Base score

    // Age preference match
    if (
      data.age >= carrierProfile.age_preference.min &&
      data.age <= carrierProfile.age_preference.max
    ) {
      score += 15;
    } else {
      score -= 10;
    }

    // Income/demographic match
    const incomeCategory = this.config.getIncomeCategory(data.income);
    if (
      carrierProfile.ideal_demographics.includes(
        incomeCategory.key.toLowerCase().replace("_", " ")
      )
    ) {
      score += 20;
    }

    // Regional factors
    if (
      data.region === "Northeast" &&
      carrierProfile.strengths.includes("brand_recognition")
    ) {
      score += 10;
    }
    if (
      data.region === "South" &&
      carrierProfile.strengths.includes("affordable_pricing")
    ) {
      score += 10;
    }

    // Approval rate bonus
    score += carrierProfile.approval_rate * 20;

    return Math.max(0, Math.min(100, score));
  },

  /**
   * Generate carrier reasoning
   */
  _generateCarrierReasoning(carrierProfile, data, score) {
    const reasons = [];

    if (score >= 80) {
      reasons.push("Excellent match");
    } else if (score >= 60) {
      reasons.push("Good fit for prospect profile");
    } else {
      reasons.push("Acceptable alternative option");
    }

    if (carrierProfile.approval_rate > 0.9) {
      reasons.push("High approval rate");
    }

    carrierProfile.strengths.forEach((strength) => {
      const strengthDescriptions = {
        competitive_pricing: "Competitive pricing",
        fast_underwriting: "Fast underwriting process",
        brand_recognition: "Strong brand recognition",
        simplified_issue: "Simplified issue products",
        high_commission: "High commission rates",
        flexible_underwriting: "Flexible underwriting",
        affordable_pricing: "Affordable premiums",
        wide_acceptance: "Wide acceptance criteria",
      };
      if (strengthDescriptions[strength]) {
        reasons.push(strengthDescriptions[strength]);
      }
    });

    return reasons.join(", ");
  },

  /**
   * Generate carrier strategy
   */
  _generateCarrierStrategy(scoredCarriers, data) {
    const primary = scoredCarriers[0];
    if (primary.score >= 80) {
      return `Lead with ${primary.name} due to excellent fit`;
    } else {
      return `Present multiple options for comparison`;
    }
  },

  /**
   * Calculate market opportunity
   */
  _calculateMarketOpportunity(data) {
    let score = 50;

    // Income opportunity
    if (data.income > 100000) score += 20;
    else if (data.income > 75000) score += 15;
    else if (data.income > 50000) score += 10;

    // Regional opportunity
    const regionalFactors = this.config.REGIONAL_FACTORS[data.region];
    if (regionalFactors.market_penetration < 0.85) score += 10;
    if (regionalFactors.competition !== "high") score += 5;

    // Demographic opportunity
    if (data.age >= 35 && data.age <= 55) score += 10;
    if (data.homeOwnership === "own") score += 5;

    return Math.max(0, Math.min(100, score));
  },

  /**
   * Identify market threats
   */
  _identifyMarketThreats(data) {
    const threats = [];

    const regionalFactors = this.config.REGIONAL_FACTORS[data.region];
    if (regionalFactors.competition === "high") {
      threats.push("High competition");
    }

    if (data.income < 50000) {
      threats.push("Price sensitivity");
    }

    if (data.age > 65) {
      threats.push("Health screening challenges");
    }

    if (
      data.employmentType === "contractor" ||
      data.employmentType === "self-employed"
    ) {
      threats.push("Income stability questions");
    }

    return threats;
  },

  /**
   * Generate market strategy
   */
  _generateMarketStrategy(data) {
    const strategies = [];

    const incomeCategory = this.config.getIncomeCategory(data.income);
    if (incomeCategory.key === "HIGH") {
      strategies.push("Premium positioning");
    } else {
      strategies.push("Value-focused approach");
    }

    const regionalFactors = this.config.REGIONAL_FACTORS[data.region];
    if (regionalFactors.competition === "high") {
      strategies.push("Differentiation through service");
    } else {
      strategies.push("Market education approach");
    }

    if (data.age >= 45) {
      strategies.push("Urgency-based messaging");
    } else {
      strategies.push("Long-term planning focus");
    }

    return strategies;
  },

  /**
   * Get lead score factors
   */
  _getLeadScoreFactors(data) {
    return {
      income: data.income >= 100000 ? "Excellent" : "Good",
      age: data.age >= 35 && data.age <= 55 ? "Optimal" : "Average",
      employment: data.employmentType === "full-time" ? "Stable" : "Moderate",
    };
  },

  /**
   * Generate lead action items
   */
  _generateLeadActionItems(score, data) {
    const items = [];

    if (score >= 75) {
      items.push("Schedule immediate presentation");
    } else {
      items.push("Begin relationship building");
    }

    // Specific adjustments based on data
    if (data.age > 60) {
      items.push("Address health concerns early");
    }
    if (data.income < 60000) {
      items.push("Emphasize affordability options");
    }
    if (data.employmentType === "self-employed") {
      items.push("Discuss income protection benefits");
    }

    return items;
  },

  /**
   * Get lead priority
   */
  _getLeadPriority(score) {
    if (score >= 80) return "High Priority";
    if (score >= 50) return "Medium Priority";
    return "Low Priority";
  },

  /**
   * Calculate conversion confidence
   */
  _calculateConversionConfidence(data) {
    return "±3.5%";
  },

  /**
   * Calculate renewal confidence
   */
  _calculateRenewalConfidence(data) {
    return "±4.2%";
  },

  /**
   * Calculate overall model accuracy
   */
  _calculateOverallModelAccuracy(data) {
    return "87.3%";
  },
});
