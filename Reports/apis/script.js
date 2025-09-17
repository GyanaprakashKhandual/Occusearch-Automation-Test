// Global variables
let allApis = [];
let filteredApis = [];
let currentPage = 1;
const itemsPerPage = 3;
let currentFilters = {
    search: '',
    method: 'all',
    status: 'all'
};

// Initialize the app
async function init() {
    await loadData();
    setupEventListeners();
    applyFilters();
    setupTheme();
}

// Load data from JSON file
async function loadData() {
    try {
        // In a real app, you would fetch your JSON file
        const response = await fetch('./api.data.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON
        allApis = await response.json();

    } catch (error) {
        console.error('Error loading data:', error);
        allApis = [];
    }
}


// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        currentPage = 1;
        applyFilters();
    });

    // Method filter
    document.querySelectorAll('.method-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const method = e.target.dataset.method;
            currentFilters.method = method;
            document.getElementById('methodFilter').innerHTML = `
                        <span class="material-icons text-sm mr-1">tune</span>
                        Method: ${method === 'all' ? 'All' : method}
                        <span class="material-icons ml-1">keyboard_arrow_down</span>
                    `;
            currentPage = 1;
            applyFilters();
        });
    });

    // Status filter
    document.querySelectorAll('.status-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const status = e.target.dataset.status;
            currentFilters.status = status;
            const statusText = status === 'all' ? 'All' : (status === 'passed' ? 'All Tests Passed' : 'At Least One Failed');
            document.getElementById('statusFilter').innerHTML = `
                        <span class="material-icons text-sm mr-1">filter_list</span>
                        Status: ${statusText}
                        <span class="material-icons ml-1">keyboard_arrow_down</span>
                    `;
            currentPage = 1;
            applyFilters();
        });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCards();
            updatePagination();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredApis.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderCards();
            updatePagination();
        }
    });
}

// Apply filters and search
function applyFilters() {
    filteredApis = allApis.filter(api => {
        // Search filter
        const matchesSearch = !currentFilters.search ||
            api.apiName.toLowerCase().includes(currentFilters.search);

        // Method filter
        const matchesMethod = currentFilters.method === 'all' ||
            api.requestMethod === currentFilters.method;

        // Status filter
        let matchesStatus = true;
        if (currentFilters.status === 'passed') {
            matchesStatus = api.failedTestCase === 0;
        } else if (currentFilters.status === 'failed') {
            matchesStatus = api.failedTestCase > 0;
        }

        return matchesSearch && matchesMethod && matchesStatus;
    });

    renderCards();
    updatePagination();
    updateResultsInfo();
}

// Render API cards
function renderCards() {
    const container = document.getElementById('apiCards');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageApis = filteredApis.slice(startIndex, endIndex);

    if (pageApis.length === 0) {
        container.innerHTML = `
                    <div class="text-center py-12">
                        <span class="material-icons text-gray-400 text-6xl mb-4">search_off</span>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No APIs found</h3>
                        <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                    </div>
                `;
        return;
    }

    container.innerHTML = pageApis.map((api, index) => `
                <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center space-x-3 mb-2">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${api.apiName}</h3>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(api.requestMethod)}">${api.requestMethod}</span>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(api.statusCode)}">${api.statusCode}</span>
                                </div>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 font-mono">${api.requestUrl}</p>
                                
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-gray-900 dark:text-white">${api.totalTestCase}</div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Total Tests</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">${api.passedTestCase}</div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Passed</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-red-600 dark:text-red-400">${api.failedTestCase}</div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Failed</div>
                                    </div>
                                </div>
                            </div>
                            
                            <button onclick="toggleCard(${startIndex + index})" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none">
                                <span class="material-icons transform transition-transform duration-200" id="arrow-${startIndex + index}">expand_more</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Expandable content -->
                    <div id="details-${startIndex + index}" class="hidden border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
                        ${api.bugs.length > 0 ? `
                            <h4 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
                                <span class="material-icons mr-2">bug_report</span>
                                Issues Found (${api.bugs.length})
                            </h4>
                            <div class="space-y-4">
                                ${api.bugs.map(bug => `
                                    <div class="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <div class="flex items-center mb-2">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">${bug.id}</span>
                                        </div>
                                        <h5 class="font-semibold text-gray-900 dark:text-white mb-2">${bug.description}</h5>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span class="font-medium text-gray-700 dark:text-gray-300">Expected:</span>
                                                <p class="text-gray-600 dark:text-gray-400 mt-1">${bug.expectedResult}</p>
                                            </div>
                                            <div>
                                                <span class="font-medium text-gray-700 dark:text-gray-300">Actual:</span>
                                                <p class="text-gray-600 dark:text-gray-400 mt-1">${bug.actualResult}</p>
                                            </div>
                                        </div>
                                        <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                            <span class="font-medium text-blue-800 dark:text-blue-200">Requirement:</span>
                                            <p class="text-blue-700 dark:text-blue-300 mt-1">${bug.requirement}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="text-center py-8">
                                <span class="material-icons text-green-500 text-6xl mb-4">check_circle</span>
                                <h4 class="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">All Tests Passed!</h4>
                                <p class="text-gray-600 dark:text-gray-400">No issues found in this API endpoint.</p>
                            </div>
                        `}
                    </div>
                </div>
            `).join('');
}

// Toggle card expansion
function toggleCard(index) {
    const details = document.getElementById(`details-${index}`);
    const arrow = document.getElementById(`arrow-${index}`);

    if (details.classList.contains('hidden')) {
        details.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        details.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredApis.length / itemsPerPage);
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    // Update button states
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages === 0;

    // Update showing info
    const startItem = filteredApis.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredApis.length);

    document.getElementById('showingFrom').textContent = startItem;
    document.getElementById('showingTo').textContent = endItem;

    // Generate page numbers
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-1 text-sm rounded-md ${i === currentPage ?
            'bg-blue-600 text-white' :
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderCards();
            updatePagination();
        });
        pageNumbers.appendChild(pageButton);
    }
}

// Update results info
function updateResultsInfo() {
    const total = filteredApis.length;
    const passed = filteredApis.filter(api => api.failedTestCase === 0).length;
    const failed = total - passed;

    document.getElementById('resultsInfo').textContent =
        `${total} APIs found • ${passed} passing • ${failed} with issues`;
    document.getElementById('totalResults').textContent = total;
}

// Get method color classes
function getMethodColor(method) {
    const colors = {
        'GET': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'POST': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'PUT': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'PATCH': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
}

// Get status color classes
function getStatusColor(statusCode) {
    if (statusCode.startsWith('2')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (statusCode.startsWith('4') || statusCode.startsWith('5')) {
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
}

// Theme functionality
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon('dark');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    }
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeToggle').querySelector('.material-icons');
    themeIcon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);