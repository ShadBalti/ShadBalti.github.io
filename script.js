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
  return words.map(word => `<span style="color: ${getRandomColor()}" class="typewritertext">${word}</span>`).join(' ');
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
  fetchProjects(); // Fetch GitHub repos
  loadContributionGraph(); // Load GitHub contribution graph
}

// Fetch GitHub repositories
async function fetchProjects() {
  const projectsContainer = document.getElementById("projects-container");

  try {
    const response = await fetch(`https://api.github.com/users/ShadBalti/repos`);
    if (!response.ok) throw new Error("Failed to fetch repositories");

    const projects = await response.json();
    projects.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project-card");

      projectElement.innerHTML = `
        <div class="project-header">
          <img src="${project.owner.avatar_url}" alt="${project.owner.login}" class="avatar" />
          <h3>${project.name}</h3>
        </div>
        <p>${project.description || "No description available."}</p>
        <p><strong>Language:</strong> ${project.language || "N/A"}</p>
        <p><strong>Stars:</strong> ${project.stargazers_count} ⭐</p>
        <p><strong>Forks:</strong> ${project.forks_count} 🍴</p>
        <p><strong>Watchers:</strong> ${project.watchers_count}</p>
        <p><strong>License:</strong> ${project.license?.name || "No License"}</p>
        <p><strong>Last Updated:</strong> ${new Date(project.updated_at).toLocaleDateString()}</p>
        <a href="${project.html_url}" target="_blank">View Project</a>
      `;
      projectsContainer.appendChild(projectElement);
    });
  } catch (error) {
    console.error("Error:", error);
    projectsContainer.innerHTML = `<p>Unable to load projects. ${error.message}</p>`;
  }
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

