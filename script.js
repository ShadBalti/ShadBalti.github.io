// DOM Elements
const typewriterText = document.getElementById('typewriter-text');

// Typewriter Effect Variables
const typewriterPhrases = [
  "I'm Dilshad Hussain.",
  "Web Developer and Designer.",
  "Open-Source Enthusiast.",
  "Passionate about JavaScript."
];
let currentPhraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

// Typewriter Effect Logic
function typeWriter() {
  const currentPhrase = typewriterPhrases[currentPhraseIndex];
  const displayText = currentPhrase.slice(0, letterIndex);

  typewriterText.textContent = displayText;

  if (!isDeleting && letterIndex < currentPhrase.length) {
    letterIndex++;
    setTimeout(typeWriter, 100); // Typing speed
  } else if (isDeleting && letterIndex > 0) {
    letterIndex--;
    setTimeout(typeWriter, 50); // Deleting speed
  } else {
    isDeleting = !isDeleting;

    if (!isDeleting) {
      currentPhraseIndex = (currentPhraseIndex + 1) % typewriterPhrases.length;
    }

    setTimeout(typeWriter, 1000); // Pause between phrases
  }
}

// Initialize Portfolio Features
function initializePortfolio() {
  typeWriter(); // Start typewriter effect
  fetchGitHubRepos(); // Fetch GitHub repos
  loadContributionGraph(); // Load GitHub contribution graph
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
  const repoList = document.getElementById('repo-list');
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

// Run Initialization on Page Load
document.addEventListener('DOMContentLoaded', initializePortfolio);
