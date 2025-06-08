/**
 * Advanced Insurance Analytics Platform - Configuration
 * Core configuration and constants
 */

window.AnalyticsPlatform = window.AnalyticsPlatform || {};

window.AnalyticsPlatform.Config = {
  // Application Settings
  VERSION: "2.0.0",
  DEBUG: true,

  // Real-time Calculation Settings
  DEBOUNCE_DELAY: 300, // milliseconds
  AUTO_CALCULATE: true,
  ANIMATION_DURATION: 500,

  // Machine Learning Model Settings
  ML_MODEL: {
    BASE_PERSISTENCY: 49.1,
    CONFIDENCE_THRESHOLD: 0.85,
    SCORING_WEIGHTS: {
      income: 0.25,
      age: 0.2,
      education: 0.15,
      employment: 0.15,
      region: 0.1,
      household: 0.1,
      housing: 0.05,
    },
    RISK_GRADES: {
      "A+": { min: 90, color: "#059669" },
      A: { min: 80, color: "#10b981" },
      "A-": { min: 75, color: "#34d399" },
      "B+": { min: 70, color: "#fbbf24" },
      B: { min: 65, color: "#f59e0b" },
      "B-": { min: 60, color: "#d97706" },
      "C+": { min: 55, color: "#ea580c" },
      C: { min: 50, color: "#dc2626" },
      "C-": { min: 45, color: "#b91c1c" },
      D: { min: 40, color: "#991b1b" },
      F: { min: 0, color: "#7f1d1d" },
    },
  },

  // Data Sources
  DATA_SOURCES: {
    ZIP_CODE_API: "https://api.zippopotam.us/us/",
    CENSUS_DATA: "/data/census-demographics.json",
    CARRIER_DATA: "/data/carrier-intelligence.json",
    MARKET_DATA: "/data/market-analysis.json",
  },

  // Income Categories
  INCOME_CATEGORIES: {
    ULTRA_HIGH: { min: 250000, label: "Ultra High Net Worth", multiplier: 2.5 },
    HIGH: { min: 150000, label: "High Net Worth", multiplier: 2.0 },
    UPPER_MIDDLE: { min: 100000, label: "Upper Middle Class", multiplier: 1.5 },
    MIDDLE: { min: 75000, label: "Middle Class", multiplier: 1.2 },
    LOWER_MIDDLE: { min: 50000, label: "Lower Middle Class", multiplier: 1.0 },
    WORKING: { min: 35000, label: "Working Class", multiplier: 0.8 },
    LIMITED: { min: 0, label: "Limited Income", multiplier: 0.6 },
  },

  // Regional Multipliers
  REGIONAL_FACTORS: {
    Northeast: {
      cost_of_living: 1.25,
      market_penetration: 0.85,
      competition: "high",
    },
    West: {
      cost_of_living: 1.35,
      market_penetration: 0.78,
      competition: "high",
    },
    South: {
      cost_of_living: 0.95,
      market_penetration: 0.92,
      competition: "medium",
    },
    Midwest: {
      cost_of_living: 0.9,
      market_penetration: 0.88,
      competition: "medium",
    },
  },

  // Seasonal Adjustments
  SEASONAL_FACTORS: {
    Q1: { demand: 1.15, success_rate: 1.2, urgency: "high" }, // Tax season
    Q2: { demand: 0.85, success_rate: 0.95, urgency: "medium" },
    Q3: { demand: 0.9, success_rate: 0.9, urgency: "low" },
    Q4: { demand: 1.1, success_rate: 1.05, urgency: "high" }, // Year-end planning
  },

  // Carrier Intelligence
  CARRIER_PROFILES: {
    "American General Life": {
      approval_rate: 0.942,
      commission: 0.85,
      strengths: ["competitive_pricing", "fast_underwriting"],
      ideal_demographics: ["middle_class", "stable_employment"],
      age_preference: { min: 25, max: 65 },
    },
    "Mutual of Omaha": {
      approval_rate: 0.897,
      commission: 0.8,
      strengths: ["simplified_issue", "brand_recognition"],
      ideal_demographics: ["older_adults", "rural_areas"],
      age_preference: { min: 35, max: 75 },
    },
    GTL: {
      approval_rate: 0.856,
      commission: 0.9,
      strengths: ["high_commission", "flexible_underwriting"],
      ideal_demographics: ["high_income", "urban_areas"],
      age_preference: { min: 30, max: 70 },
    },
    "American Amicable": {
      approval_rate: 0.923,
      commission: 0.75,
      strengths: ["affordable_pricing", "wide_acceptance"],
      ideal_demographics: ["budget_conscious", "working_class"],
      age_preference: { min: 25, max: 80 },
    },
  },

  // Lead Scoring Matrix
  LEAD_SCORING: {
    INCOME_POINTS: {
      above_150k: 25,
      "100k_150k": 20,
      "75k_100k": 15,
      "50k_75k": 10,
      "35k_50k": 5,
      below_35k: 0,
    },
    AGE_POINTS: {
      "25_35": 15,
      "36_45": 20,
      "46_55": 25,
      "56_65": 20,
      "66_75": 10,
      "76_plus": 5,
    },
    EMPLOYMENT_POINTS: {
      full_time: 20,
      self_employed: 15,
      contractor: 10,
      part_time: 5,
      retired: 12,
      unemployed: 0,
    },
    HOUSING_POINTS: {
      own: 15,
      rent: 8,
      other: 3,
    },
  },

  // Predictive Models
  PREDICTION_MODELS: {
    PERSISTENCY: {
      base_rate: 0.491,
      factors: {
        income_stability: 0.15,
        age_factor: 0.12,
        education_level: 0.1,
        employment_type: 0.08,
        household_size: 0.05,
      },
    },
    CONVERSION: {
      base_rate: 0.287,
      factors: {
        lead_score: 0.2,
        seasonal_timing: 0.15,
        market_conditions: 0.1,
        competitor_activity: 0.08,
      },
    },
    CROSS_SELL: {
      base_rate: 0.421,
      factors: {
        customer_satisfaction: 0.25,
        income_growth: 0.15,
        life_events: 0.2,
        product_fit: 0.1,
      },
    },
  },

  // Chart Configurations
  CHART_CONFIGS: {
    COLORS: {
      primary: "#2563eb",
      secondary: "#7c3aed",
      success: "#059669",
      warning: "#d97706",
      danger: "#dc2626",
      info: "#0891b2",
    },
    GRADIENTS: {
      primary: ["#2563eb", "#7c3aed"],
      success: ["#059669", "#34d399"],
      warning: ["#d97706", "#fbbf24"],
    },
  },

  // Export Settings
  EXPORT: {
    PDF_OPTIONS: {
      format: "a4",
      margin: 20,
      title: "Insurance Analytics Report",
      author: "Advanced Analytics Platform",
    },
    CSV_DELIMITER: ",",
    INCLUDE_METADATA: true,
  },

  // Performance Settings
  PERFORMANCE: {
    CACHE_DURATION: 300000, // 5 minutes
    MAX_CACHE_SIZE: 100,
    LAZY_LOAD_CHARTS: true,
    OPTIMIZE_ANIMATIONS: true,
  },

  // API Endpoints (for future integration)
  API_ENDPOINTS: {
    DEMOGRAPHICS: "/api/demographics",
    MARKET_DATA: "/api/market",
    CARRIER_RATES: "/api/carriers",
    LEAD_SCORING: "/api/scoring",
    ANALYTICS: "/api/analytics",
  },

  // Feature Flags
  FEATURES: {
    REAL_TIME_CALCULATIONS: true,
    ADVANCED_ANALYTICS: true,
    ML_SCORING: true,
    MARKET_INTELLIGENCE: true,
    AB_TESTING: true,
    EXPORT_FUNCTIONALITY: true,
    OFFLINE_MODE: false,
    CRM_INTEGRATION: false,
  },

  // User Experience Settings
  UX: {
    SHOW_TOOLTIPS: true,
    ANIMATE_TRANSITIONS: true,
    ENABLE_SOUNDS: false,
    DARK_MODE: false,
    AUTO_SAVE: true,
  },

  // Validation Rules
  VALIDATION: {
    ZIP_CODE: /^\d{5}$/,
    INCOME: { min: 0, max: 10000000 },
    AGE: { min: 18, max: 85 },
    COVERAGE: { min: 5000, max: 5000000 },
  },
};

// Utility Functions
window.AnalyticsPlatform.Config.getRiskGrade = function (score) {
  const grades = this.ML_MODEL.RISK_GRADES;
  for (const [grade, config] of Object.entries(grades)) {
    if (score >= config.min) {
      return { grade, color: config.color };
    }
  }
  return { grade: "F", color: grades.F.color };
};

window.AnalyticsPlatform.Config.getIncomeCategory = function (income) {
  const categories = this.INCOME_CATEGORIES;
  for (const [key, config] of Object.entries(categories)) {
    if (income >= config.min) {
      return { key, ...config };
    }
  }
  return { key: "LIMITED", ...categories.LIMITED };
};

window.AnalyticsPlatform.Config.getCurrentQuarter = function () {
  const month = new Date().getMonth() + 1;
  if (month <= 3) return "Q1";
  if (month <= 6) return "Q2";
  if (month <= 9) return "Q3";
  return "Q4";
};

// Freeze configuration to prevent modification
Object.freeze(window.AnalyticsPlatform.Config);
