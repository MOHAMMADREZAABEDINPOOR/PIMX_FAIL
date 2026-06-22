/**
 * Script to parse raw startup data from text files and convert to TypeScript format
 * Handles ~1460 startups across 10 raw files
 */

import { readFileSync, writeFileSync } from 'fs';
import { Startup } from '../src/types';

interface RawStartup {
  number: string;
  name: string;
  industry: string;
  description: string;
  yearRange: string;
  funding: string;
  failureScore: string;
  primaryReason: string;
}

function parseRawFile(filePath: string): RawStartup[] {
  const content = readFileSync(filePath, 'utf-8');
  const startups: RawStartup[] = [];
  
  // Split by startup entries (starting with #number)
  const entries = content.split(/^#(\d+)/m).filter(Boolean);
  
  for (let i = 0; i < entries.length; i += 2) {
    if (i + 1 < entries.length) {
      const number = entries[i].trim();
      const data = entries[i + 1];
      
      const lines = data.split('\n').filter(line => line.trim());
      
      if (lines.length >= 4) {
        const name = lines[0].trim();
        const industry = lines[1].trim();
        const description = lines[2].trim();
        
        // Find year range
        const yearMatch = data.match(/طول عمر:\s*\n\s*(.+)/);
        const yearRange = yearMatch ? yearMatch[1].trim() : 'نامشخص';
        
        // Find funding
        const fundingMatch = data.match(/سرمایه‌گذاری:\s*\n\s*(.+)/);
        const funding = fundingMatch ? fundingMatch[1].trim() : 'نامشخص';
        
        // Find failure score
        const scoreMatch = data.match(/شاخص شکست\s*\n\s*(\d+)%/);
        const failureScore = scoreMatch ? scoreMatch[1] : '80';
        
        // Find primary reason (last line typically)
        const reasonMatch = data.match(/\n([A-Z][A-Za-z\s/&]+)$/);
        const primaryReason = reasonMatch ? reasonMatch[1].trim() : 'Multiple Factors';
        
        startups.push({
          number,
          name,
          industry,
          description,
          yearRange,
          funding,
          failureScore,
          primaryReason
        });
      }
    }
  }
  
  return startups;
}

function parseYearRange(yearRange: string): { founded: number; failed: number } {
  // Parse formats like: "2010 - 2023 (13 yrs)" or "2020 (نامشخص)" or "نامشخص"
  
  if (yearRange === 'نامشخص') {
    return { founded: 2000, failed: 2020 };
  }
  
  const rangeMatch = yearRange.match(/(\d{4})\s*-\s*(\d{4})/);
  if (rangeMatch) {
    return {
      founded: parseInt(rangeMatch[1]),
      failed: parseInt(rangeMatch[2])
    };
  }
  
  const singleMatch = yearRange.match(/(\d{4})/);
  if (singleMatch) {
    const year = parseInt(singleMatch[1]);
    return { founded: year - 5, failed: year };
  }
  
  return { founded: 2010, failed: 2020 };
}

function extractFounders(description: string, name: string): string[] {
  // Try to extract founder names from description
  const founderPatterns = [
    /founded by ([A-Z][a-z]+ [A-Z][a-z]+(?:,? (?:and |& )?[A-Z][a-z]+ [A-Z][a-z]+)*)/i,
    /[Cc]o-founders? ([A-Z][a-z]+ [A-Z][a-z]+(?:,? (?:and |& )?[A-Z][a-z]+ [A-Z][a-z]+)*)/i,
    /[Ff]ounder ([A-Z][a-z]+ [A-Z][a-z]+)/i,
    /CEO ([A-Z][a-z]+ [A-Z][a-z]+)/i
  ];
  
  for (const pattern of founderPatterns) {
    const match = description.match(pattern);
    if (match) {
      const foundersStr = match[1];
      return foundersStr
        .split(/,\s*(?:and\s+)?|(?:\s+and\s+)/)
        .map(f => f.trim())
        .filter(f => f.length > 0);
    }
  }
  
  return ['Unknown'];
}

function determineCountry(description: string, industry: string): string {
  const countryPatterns = [
    { pattern: /\b(United States|U\.S\.|American|Silicon Valley|New York|San Francisco|California)\b/i, country: 'United States' },
    { pattern: /\b(China|Chinese|Beijing|Shanghai)\b/i, country: 'China' },
    { pattern: /\b(Israel|Israeli|Tel Aviv)\b/i, country: 'Israel' },
    { pattern: /\b(UK|United Kingdom|British|London)\b/i, country: 'United Kingdom' },
    { pattern: /\b(Germany|German|Berlin)\b/i, country: 'Germany' },
    { pattern: /\b(India|Indian|Bangalore)\b/i, country: 'India' },
    { pattern: /\b(Canada|Canadian|Toronto)\b/i, country: 'Canada' },
    { pattern: /\b(France|French|Paris)\b/i, country: 'France' },
    { pattern: /\b(Bahamas)\b/i, country: 'Bahamas' },
    { pattern: /\b(Hong Kong)\b/i, country: 'Hong Kong' }
  ];
  
  for (const { pattern, country } of countryPatterns) {
    if (pattern.test(description)) {
      return country;
    }
  }
  
  return 'United States'; // Default
}

function generateSlogan(name: string, description: string): string {
  // Extract first sentence or create a brief slogan
  const firstSentence = description.match(/^([^.!?]+[.!?])/);
  if (firstSentence) {
    let slogan = firstSentence[1].trim();
    if (slogan.length > 120) {
      slogan = slogan.substring(0, 117) + '...';
    }
    return slogan;
  }
  
  // Fallback: take first 100 chars
  return description.substring(0, 100) + '...';
}

function convertToStartup(raw: RawStartup): Startup {
  const { founded, failed } = parseYearRange(raw.yearRange);
  const founders = extractFounders(raw.description, raw.name);
  const country = determineCountry(raw.description, raw.industry);
  const slogan = generateSlogan(raw.name, raw.description);
  const failureScore = parseInt(raw.failureScore);
  
  // Generate ID from name
  const id = raw.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  // Calculate metrics based on failure type and score
  const marketFitScore = Math.max(10, 100 - failureScore + Math.floor(Math.random() * 20));
  const executionScore = raw.primaryReason.includes('Management') ? 20 : 
                         raw.primaryReason.includes('Fraud') ? 10 :
                         raw.primaryReason.includes('Competition') ? 60 :
                         Math.floor(Math.random() * 40) + 30;
  const fundingRiskScore = raw.primaryReason.includes('Funding') || raw.primaryReason.includes('Burn') ? 95 : 
                          Math.floor(Math.random() * 30) + 50;
  const competitorRiskScore = raw.primaryReason.includes('Competition') || raw.primaryReason.includes('Saturation') ? 90 :
                             Math.floor(Math.random() * 40) + 40;
  
  return {
    id,
    name: raw.name,
    slogan,
    industry: raw.industry,
    yearFounded: founded,
    yearFailed: failed,
    fundingRaised: raw.funding === 'نامشخص' ? 'Unknown' : raw.funding,
    primaryFailureReason: raw.primaryReason,
    detailedFailureReason: raw.description.substring(0, 200) + '...',
    founders,
    country,
    postMortem: raw.description,
    lessonsLearned: [
      'Detailed analysis required',
      'Market timing is crucial',
      'Financial discipline matters'
    ],
    metrics: {
      failureScore,
      marketFitScore,
      executionScore,
      fundingRiskScore,
      competitorRiskScore
    }
  };
}

// Main processing
const rawFiles = [
  'src/raw_startups_1.txt',
  'src/raw_startups_2.txt',
  'src/raw_startups_3.txt',
  'src/raw_startups_4.txt',
  'src/raw_startups_5.txt',
  'src/raw_startups_6.txt',
  'src/raw_startups_7.txt',
  'src/raw_startups_8.txt',
  'src/raw_startups_9.txt',
  'src/raw_startups_10.txt'
];

console.log('Starting to parse startup files...');

const allStartups: Startup[] = [];

for (const file of rawFiles) {
  try {
    console.log(`Processing ${file}...`);
    const rawStartups = parseRawFile(file);
    const startups = rawStartups.map(convertToStartup);
    allStartups.push(...startups);
    console.log(`  Parsed ${startups.length} startups from ${file}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}

console.log(`\nTotal startups parsed: ${allStartups.length}`);

// Write output
const output = `import { Startup } from "./types";

export const SEED_STARTUPS: Startup[] = ${JSON.stringify(allStartups, null, 2)};
`;

writeFileSync('src/data_generated.ts', output, 'utf-8');
console.log('\nGenerated data written to src/data_generated.ts');
