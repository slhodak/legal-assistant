/**
 * Unit tests for the Legal Assistant frontend.
 * These tests can be run in a browser environment with a test framework,
 * or manually verified by checking the logic.
 */

// Mock DOM elements for testing
function createMockDOM() {
  const mockForm = {
    addEventListener: jest.fn(),
    preventDefault: jest.fn()
  };

  const mockElements = {
    'query-form': mockForm,
    'query': { value: '' },
    'address': { value: '' },
    'loading': { classList: { add: jest.fn(), remove: jest.fn() } },
    'error': { classList: { add: jest.fn(), remove: jest.fn() }, textContent: '' },
    'results': { classList: { add: jest.fn(), remove: jest.fn() } },
    'jurisdiction-layers': { innerHTML: '' }
  };

  return {
    getElementById: (id) => mockElements[id] || null,
    query: { value: 'test query' },
    address: { value: '123 Main St' }
  };
}

// Test data
const mockResponseData = {
  laws: [
    {
      id: "law_1",
      type: "statute",
      jurisdiction_level: "state",
      jurisdiction_name: "California",
      citation: "Cal. Bus. & Prof. Code § 12345",
      relevance_summary: "Applies to restaurant licensing",
      source_name: "California Business and Professions Code"
    },
    {
      id: "law_2",
      type: "ordinance",
      jurisdiction_level: "city",
      jurisdiction_name: "San Francisco",
      citation: "SF Health Code § 456",
      relevance_summary: "Restaurant health requirements",
      source_name: "San Francisco Health Code"
    }
  ],
  jurisdiction_stack: [
    { level: "federal", name: "United States" },
    { level: "state", name: "California" },
    { level: "county", name: "San Francisco County" },
    { level: "city", name: "San Francisco" }
  ]
};

// Test: formatLevel function
function testFormatLevel() {
  const testCases = [
    { input: "federal", expected: "Federal" },
    { input: "state", expected: "State" },
    { input: "special_district", expected: "Special District" }
  ];

  testCases.forEach(({ input, expected }) => {
    const result = formatLevel(input);
    console.assert(result === expected,
      `formatLevel("${input}") should return "${expected}", got "${result}"`);
  });
}

// Test: displayResults function structure
function testDisplayResults() {
  const mockDOM = createMockDOM();
  const jurisdictionLayers = mockDOM.getElementById('jurisdiction-layers');

  // Simulate displayResults
  displayResults(mockResponseData);

  // Verify that jurisdiction layers container was populated
  console.assert(jurisdictionLayers.innerHTML.length > 0,
    "displayResults should populate jurisdiction-layers");

  // Verify that all jurisdictions from stack are displayed
  mockResponseData.jurisdiction_stack.forEach(jurisdiction => {
    const key = `${jurisdiction.level}:${jurisdiction.name}`;
    console.assert(jurisdictionLayers.innerHTML.includes(jurisdiction.name),
      `displayResults should include jurisdiction: ${jurisdiction.name}`);
  });
}

// Test: renderLaw function
function testRenderLaw() {
  const law = mockResponseData.laws[0];
  const html = renderLaw(law);

  // Verify key elements are present
  console.assert(html.includes(law.citation),
    "renderLaw should include citation");
  console.assert(html.includes(law.jurisdiction_name),
    "renderLaw should include jurisdiction name");
  console.assert(html.includes(law.relevance_summary),
    "renderLaw should include relevance summary");
}

// Test: Laws are matched to correct jurisdictions
function testLawJurisdictionMatching() {
  const lawsByJurisdiction = new Map();
  mockResponseData.laws.forEach(law => {
    const key = `${law.jurisdiction_level}:${law.jurisdiction_name}`;
    if (!lawsByJurisdiction.has(key)) {
      lawsByJurisdiction.set(key, []);
    }
    lawsByJurisdiction.get(key).push(law);
  });

  // Verify California state law is matched
  const californiaKey = "state:California";
  console.assert(lawsByJurisdiction.has(californiaKey),
    "Laws should be matched to California state jurisdiction");

  // Verify San Francisco city law is matched
  const sfKey = "city:San Francisco";
  console.assert(lawsByJurisdiction.has(sfKey),
    "Laws should be matched to San Francisco city jurisdiction");
}

// Test: Jurisdiction stack order (most general to most specific)
function testJurisdictionStackOrder() {
  const stack = mockResponseData.jurisdiction_stack;
  const levelOrder = ['federal', 'state', 'county', 'city', 'special_district'];

  for (let i = 0; i < stack.length - 1; i++) {
    const currentLevel = stack[i].level;
    const nextLevel = stack[i + 1].level;
    const currentIndex = levelOrder.indexOf(currentLevel);
    const nextIndex = levelOrder.indexOf(nextLevel);

    console.assert(currentIndex < nextIndex,
      `Jurisdiction stack should be ordered from general to specific. ` +
      `Found ${currentLevel} after ${nextLevel}`);
  }
}

// Run all tests
if (typeof window !== 'undefined' && window.location.pathname.includes('test')) {
  console.log('Running frontend tests...');
  testFormatLevel();
  testDisplayResults();
  testRenderLaw();
  testLawJurisdictionMatching();
  testJurisdictionStackOrder();
  console.log('All frontend tests completed!');
}

// Export for use in test runners
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testFormatLevel,
    testDisplayResults,
    testRenderLaw,
    testLawJurisdictionMatching,
    testJurisdictionStackOrder,
    mockResponseData
  };
}

