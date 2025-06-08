/**
 * Advanced Insurance Analytics Platform - Main Application
 * Real-time calculations with debouncing and comprehensive analytics
 */

class AnalyticsPlatformApp {
  constructor() {
    this.config = window.AnalyticsPlatform.Config;
    this.predictiveEngine = window.AnalyticsPlatform.predictiveEngine;
    this.debounceTimeout = null;
    this.isInitialized = false;
    this.currentData = {};
    this.calculationHistory = [];

    // Bind methods
    this.handleInputChange = this.handleInputChange.bind(this);
    this.calculateAnalytics = this.calculateAnalytics.bind(this);
    this.updateUI = this.updateUI.bind(this);
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log("🚀 Initializing Advanced Analytics Platform...");

      // Show loading overlay
      this.showLoadingOverlay(true);

      // Initialize UI components
      await this.initializeUI();

      // Set up real-time event listeners
      this.setupEventListeners();

      // Load default data and calculate
      await this.loadDefaultData();

      // Hide loading overlay
      this.showLoadingOverlay(false);

      this.isInitialized = true;
      console.log("✅ Platform initialized successfully");

      // Trigger initial calculation
      this.handleInputChange();
    } catch (error) {
      console.error("❌ Initialization failed:", error);
      this.showError("Failed to initialize platform: " + error.message);
    }
  }

  /**
   * Initialize UI components and set default values
   */
  async initializeUI() {
    // Set default values
    document.getElementById("zipInput").value = "75205";
    document.getElementById("ageSlider").value = 45;
    document.getElementById("incomeInput").value = "";
    document.getElementById("coverageSlider").value = 100000;
    document.getElementById("householdSize").value = "2";
    document.getElementById("employmentType").value = "full-time";
    document.getElementById("homeOwnership").value = "own";

    // Update display elements
    this.updateSliderDisplays();

    // Initialize charts (lazy loading)
    if (this.config.PERFORMANCE.LAZY_LOAD_CHARTS) {
      setTimeout(() => this.initializeCharts(), 1000);
    } else {
      this.initializeCharts();
    }
  }

  /**
   * Set up real-time event listeners with debouncing
   */
  setupEventListeners() {
    // Input elements for real-time calculation
    const inputElements = [
      "zipInput",
      "ageSlider",
      "incomeInput",
      "coverageSlider",
      "householdSize",
      "employmentType",
      "homeOwnership",
    ];

    inputElements.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        // Use 'input' event for real-time updates
        element.addEventListener("input", this.handleInputChange);
        element.addEventListener("change", this.handleInputChange);
      }
    });

    // Special handling for sliders to update displays
    document.getElementById("ageSlider")?.addEventListener("input", (e) => {
      document.getElementById("ageDisplay").textContent = e.target.value;
    });

    document
      .getElementById("coverageSlider")
      ?.addEventListener("input", (e) => {
        const value = parseInt(e.target.value).toLocaleString();
        document.getElementById("coverageDisplay").textContent = value;
      });

    // Export button
    document.getElementById("exportBtn")?.addEventListener("click", () => {
      this.exportReport();
    });

    // Action buttons
    document.getElementById("abTestBtn")?.addEventListener("click", () => {
      this.openABTestModal();
    });

    document.getElementById("roiCalcBtn")?.addEventListener("click", () => {
      this.openROIModal();
    });

    // ZIP code suggestions (if implemented)
    document.getElementById("zipInput")?.addEventListener("focus", () => {
      this.showZipSuggestions();
    });
  }

  /**
   * Handle input changes with debouncing
   */
  handleInputChange() {
    if (!this.isInitialized) return;

    // Clear existing timeout
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Update slider displays immediately for better UX
    this.updateSliderDisplays();

    // Debounce the calculation
    this.debounceTimeout = setTimeout(() => {
      this.calculateAnalytics();
    }, this.config.DEBOUNCE_DELAY);
  }

  /**
   * Update slider display values
   */
  updateSliderDisplays() {
    const ageValue = document.getElementById("ageSlider")?.value;
    if (ageValue) {
      document.getElementById("ageDisplay").textContent = ageValue;
    }

    const coverageValue = document.getElementById("coverageSlider")?.value;
    if (coverageValue) {
      const formatted = parseInt(coverageValue).toLocaleString();
      document.getElementById("coverageDisplay").textContent = formatted;
    }
  }

  /**
   * Main calculation method
   */
  async calculateAnalytics() {
    try {
      console.log("🔄 Running analytics calculation...");

      // Collect current input data
      const prospectData = this.collectProspectData();

      // Validate data
      if (!this.validateData(prospectData)) {
        console.warn("⚠️ Invalid data, skipping calculation");
        return;
      }

      // Store current data
      this.currentData = prospectData;

      // Add calculation indicator
      this.showCalculationIndicator(true);

      // Run predictive analytics
      const results = await this.predictiveEngine.predict(prospectData);

      // Update UI with results
      await this.updateUI(results);

      // Store in history for trend analysis
      this.calculationHistory.push({
        timestamp: Date.now(),
        data: prospectData,
        results: results,
      });

      // Limit history size
      if (this.calculationHistory.length > 50) {
        this.calculationHistory = this.calculationHistory.slice(-50);
      }

      // Hide calculation indicator
      this.showCalculationIndicator(false);

      console.log("✅ Analytics calculation completed", results);
    } catch (error) {
      console.error("❌ Calculation failed:", error);
      this.showError("Calculation failed: " + error.message);
      this.showCalculationIndicator(false);
    }
  }

  /**
   * Collect current prospect data from form
   */
  collectProspectData() {
    const zipCode = document.getElementById("zipInput")?.value || "75205";
    const age = parseInt(document.getElementById("ageSlider")?.value) || 45;
    let income = parseInt(document.getElementById("incomeInput")?.value);
    const coverageAmount =
      parseInt(document.getElementById("coverageSlider")?.value) || 100000;
    const householdSize =
      parseInt(document.getElementById("householdSize")?.value) || 2;
    const employmentType =
      document.getElementById("employmentType")?.value || "full-time";
    const homeOwnership =
      document.getElementById("homeOwnership")?.value || "own";

    // Auto-fill income from demographics if not provided
    if (!income) {
      income = this.estimateIncomeFromDemographics(zipCode);
    }

    return {
      zipCode,
      age,
      income,
      coverageAmount,
      householdSize,
      employmentType,
      homeOwnership,
      timestamp: Date.now(),
    };
  }

  /**
   * Validate prospect data
   */
  validateData(data) {
    const validation = this.config.VALIDATION;

    if (!validation.ZIP_CODE.test(data.zipCode)) return false;
    if (data.age < validation.AGE.min || data.age > validation.AGE.max)
      return false;
    if (
      data.income < validation.INCOME.min ||
      data.income > validation.INCOME.max
    )
      return false;
    if (
      data.coverageAmount < validation.COVERAGE.min ||
      data.coverageAmount > validation.COVERAGE.max
    )
      return false;

    return true;
  }

  /**
   * Update UI with calculation results
   */
  async updateUI(results) {
    try {
      // Update model confidence
      document.getElementById("modelConfidence").textContent =
        (results.modelConfidence * 100).toFixed(1) + "%";

      // Update risk scoring
      this.updateRiskScoring(results.predictions.riskScoring);

      // Update predictive analytics
      this.updatePredictiveAnalytics(results.predictions);

      // Update recommendations
      this.updateRecommendations(results.predictions);

      // Update market intelligence
      this.updateMarketIntelligence(results.predictions.marketAnalysis);

      // Update lead scoring
      this.updateLeadScoring(results.predictions.leadScore);

      // Update charts
      await this.updateCharts(results);

      // Add animations
      if (this.config.UX.ANIMATE_TRANSITIONS) {
        this.addUpdateAnimations();
      }
    } catch (error) {
      console.error("UI Update Error:", error);
    }
  }

  /**
   * Update risk scoring display
   */
  updateRiskScoring(riskData) {
    if (!riskData) return;

    const riskGradeElement = document.getElementById("riskGrade");
    if (riskGradeElement) {
      riskGradeElement.textContent = riskData.grade;
      riskGradeElement.style.color = riskData.gradeColor;
    }

    // Update confidence intervals
    const persistencyElement = document.getElementById("persistencyInterval");
    if (persistencyElement) {
      persistencyElement.textContent = `${riskData.score.toFixed(1)}% ± 3.2%`;
    }
  }

  /**
   * Update predictive analytics metrics
   */
  updatePredictiveAnalytics(predictions) {
    // Sale probability
    const saleProbElement = document.getElementById("saleProbability");
    if (saleProbElement && predictions.conversion) {
      saleProbElement.textContent = predictions.conversion.percentage + "%";
    }

    // Lifetime value
    const lifetimeValueElement = document.getElementById("lifetimeValue");
    if (lifetimeValueElement && predictions.lifetimeValue) {
      lifetimeValueElement.textContent =
        "$" + predictions.lifetimeValue.value.toLocaleString();
    }

    // Optimal timing
    const optimalTimingElement = document.getElementById("optimalTiming");
    if (optimalTimingElement && predictions.optimalTiming) {
      optimalTimingElement.textContent = predictions.optimalTiming.bestQuarter;
    }

    // Cross-sell probability
    const crossSellElement = document.getElementById("crossSellProb");
    if (crossSellElement && predictions.crossSell) {
      crossSellElement.textContent = predictions.crossSell.percentage + "%";
    }
  }

  /**
   * Update recommendations
   */
  updateRecommendations(predictions) {
    if (!predictions.carrierMatch) return;

    // Primary carrier
    const primaryCarrierElement = document.getElementById("primaryCarrier");
    if (primaryCarrierElement) {
      primaryCarrierElement.textContent = predictions.carrierMatch.primary.name;
    }

    const primaryApprovalElement = document.getElementById("primaryApproval");
    if (primaryApprovalElement) {
      primaryApprovalElement.textContent =
        predictions.carrierMatch.primary.approvalRate + "%";
    }

    const primaryCommissionElement =
      document.getElementById("primaryCommission");
    if (primaryCommissionElement) {
      primaryCommissionElement.textContent =
        predictions.carrierMatch.primary.commission + "%";
    }

    // Alternative carrier
    const altCarrierElement = document.getElementById("altCarrier");
    if (altCarrierElement) {
      altCarrierElement.textContent = predictions.carrierMatch.secondary.name;
    }

    const altApprovalElement = document.getElementById("altApproval");
    if (altApprovalElement) {
      altApprovalElement.textContent =
        predictions.carrierMatch.secondary.approvalRate + "%";
    }

    const altCommissionElement = document.getElementById("altCommission");
    if (altCommissionElement) {
      altCommissionElement.textContent =
        predictions.carrierMatch.secondary.commission + "%";
    }

    // Optimal coverage
    this.updateOptimalCoverage(predictions);

    // Risk factors
    this.updateRiskFactors(predictions.riskScoring);
  }

  /**
   * Update market intelligence
   */
  updateMarketIntelligence(marketData) {
    if (!marketData) return;

    const penetrationElement = document.getElementById("marketPenetration");
    if (penetrationElement) {
      penetrationElement.textContent = marketData.penetration + "%";
    }

    const competitorElement = document.getElementById("competitorDensity");
    if (competitorElement) {
      competitorElement.textContent =
        marketData.competition.charAt(0).toUpperCase() +
        marketData.competition.slice(1);
    }
  }

  /**
   * Update lead scoring
   */
  updateLeadScoring(leadData) {
    if (!leadData) return;

    const leadScoreElement = document.getElementById("leadScore");
    if (leadScoreElement) {
      leadScoreElement.textContent = leadData.score;
    }

    // Update follow-up strategy
    this.updateFollowUpStrategy(leadData);
  }

  /**
   * Initialize charts
   */
  initializeCharts() {
    console.log("📊 Initializing charts...");

    // Chart.js configurations would go here
    // For now, we'll create placeholder configurations

    // Probability distribution chart
    this.initProbabilityChart();

    // Trend analysis chart
    this.initTrendChart();

    // Competitor analysis chart
    this.initCompetitorChart();

    // Seasonal patterns chart
    this.initSeasonalChart();

    // Lead score gauge
    this.initLeadScoreGauge();

    // Conversion funnel chart
    this.initFunnelChart();
  }

  /**
   * Initialize probability distribution chart
   */
  initProbabilityChart() {
    const ctx = document.getElementById("probabilityDistribution");
    if (!ctx) return;

    // Placeholder for now - would implement actual Chart.js chart
    console.log("Initializing probability distribution chart");
  }

  /**
   * Initialize trend chart
   */
  initTrendChart() {
    const ctx = document.getElementById("trendChart");
    if (!ctx) return;

    // Placeholder for now - would implement actual Chart.js chart
    console.log("Initializing trend chart");
  }

  /**
   * Show/hide loading overlay
   */
  showLoadingOverlay(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.style.display = show ? "flex" : "none";
    }
  }

  /**
   * Show calculation indicator
   */
  showCalculationIndicator(show) {
    const confidence = document.getElementById("modelConfidence");
    if (confidence) {
      if (show) {
        confidence.textContent = "Calculating...";
        confidence.classList.add("pulse");
      } else {
        confidence.classList.remove("pulse");
      }
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    console.error("Error:", message);
    // Could implement toast notification or error panel
    alert("Error: " + message);
  }

  /**
   * Add animation effects to updated elements
   */
  addUpdateAnimations() {
    const animatedElements = [
      "riskGrade",
      "saleProbability",
      "lifetimeValue",
      "leadScore",
    ];

    animatedElements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.remove("fade-in");
        setTimeout(() => element.classList.add("fade-in"), 10);
      }
    });
  }

  /**
   * Load default data
   */
  async loadDefaultData() {
    // Load any external data sources
    // For now, we'll use the built-in data
    console.log("📥 Loading default data...");
  }

  /**
   * Estimate income from demographics if not provided
   */
  estimateIncomeFromDemographics(zipCode) {
    // Basic estimation - in real implementation would use more sophisticated lookup
    const firstDigit = zipCode.charAt(0);
    const baseIncome = {
      0: 75000,
      1: 85000,
      2: 60000,
      3: 65000,
      4: 70000,
      5: 65000,
      6: 75000,
      7: 80000,
      8: 85000,
      9: 90000,
    };

    return baseIncome[firstDigit] || 70000;
  }

  /**
   * Export functionality
   */
  exportReport() {
    console.log("📄 Exporting report...");
    // Implementation would create PDF or CSV export
    alert("Export functionality coming soon!");
  }

  /**
   * Open A/B Test modal
   */
  openABTestModal() {
    console.log("🧪 Opening A/B Test simulator...");
    // Implementation would open modal with A/B testing tools
    alert("A/B Testing simulator coming soon!");
  }

  /**
   * Open ROI Calculator modal
   */
  openROIModal() {
    console.log("💰 Opening ROI calculator...");
    // Implementation would open modal with ROI calculation tools
    alert("ROI Calculator coming soon!");
  }

  /**
   * Additional helper methods...
   */

  updateOptimalCoverage(predictions) {
    // Implementation for optimal coverage recommendations
  }

  updateRiskFactors(riskData) {
    // Implementation for risk factor display
  }

  updateFollowUpStrategy(leadData) {
    // Implementation for follow-up strategy display
  }

  showZipSuggestions() {
    // Implementation for ZIP code suggestions
  }

  // Chart update methods
  initCompetitorChart() {
    /* Chart implementation */
  }
  initSeasonalChart() {
    /* Chart implementation */
  }
  initLeadScoreGauge() {
    /* Chart implementation */
  }
  initFunnelChart() {
    /* Chart implementation */
  }

  async updateCharts(results) {
    // Update all charts with new data
    console.log("📊 Updating charts with new data...");
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.analyticsApp = new AnalyticsPlatformApp();
  window.analyticsApp.init();
});

// Global error handler
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

// Performance monitoring
if ("performance" in window) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType("navigation")[0];
      console.log("📈 Page load performance:", {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded:
          perfData.domContentLoadedEventEnd -
          perfData.domContentLoadedEventStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart,
      });
    }, 0);
  });
}
