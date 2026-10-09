// Source-backed corrections for the four featured cases, reviewed 2026-10-09.
// Apply explicitly; this does not claim to verify the rest of the archive.
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '../src/startups.json');
const corrections = {
  wework: {
    slogan: 'The coworking company that entered Chapter 11, then emerged after restructuring.',
    fundingRaised: '$12.8B in its first decade',
    primaryFailureReason: 'Lease obligations & restructuring',
    detailedFailureReason: 'Its restructuring involved reducing debt and changing a large portfolio of office leases. The company emerged from Chapter 11 in June 2024.',
    postMortem: 'Founded in 2010, WeWork built a global coworking business. Its attempted 2019 IPO exposed governance concerns and was withdrawn. In November 2023, the company entered Chapter 11 bankruptcy protection.\n\nOn June 11, 2024, WeWork announced that it had completed its restructuring and emerged from Chapter 11. Its announcement described a reduction in debt and lease commitments. This case concerns a major financial restructuring, not the permanent closure of the business.',
    lessonsLearned: ['Stress-test long-term commitments against changes in customer demand.', 'Make governance and financial reporting part of the growth plan.', 'Distinguish a company restructuring from a company disappearing.'],
    sourceUrls: ['https://www.sec.gov/Archives/edgar/data/1813756/000119312524159419/d803133dex993.htm', 'https://en.wikipedia.org/wiki/WeWork'],
  },
  theranos: {
    slogan: 'Blood-testing promises that did not withstand regulatory scrutiny.',
    fundingRaised: 'More than $700M (SEC, 2018)',
    primaryFailureReason: 'Misrepresentation of technology',
    detailedFailureReason: 'The SEC alleged that investors were misled about the capabilities and financial performance of the company’s blood-testing technology.',
    postMortem: 'Theranos was founded in 2003 and promoted testing from very small blood samples. In March 2018, the SEC brought fraud charges against the company, Elizabeth Holmes, and Ramesh Balwani.\n\nThe SEC said the proprietary analyzer could perform only a limited number of tests, while many tests were carried out using other commercial equipment. It also challenged claims about revenue and military deployment. Theranos dissolved in 2018.',
    lessonsLearned: ['Require independent evidence for technical claims.', 'Give specialists the authority to question product readiness.', 'Treat accurate communication with customers and investors as a core operating responsibility.'],
    sourceUrls: ['https://www.sec.gov/newsroom/press-releases/2018-41', 'https://en.wikipedia.org/wiki/Theranos'],
  },
  quibi: {
    slogan: 'A well-funded bet on short-form mobile video that closed within its launch year.',
    fundingRaised: '$1.75B',
    primaryFailureReason: 'Insufficient subscriber demand',
    detailedFailureReason: 'A large production budget and established industry names did not translate into a sustainable audience for the subscription service.',
    postMortem: 'Quibi was founded in 2018 and launched its short-form video subscription service in April 2020. It raised $1.75 billion and commissioned programming designed primarily for mobile viewing.\n\nIn October 2020, the company announced that it would wind down, about six months after launch. The service ended in December. Quibi’s leaders cited both the idea’s ability to support a standalone service and the timing of the launch. Its content library was subsequently acquired by Roku.',
    lessonsLearned: ['Test willingness to subscribe before committing to large content budgets.', 'Validate when and where customers actually use the product.', 'Separate the strength of a team from evidence of demand.'],
    sourceUrls: ['https://en.wikipedia.org/wiki/Quibi'],
  },
  juicero: {
    slogan: 'A connected juice press whose expensive hardware became difficult to justify.',
    fundingRaised: '$120M',
    primaryFailureReason: 'Hardware value proposition',
    detailedFailureReason: 'Demonstrations that the produce packs could be squeezed by hand raised questions about the value of the connected press.',
    postMortem: 'Founded in 2013, Juicero developed an internet-connected press for proprietary produce packs and raised $120 million. The press initially cost $699 and later sold for $399.\n\nIn 2017, Bloomberg demonstrated that packs could also be squeezed by hand. That finding undermined the perceived need for the machine. In September 2017, Juicero suspended sales, offered refunds, and sought a buyer for its business and intellectual property.',
    lessonsLearned: ['Compare a product with the simplest available alternative.', 'Verify that hardware adds value customers will pay for.', 'Test the economics of both the device and its recurring supplies.'],
    sourceUrls: ['https://en.wikipedia.org/wiki/Juicero'],
  },
};
const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const [id, correction] of Object.entries(corrections)) {
  const record = catalog.find(item => item.id === id);
  if (!record) throw new Error(`Featured case missing: ${id}`);
  Object.assign(record, correction);
}
fs.writeFileSync(file, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log('Updated four featured cases with explicit public sources.');
