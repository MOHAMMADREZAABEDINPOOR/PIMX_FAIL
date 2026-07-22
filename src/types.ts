export interface Startup {
  id: string;
  name: string;
  slogan: string;
  industry: string;
  yearFounded: number | "Not publicly documented";
  yearFailed: number | "Not publicly documented";
  fundingRaised: string; // e.g. "$22.0B"
  primaryFailureReason: string; // Crucial category name
  detailedFailureReason: string; // Explanatory subtitle
  founders: string[];
  country: string;
  postMortem: string; // Long form post-mortem analysis
  lessonsLearned: string[]; // key takeaways
  sourceUrls?: string[]; // Public research sources used to verify the record
  metrics: {
    failureScore: number; // 1-100 indicating critical severity
    marketFitScore: number; // 1-100
    executionScore: number; // 1-100
    fundingRiskScore: number; // 1-100
    competitorRiskScore: number; // 1-100
  };
}

export interface AIAnalysisResult {
  failureScore: number;
  marketFitScore: number;
  executionScore: number;
  fundingRiskScore: number;
  competitorRiskScore: number;
  analysis: string;
  mistakes: string[];
  lessons: string[];
  pathway: string;
}

export interface TechnicalBlueprint {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  codeLanguage: string;
  code: string;
}
