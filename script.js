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
let wordIndex = 0;
let isDeleting = false;

// Generate Random Color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Apply Colors to Each Word
function getColorfulText(phrase) {
  const words = phrase.split(' ');
  return words.map(word => `<span style="color: ${getRandomColor()}">${word}</span>`).join(' ');
}

// Typewriter Effect Logic
function typeWriter() {
  const currentPhrase = typewriterPhrases[currentPhraseIndex];
  const partialPhrase = currentPhrase.split(' ').slice(0, wordIndex + 1).join(' ');

  typewriterText.innerHTML = getColorfulText(partialPhrase);

  if (!isDeleting && wordIndex < currentPhrase.split(' ').length) {
    wordIndex++;
    setTimeout(typeWriter, 300); // Typing speed
  } else if (isDeleting && wordIndex > 0) {
    wordIndex--;
    setTimeout(typeWriter, 150); // Deleting speed
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


const githubUsername = "ShadBalti";
// Fetch GitHub profile picture
async function fetchProfilePic() {
  const profilePic = document.getElementById("profile-pic");

  try {
    const response = await fetch(`https://api.github.com/users/${githubUsername}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    profilePic.src = data.avatar_url;
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    // Set a fallback image if the fetch fails
    profilePic.src = "https://via.placeholder.com/200"; // Fallback image
  }
}

// Call the function when the page loads
window.onload = fetchProfilePic;