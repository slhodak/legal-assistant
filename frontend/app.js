// Legal Assistant Frontend
// Handles form submission and displays results

const API_URL = 'http://localhost:5000/api/query';

const form = document.getElementById('query-form');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const jurisdictionLayers = document.getElementById('jurisdiction-layers');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous results and errors
    results.classList.add('hidden');
    error.classList.add('hidden');
    loading.classList.remove('hidden');

    const query = document.getElementById('query').value;
    const address = document.getElementById('address').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, address })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch laws');
        }

        const data = await response.json();
        displayResults(data);

    } catch (err) {
        showError(err.message);
    } finally {
        loading.classList.add('hidden');
    }
});

function displayResults(data) {
    // Display jurisdiction layers vertically stacked from most general to most specific
    if (!data.jurisdiction_stack || data.jurisdiction_stack.length === 0) {
        jurisdictionLayers.innerHTML = '<p>No jurisdiction information available.</p>';
        results.classList.remove('hidden');
        return;
    }

    // Create a map of laws by jurisdiction (level + name)
    const lawsByJurisdiction = new Map();
    if (data.laws && data.laws.length > 0) {
        data.laws.forEach(law => {
            const key = `${law.jurisdiction_level}:${law.jurisdiction_name}`;
            if (!lawsByJurisdiction.has(key)) {
                lawsByJurisdiction.set(key, []);
            }
            lawsByJurisdiction.get(key).push(law);
        });
    }

    // Display each jurisdiction layer with its laws
    jurisdictionLayers.innerHTML = data.jurisdiction_stack
        .map(jurisdiction => {
            const key = `${jurisdiction.level}:${jurisdiction.name}`;
            const laws = lawsByJurisdiction.get(key) || [];

            return `
                <div class="jurisdiction-layer">
                    <h3 class="jurisdiction-name">
                        <span class="jurisdiction-level-badge">${formatLevel(jurisdiction.level)}</span>
                        ${jurisdiction.name}
                    </h3>
                    ${laws.length > 0
                    ? `<div class="laws-list">${laws.map(law => renderLaw(law)).join('')}</div>`
                    : '<p class="no-laws">No applicable laws found for this jurisdiction.</p>'
                }
                </div>
            `;
        }).join('');

    results.classList.remove('hidden');
}

function formatLevel(level) {
    return level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ');
}

function renderLaw(law) {
    return `
        <div class="law-card">
            <div class="law-header">
                <span class="law-type">${law.type}</span>
                ${law.title ? `<h4 class="law-title">${law.title}</h4>` : ''}
            </div>
            <div class="law-body">
                <div class="law-jurisdiction">
                    <strong>Jurisdiction:</strong> ${law.jurisdiction_name} (${law.jurisdiction_level})
                </div>
                <div class="law-citation">
                    <strong>Citation:</strong> <code>${law.citation}</code>
                </div>
                <div class="law-relevance">
                    <strong>Relevance:</strong> ${law.relevance_summary}
                </div>
                <div class="law-source">
                    <strong>Source:</strong> ${law.source_name}
                    ${law.source_url ? `<a href="${law.source_url}" target="_blank" rel="noopener noreferrer">View source</a>` : ''}
                </div>
                ${law.tags && law.tags.length > 0 ? `
                    <div class="law-tags">
                        ${law.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function showError(message) {
    error.textContent = `Error: ${message}`;
    error.classList.remove('hidden');
}

