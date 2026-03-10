import fs from "fs";

// Read test results
const content = fs.readFileSync("bowtie/bowtie-implementations.json", "utf-8");

// Extract implementations using regex
const implementationMatches = [
  ...content.matchAll(/"implementation": "([^"]*)"/g),
];
console.log("implementationMatches: ", implementationMatches);

const implementations: string[] = [
  ...new Set(implementationMatches.map((match) => match[1])),
];
console.log("implentations: ", implementations);

const results: {
  [key: string]: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    scorePercentage: number;
  };
} = {};

for (const impl of implementations) {
  // Find all test blocks for this implementation
  const implBlocks =
    content.match(
      new RegExp(
        `\\{[^}]*"implementation": "${impl}"[^}]*"expected":\\s*\\[[^\\]]*\\][^}]*"results":\\s*\\[[^\\]]*\\][^}]*\\}`,
        "g",
      ),
    ) || [];

  let totalTests = 0;
  let passedTests = 0;

  for (const block of implBlocks) {
    try {
      // Parse the test block to get expected and results
      const blockObj = JSON.parse(block);
      const expected = blockObj.expected;
      const results = blockObj.results;

      // Compare each result with expected value
      for (let i = 0; i < expected.length && i < results.length; i++) {
        totalTests++;
        if (expected[i] === results[i].valid) {
          passedTests++;
        }
      }
    } catch (e) {
      console.error(`Error parsing block for ${impl}:`, e);
    }
  }

  const failedTests = totalTests - passedTests;
  const scorePercentage =
    totalTests > 0
      ? parseFloat(((passedTests / totalTests) * 100).toFixed(2))
      : 0;

  results[impl] = {
    totalTests,
    passedTests,
    failedTests,
    scorePercentage,
  };
}

// Create output
const output = {
  implementations: results,
  metadata: {
    generated: new Date().toISOString().replace(/\.\d+/, "") + "Z", // UTC ISO string
    testSuite: "bowtie",
    dialect: "2020-12",
    totalImplementations: Object.keys(results).length,
  },
};

// Save to file
fs.writeFileSync(
  "bowtie/bowtie-scores.json",
  JSON.stringify(output, null, 2),
  "utf-8",
);

// Print output
console.log("Generated bowtie/bowtie-scores.json");
