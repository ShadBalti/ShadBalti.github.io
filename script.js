// GitHub API Configuration
const GITHUB_USERNAME = 'ShadBalti';
const REPOS_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const CONTRIBUTIONS_URL = `https://github.com/${GITHUB_USERNAME}`;

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const githubStatsSection = document.querySelector('.github-stats');
const contributionGraph = document.querySelector('.contribution-graph');

// Fetch GitHub Repositories
async function fetchGitHubRepos() {
  try {
    const response = await fetch(REPOS_URL);
    const repos = await response.json();
    displayProjects(repos);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    projectsContainer.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
  }
}

// Display Repositories as Cards
function displayProjects(repos) {
  const projectCards = repos.map(repo => {
    const languagesUsed = document.createElement('div');
    fetchRepoLanguages(repo.languages_url, languagesUsed);

    return `
      <div class="project-card">
        <h3>${repo.name}</h3>
        <p>${repo.description || 'No description available.'}</p>
        <p><strong>Stars:</strong> ${repo.stargazers_count} | <strong>Forks:</strong> ${repo.forks_count}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
        <div class="languages-used">${languagesUsed.outerHTML}</div>
      </div>
    `;
  }).join('');
  projectsContainer.innerHTML = projectCards;
}

// Fetch Repository Languages
async function fetchRepoLanguages(url, container) {
  try {
    const response = await fetch(url);
    const languages = await response.json();
    container.innerHTML = Object.keys(languages)
      .map(language => `<span class="language-badge ${language}">${language}</span>`)
      .join('');
  } catch (error) {
    console.error('Error fetching repo languages:', error);
    container.innerHTML = '<p>Failed to load languages.</p>';
  }
}

// Embed GitHub Contribution Graph
function loadContributionGraph() {
  const graphHTML = `
    <img 
      src="https://ghchart.rshah.org/${GITHUB_USERNAME}" 
      alt="${GITHUB_USERNAME}'s Contribution Graph" 
      style="width: 100%; max-width: 800px; margin-top: 16px;"
    />
    <a href="${CONTRIBUTIONS_URL}" target="_blank">View detailed contributions on GitHub</a>
  `;
  contributionGraph.innerHTML = graphHTML;
}

// Initialize the Page
function initializePortfolio() {
  fetchGitHubRepos();
  loadContributionGraph();
}

// Run Initialization on Page Load
document.addEventListener('DOMContentLoaded', initializePortfolio);
