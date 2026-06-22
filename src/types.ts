export interface MultilingualText {
  en: string;
  fa: string; // Persian/Farsi
  ar?: string; // Arabic
  tr?: string; // Turkish
  fr?: string; // French
  es?: string; // Spanish
  de?: string; // German
  zh?: string; // Chinese
}

export interface Startup {
  id: string;
  name: string;
  slogan: string | MultilingualText;
  industry: string;
  yearFounded: number;
  yearFailed: number;
  fundingRaised: string; // e.g. "$22.0B"
  primaryFailureReason: string; // Crucial category name
  detailedFailureReason: string | MultilingualText; // Explanatory subtitle
  founders: string[];
  country: string;
  postMortem: string | MultilingualText; // Long form post-mortem analysis
  lessonsLearned: string[] | MultilingualText[]; // key takeaways
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
