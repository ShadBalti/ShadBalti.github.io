// DOM Elements
const typewriterText = document.getElementById('typewriter-text');
const repoList = document.getElementById('repo-list');

// Typewriter Effect
const typewriterPhrases = [
  "I'm Dilshad Hussain.",
  "Web Developer and Designer.",
  "Open-Source Enthusiast.",
  "Passionate about JavaScript."
];
let currentPhraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function typeWriter() {
  const currentPhrase = typewriterPhrases[currentPhraseIndex];
  const currentText = isDeleting
    ? currentPhrase.substring(0, letterIndex--)
    : currentPhrase.substring(0, letterIndex++);

  typewriterText.textContent = currentText;

  if (!isDeleting && letterIndex === currentPhrase.length) {
    setTimeout(() => (isDeleting = true), 1000); // Pause before deleting
  } else if (isDeleting && letterIndex === 0) {
    isDeleting = false;
    currentPhraseIndex = (currentPhraseIndex + 1) % typewriterPhrases.length;
  }

  setTimeout(typeWriter, isDeleting ? 50 : 100); // Adjust speed
}

// Fetch GitHub Repositories
async function fetchGitHubRepos() {
  try {
    const response = await fetch('https://api.github.com/users/ShadBalti/repos');
    if (!response.ok) throw new Error('Failed to fetch repositories.');

    const repos = await response.json();
    displayRepos(repos);
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
  }
}

// Display Repositories
function displayRepos(repos) {
  repoList.innerHTML = ''; // Clear previous content
  repos.forEach(repo => {
    const repoItem = document.createElement('li');
    repoItem.className = 'repo-item';
    repoItem.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <p>${repo.description || 'No description provided.'}</p>
      <span class="language ${repo.language ? repo.language.toLowerCase() : 'unknown'}">
        ${repo.language || 'Unknown'}
      </span>
    `;
    repoList.appendChild(repoItem);
  });
}

// Load GitHub Contributions Graph
function loadContributionGraph() {
  const graphContainer = document.getElementById('contribution-graph');
  graphContainer.innerHTML = `
    <img src="https://ghchart.rshah.org/ShadBalti" alt="GitHub Contribution Graph">
  `;
}

// Initialize Portfolio on Page Load
function initializePortfolio() {
  typeWriter(); // Start typewriter effect
  fetchGitHubRepos(); // Fetch and display GitHub repos
  loadContributionGraph(); // Load contribution graph
}

// Run Initialization
document.addEventListener('DOMContentLoaded', initializePortfolio);
