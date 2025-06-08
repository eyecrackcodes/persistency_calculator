/**
 * Advanced Predictive Analytics Engine
 * Core machine learning-style calculations and predictions
 */

window.AnalyticsPlatform = window.AnalyticsPlatform || {};

window.AnalyticsPlatform.PredictiveEngine = class {
  constructor() {
    this.config = window.AnalyticsPlatform.Config;
    this.cache = new Map();
    this.modelVersion = "2.0.1";
    this.lastCalculation = null;
    this.confidenceThreshold = this.config.ML_MODEL.CONFIDENCE_THRESHOLD;

    // Initialize model coefficients (would normally be trained from data)
    this.modelCoefficients = this._initializeModel();
  }

  /**
   * Main prediction method - calculates all analytics for a prospect
   * @param {Object} prospectData - Complete prospect information
   * @returns {Object} Comprehensive analytics results
   */
  async predict(prospectData) {
    try {
      const startTime = performance.now();

      // Validate input data
      if (!this._validateInput(prospectData)) {
        throw new Error("Invalid prospect data provided");
      }

      // Create cache key
      const cacheKey = this._generateCacheKey(prospectData);

      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (
          Date.now() - cached.timestamp <
          this.config.PERFORMANCE.CACHE_DURATION
        ) {
          return cached.result;
        }
      }

      // Normalize and enrich data
      const enrichedData = await this._enrichProspectData(prospectData);

      // Run all prediction models
      const predictions = {
        riskScoring: this._calculateRiskScore(enrichedData),
        persistency: this._predictPersistency(enrichedData),
        conversion: this._predictConversion(enrichedData),
        lifetimeValue: this._calculateLifetimeValue(enrichedData),
        crossSell: this._predictCrossSell(enrichedData),
        optimalTiming: this._predictOptimalTiming(enrichedData),
        carrierMatch: this._recommendCarriers(enrichedData),
        marketAnalysis: this._analyzeMarket(enrichedData),
        leadScore: this._calculateLeadScore(enrichedData),
        confidenceIntervals: this._calculateConfidenceIntervals(enrichedData),
      };

      // Calculate model confidence
      const modelConfidence = this._calculateModelConfidence(
        predictions,
        enrichedData
      );

      // Compile comprehensive results
      const result = {
        prospectData: enrichedData,
        predictions,
        modelConfidence,
        calculationTime: performance.now() - startTime,
        timestamp: Date.now(),
        modelVersion: this.modelVersion,
      };

      // Cache result
      this._cacheResult(cacheKey, result);

      // Store for trend analysis
      this.lastCalculation = result;

      return result;
    } catch (error) {
      console.error("Predictive Engine Error:", error);
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }

  /**
   * Calculate comprehensive risk score using multiple factors
   */
  _calculateRiskScore(data) {
    const weights = this.config.ML_MODEL.SCORING_WEIGHTS;
    let score = 0;
    const factors = {};

    // Income stability factor (0-100)
    const incomeStability = this._calculateIncomeStability(data);
    factors.incomeStability = incomeStability;
    score += incomeStability * weights.income;

    // Age factor (optimal age ranges get higher scores)
    const ageFactor = this._calculateAgeFactor(data.age);
    factors.ageFactor = ageFactor;
    score += ageFactor * weights.age;

    // Education factor
    const educationFactor = this._calculateEducationFactor(data.education);
    factors.educationFactor = educationFactor;
    score += educationFactor * weights.education;

    // Employment stability
    const employmentFactor = this._calculateEmploymentFactor(
      data.employmentType
    );
    factors.employmentFactor = employmentFactor;
    score += employmentFactor * weights.employment;

    // Regional factor
    const regionalFactor = this._calculateRegionalFactor(data.region);
    factors.regionalFactor = regionalFactor;
    score += regionalFactor * weights.region;

    // Household factor
    const householdFactor = this._calculateHouseholdFactor(data.householdSize);
    factors.householdFactor = householdFactor;
    score += householdFactor * weights.household;

    // Housing stability
    const housingFactor = this._calculateHousingFactor(data.homeOwnership);
    factors.housingFactor = housingFactor;
    score += housingFactor * weights.housing;

    // Normalize to 0-100 scale
    const normalizedScore = Math.max(0, Math.min(100, score));
    const riskGrade = this.config.getRiskGrade(normalizedScore);

    return {
      score: normalizedScore,
      grade: riskGrade.grade,
      gradeColor: riskGrade.color,
      factors,
      recommendation: this._generateRiskRecommendation(
        normalizedScore,
        factors
      ),
    };
  }

  /**
   * Predict policy persistency rate
   */
  _predictPersistency(data) {
    const baseRate = this.config.PREDICTION_MODELS.PERSISTENCY.base_rate;
    const factors = this.config.PREDICTION_MODELS.PERSISTENCY.factors;

    let adjustment = 0;

    // Income stability adjustment
    const incomeStability = this._getIncomeStabilityMultiplier(data);
    adjustment += incomeStability * factors.income_stability;

    // Age adjustment
    const ageMultiplier = this._getAgeMultiplier(data.age);
    adjustment += ageMultiplier * factors.age_factor;

    // Education adjustment
    const educationMultiplier = this._getEducationMultiplier(data.education);
    adjustment += educationMultiplier * factors.education_level;

    // Employment adjustment
    const employmentMultiplier = this._getEmploymentMultiplier(
      data.employmentType
    );
    adjustment += employmentMultiplier * factors.employment_type;

    // Household size adjustment
    const householdMultiplier = this._getHouseholdMultiplier(
      data.householdSize
    );
    adjustment += householdMultiplier * factors.household_size;

    const predictedRate = Math.max(0.2, Math.min(0.95, baseRate + adjustment));
    const confidenceInterval = this._calculatePersistencyConfidence(data);

    return {
      rate: predictedRate,
      percentage: (predictedRate * 100).toFixed(1),
      confidenceInterval,
      factors: {
        incomeStability,
        ageMultiplier,
        educationMultiplier,
        employmentMultiplier,
        householdMultiplier,
      },
      yearlyPredictions: this._predictYearlyPersistency(predictedRate, data),
    };
  }

  /**
   * Predict conversion probability
   */
  _predictConversion(data) {
    const baseRate = this.config.PREDICTION_MODELS.CONVERSION.base_rate;
    const factors = this.config.PREDICTION_MODELS.CONVERSION.factors;

    let adjustment = 0;

    // Lead score influence
    const leadScore = this._calculateRawLeadScore(data);
    const leadScoreMultiplier = (leadScore - 50) / 100; // Normalize around 50
    adjustment += leadScoreMultiplier * factors.lead_score;

    // Seasonal timing
    const currentQuarter = this.config.getCurrentQuarter();
    const seasonalMultiplier =
      this.config.SEASONAL_FACTORS[currentQuarter].success_rate - 1;
    adjustment += seasonalMultiplier * factors.seasonal_timing;

    // Market conditions
    const marketMultiplier = this._getMarketConditionsMultiplier(data);
    adjustment += marketMultiplier * factors.market_conditions;

    // Competitor activity
    const competitorMultiplier = this._getCompetitorActivityMultiplier(data);
    adjustment += competitorMultiplier * factors.competitor_activity;

    const conversionRate = Math.max(
      0.05,
      Math.min(0.85, baseRate + adjustment)
    );

    return {
      rate: conversionRate,
      percentage: (conversionRate * 100).toFixed(1),
      factors: {
        leadScore: leadScoreMultiplier,
        seasonal: seasonalMultiplier,
        market: marketMultiplier,
        competitor: competitorMultiplier,
      },
      recommendation: this._generateConversionStrategy(conversionRate, data),
    };
  }

  /**
   * Calculate predicted lifetime value
   */
  _calculateLifetimeValue(data) {
    const annualPremium = this._estimateAnnualPremium(data);
    const persistency = this._predictPersistency(data);
    const avgPolicyLife = this._estimateAveragePolicyLife(
      persistency.rate,
      data
    );
    const commissionRate = this._getAverageCommissionRate(data);

    const lifetimeValue = annualPremium * avgPolicyLife * commissionRate;

    return {
      value: Math.round(lifetimeValue),
      annualPremium,
      avgPolicyLife: avgPolicyLife.toFixed(1),
      commissionRate: (commissionRate * 100).toFixed(1),
      components: {
        yearOne: Math.round(annualPremium * commissionRate),
        yearTwo: Math.round(annualPremium * commissionRate * 0.5),
        yearThree: Math.round(annualPremium * commissionRate * 0.3),
        renewal: Math.round(annualPremium * commissionRate * 0.1),
      },
    };
  }

  /**
   * Predict cross-sell opportunities
   */
  _predictCrossSell(data) {
    const baseRate = this.config.PREDICTION_MODELS.CROSS_SELL.base_rate;

    let adjustment = 0;

    // Income level adjustment
    const incomeCategory = this.config.getIncomeCategory(data.income);
    if (incomeCategory.key === "HIGH" || incomeCategory.key === "ULTRA_HIGH") {
      adjustment += 0.15;
    } else if (incomeCategory.key === "UPPER_MIDDLE") {
      adjustment += 0.08;
    }

    // Age adjustment (peak earning years)
    if (data.age >= 35 && data.age <= 55) {
      adjustment += 0.1;
    }

    // Household size adjustment
    if (data.householdSize >= 3) {
      adjustment += 0.05;
    }

    const crossSellRate = Math.max(0.1, Math.min(0.8, baseRate + adjustment));

    return {
      rate: crossSellRate,
      percentage: (crossSellRate * 100).toFixed(1),
      opportunities: this._identifyCrossSellOpportunities(data),
      timing: this._recommendCrossSellTiming(data),
      expectedValue: this._calculateCrossSellValue(crossSellRate, data),
    };
  }

  /**
   * Predict optimal timing for contact
   */
  _predictOptimalTiming(data) {
    const currentQuarter = this.config.getCurrentQuarter();
    const seasonalFactors = this.config.SEASONAL_FACTORS;

    // Find best quarter for this demographic
    let bestQuarter = currentQuarter;
    let bestScore = seasonalFactors[currentQuarter].success_rate;

    for (const [quarter, factors] of Object.entries(seasonalFactors)) {
      const score = factors.success_rate * factors.demand;
      if (score > bestScore) {
        bestScore = score;
        bestQuarter = quarter;
      }
    }

    return {
      bestQuarter,
      currentQuarter,
      urgency: seasonalFactors[bestQuarter].urgency,
      expectedLift: ((bestScore - 1) * 100).toFixed(1),
      contactRecommendations: this._generateContactStrategy(data),
      followUpSchedule: this._generateFollowUpSchedule(data),
    };
  }

  /**
   * Recommend optimal carriers
   */
  _recommendCarriers(data) {
    const carriers = this.config.CARRIER_PROFILES;
    const scored = [];

    for (const [name, profile] of Object.entries(carriers)) {
      const score = this._scoreCarrierMatch(profile, data);
      scored.push({
        name,
        score,
        approvalRate: (profile.approval_rate * 100).toFixed(1),
        commission: (profile.commission * 100).toFixed(0),
        strengths: profile.strengths,
        reasoning: this._generateCarrierReasoning(profile, data, score),
      });
    }

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return {
      primary: scored[0],
      secondary: scored[1],
      all: scored,
      strategy: this._generateCarrierStrategy(scored, data),
    };
  }

  /**
   * Analyze market conditions
   */
  _analyzeMarket(data) {
    const region = data.region;
    const regionalFactors = this.config.REGIONAL_FACTORS[region];

    return {
      penetration: (regionalFactors.market_penetration * 100).toFixed(1),
      competition: regionalFactors.competition,
      costOfLiving: regionalFactors.cost_of_living,
      opportunity: this._calculateMarketOpportunity(data),
      threats: this._identifyMarketThreats(data),
      recommendations: this._generateMarketStrategy(data),
    };
  }

  /**
   * Calculate comprehensive lead score
   */
  _calculateLeadScore(data) {
    const rawScore = this._calculateRawLeadScore(data);
    const grade = this._getLeadGrade(rawScore);

    return {
      score: rawScore,
      grade,
      factors: this._getLeadScoreFactors(data),
      actionItems: this._generateLeadActionItems(rawScore, data),
      priority: this._getLeadPriority(rawScore),
    };
  }

  /**
   * Calculate confidence intervals for all predictions
   */
  _calculateConfidenceIntervals(data) {
    return {
      persistency: this._calculatePersistencyConfidence(data),
      conversion: this._calculateConversionConfidence(data),
      renewal: this._calculateRenewalConfidence(data),
      modelAccuracy: this._calculateOverallModelAccuracy(data),
    };
  }

  // Helper methods for calculations...
  _initializeModel() {
    // In a real implementation, these would be learned from training data
    return {
      persistency: {
        intercept: 0.491,
        coefficients: {
          income: 0.000015,
          age: -0.002,
          education_college: 0.05,
          employment_stable: 0.03,
          region_northeast: 0.02,
        },
      },
      conversion: {
        intercept: 0.287,
        coefficients: {
          lead_score: 0.008,
          seasonal: 0.15,
          market_conditions: 0.12,
        },
      },
    };
  }

  _validateInput(data) {
    const required = ["zipCode", "age", "income", "coverageAmount"];
    return required.every(
      (field) => data[field] !== undefined && data[field] !== null
    );
  }

  _generateCacheKey(data) {
    return `${data.zipCode}_${data.age}_${data.income}_${data.coverageAmount}_${data.employmentType}_${data.householdSize}`;
  }

  async _enrichProspectData(data) {
    // Add demographic enrichment, regional data, etc.
    const enriched = { ...data };

    // Add regional classification
    enriched.region = this._getRegionFromZip(data.zipCode);

    // Add income category
    enriched.incomeCategory = this.config.getIncomeCategory(data.income);

    // Add market segment
    enriched.marketSegment = this._determineMarketSegment(enriched);

    return enriched;
  }

  _cacheResult(key, result) {
    if (this.cache.size >= this.config.PERFORMANCE.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      result,
      timestamp: Date.now(),
    });
  }

  // Additional helper methods would continue here...
  // (Implementation of all the specific calculation methods)

  _calculateIncomeStability(data) {
    const base = 50;
    const incomeCategory = this.config.getIncomeCategory(data.income);

    // Higher income generally means more stability
    let stability = base + (incomeCategory.multiplier - 1) * 20;

    // Employment type adjustment
    const employmentAdjustments = {
      "full-time": 15,
      "self-employed": -5,
      contractor: -10,
      "part-time": -20,
      retired: 10,
    };

    stability += employmentAdjustments[data.employmentType] || 0;

    return Math.max(0, Math.min(100, stability));
  }

  _calculateAgeFactor(age) {
    // Peak scores for ages 35-55 (prime earning years)
    if (age >= 35 && age <= 55) return 85;
    if (age >= 25 && age < 35) return 70;
    if (age >= 56 && age <= 65) return 75;
    if (age >= 66 && age <= 75) return 60;
    return 45; // Very young or very old
  }

  _calculateEducationFactor(education) {
    const factors = {
      Graduate: 90,
      College: 75,
      "Some College": 60,
      "High School": 45,
      "Less than High School": 30,
    };
    return factors[education] || 60;
  }

  _calculateEmploymentFactor(employmentType) {
    const factors = {
      "full-time": 85,
      "self-employed": 70,
      contractor: 60,
      "part-time": 40,
      retired: 65,
      unemployed: 20,
    };
    return factors[employmentType] || 50;
  }

  _calculateRegionalFactor(region) {
    const factors = {
      Northeast: 75,
      West: 70,
      South: 80,
      Midwest: 85,
    };
    return factors[region] || 70;
  }

  _calculateHouseholdFactor(size) {
    // Optimal household sizes for insurance (2-4 people)
    if (size >= 2 && size <= 4) return 80;
    if (size === 1) return 60;
    return 70; // Large households
  }

  _calculateHousingFactor(ownership) {
    const factors = {
      own: 85,
      rent: 60,
      other: 45,
    };
    return factors[ownership] || 60;
  }

  _generateRiskRecommendation(score, factors) {
    if (score >= 85) return "Excellent prospect - proceed with confidence";
    if (score >= 70) return "Good prospect - standard approach recommended";
    if (score >= 55) return "Moderate risk - enhanced qualification suggested";
    if (score >= 40) return "Higher risk - careful evaluation required";
    return "High risk - consider alternative products";
  }

  _getRegionFromZip(zipCode) {
    const firstDigit = zipCode.charAt(0);
    if (["0", "1"].includes(firstDigit)) return "Northeast";
    if (["2", "3"].includes(firstDigit)) return "South";
    if (["4", "5", "6"].includes(firstDigit)) return "Midwest";
    return "West";
  }

  _determineMarketSegment(data) {
    const income = data.income;
    const age = data.age;

    if (income >= 150000) return "affluent";
    if (income >= 100000 && age >= 35) return "established";
    if (income >= 75000 && age <= 40) return "emerging";
    if (income >= 50000) return "mainstream";
    return "value";
  }

  _calculateRawLeadScore(data) {
    const scoring = this.config.LEAD_SCORING;
    let score = 0;

    // Income points
    if (data.income >= 150000) score += scoring.INCOME_POINTS.above_150k;
    else if (data.income >= 100000) score += scoring.INCOME_POINTS["100k_150k"];
    else if (data.income >= 75000) score += scoring.INCOME_POINTS["75k_100k"];
    else if (data.income >= 50000) score += scoring.INCOME_POINTS["50k_75k"];
    else if (data.income >= 35000) score += scoring.INCOME_POINTS["35k_50k"];
    else score += scoring.INCOME_POINTS.below_35k;

    // Age points
    if (data.age >= 25 && data.age <= 35) score += scoring.AGE_POINTS["25_35"];
    else if (data.age >= 36 && data.age <= 45)
      score += scoring.AGE_POINTS["36_45"];
    else if (data.age >= 46 && data.age <= 55)
      score += scoring.AGE_POINTS["46_55"];
    else if (data.age >= 56 && data.age <= 65)
      score += scoring.AGE_POINTS["56_65"];
    else if (data.age >= 66 && data.age <= 75)
      score += scoring.AGE_POINTS["66_75"];
    else score += scoring.AGE_POINTS["76_plus"];

    // Employment points
    score += scoring.EMPLOYMENT_POINTS[data.employmentType] || 0;

    // Housing points
    score += scoring.HOUSING_POINTS[data.homeOwnership] || 0;

    return Math.max(0, Math.min(100, score));
  }

  _getLeadGrade(score) {
    if (score >= 85) return "A+";
    if (score >= 75) return "A";
    if (score >= 65) return "B+";
    if (score >= 55) return "B";
    if (score >= 45) return "C";
    return "D";
  }

  _calculateModelConfidence(predictions, data) {
    // Calculate overall confidence based on data completeness and model certainty
    let confidence = 0.9; // Base confidence

    // Reduce confidence for edge cases
    if (data.age < 25 || data.age > 75) confidence -= 0.1;
    if (data.income < 25000 || data.income > 500000) confidence -= 0.1;

    // Increase confidence for complete data
    if (data.employmentType && data.homeOwnership && data.householdSize) {
      confidence += 0.05;
    }

    return Math.max(0.6, Math.min(0.99, confidence));
  }

  // Additional methods for various calculations...
  // (Many more helper methods would be implemented here)
};

// Export for use in other modules
window.AnalyticsPlatform.predictiveEngine =
  new window.AnalyticsPlatform.PredictiveEngine();
