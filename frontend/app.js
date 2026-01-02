// Legal Assistant Frontend
// Handles form submission and displays results

const API_URL = 'http://localhost:5000/api/query';

const form = document.getElementById('query-form');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const jurisdictionStack = document.getElementById('jurisdiction-stack');
const lawsContainer = document.getElementById('laws-container');

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
    // Display jurisdiction stack
    if (data.jurisdiction_stack && data.jurisdiction_stack.length > 0) {
        jurisdictionStack.innerHTML = '<ul class="jurisdiction-list">' +
            data.jurisdiction_stack.map(j => 
                `<li><strong>${j.level}</strong>: ${j.name}</li>`
            ).join('') +
            '</ul>';
    } else {
        jurisdictionStack.innerHTML = '<p>No jurisdiction information available.</p>';
    }
    
    // Display laws
    if (data.laws && data.laws.length > 0) {
        // Group laws by jurisdiction level
        const grouped = groupByJurisdiction(data.laws);
        
        lawsContainer.innerHTML = Object.keys(grouped)
            .sort((a, b) => {
                const order = ['federal', 'state', 'county', 'city', 'special_district'];
                return order.indexOf(a) - order.indexOf(b);
            })
            .map(level => {
                const laws = grouped[level];
                return `
                    <div class="jurisdiction-group">
                        <h3 class="jurisdiction-level">${level.charAt(0).toUpperCase() + level.slice(1).replace('_', ' ')}</h3>
                        ${laws.map(law => renderLaw(law)).join('')}
                    </div>
                `;
            }).join('');
    } else {
        lawsContainer.innerHTML = '<p>No applicable laws found.</p>';
    }
    
    results.classList.remove('hidden');
}

function groupByJurisdiction(laws) {
    const grouped = {};
    laws.forEach(law => {
        const level = law.jurisdiction_level;
        if (!grouped[level]) {
            grouped[level] = [];
        }
        grouped[level].push(law);
    });
    return grouped;
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

