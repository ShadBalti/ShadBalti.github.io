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

const projectsContainer = document.getElementById("projects-container");

// Function to fetch languages for a specific repository
async function fetchLanguages(repoName) {
  const response = await fetch(`https://api.github.com/repos/ShadBalti/${repoName}/languages`);
  if (!response.ok) throw new Error(`Failed to fetch languages for ${repoName}`);
  return await response.json();
}

async function fetchProjects() {
  try {
    const response = await fetch(`https://api.github.com/users/ShadBalti/repos`);
    if (!response.ok) throw new Error("Failed to fetch repositories");

    const projects = await response.json();
    projectsContainer.innerHTML = ""; // Clear previous projects

    // Iterate over each project and display its data
    for (const project of projects) {
     if(project.fork === true){
      const languages = await fetchLanguages(project.name);
      const languagesList = Object.keys(languages).join(", ") || "No languages found";

      const projectElement = document.createElement("div");
      projectElement.classList.add("project-card");

      projectElement.innerHTML = `
        <div class="project-header">
          <img src="${project.owner.avatar_url}" alt="${project.owner.login}" class="avatar" />
          <h3>${project.name}</h3>
        </div>
        <p>${project.description || "No description available."}</p>
        <div class="project-details">
          <div class="detail-item">
            <i class="fas fa-code"></i>
            <span><strong>Languages:</strong> ${languagesList}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-star"></i>
            <span><strong>Stars:</strong> ${project.stargazers_count} ⭐</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-code-branch"></i>
            <span><strong>Forks:</strong> ${project.forks_count} 🍴</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-eye"></i>
            <span><strong>Watchers:</strong> ${project.watchers_count}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-file-alt"></i>
            <span><strong>License:</strong> ${project.license?.name || "No License"}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-calendar-alt"></i>
            <span><strong>Last Updated:</strong> ${new Date(project.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
        <a href="${project.html_url}" target="_blank" class="view-project">View Project</a>
      `;

      projectsContainer.appendChild(projectElement);
     }
    }
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

const blogsContainer = document.getElementById("blogs-container");

async function fetchHashnodePosts(username) {
  const query = `
    query {
      publication(host: "${username}.hashnode.dev/") {
        isTeam
        title
        posts(first: 10) {
          edges {
            node {
              title
              brief
              url
              coverImage
              dateAdded
              totalReactions
              readingTime
              responseCount
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.hashnode.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error('Failed to fetch blogs');

    const result = await response.json();
    console.log("API Result:", result);  // Log the full response for debugging

    // Check if publication exists
    if (!result.data.publication) {
      blogsContainer.innerHTML = `<p>Publication not found for user: ${username}.</p>`;
      return;
    }

    const posts = result.data.publication.posts.edges;

    // Check if posts are available
    if (posts.length === 0) {
      blogsContainer.innerHTML = `<p>No blog posts found.</p>`;
      return;
    }

    posts.forEach(({ node }) => {
      const postElement = document.createElement('div');
      postElement.classList.add('blog-card');

      postElement.innerHTML = `
        <img src="${node.coverImage || 'default-image.jpg'}" alt="${node.title}" class="cover-image" />
        <div class="blog-content">
          <h3>${node.title}</h3>
          <p>${node.brief || "No brief available."}</p>
          <div class="blog-details">
            <span class="badge reactions">❤️ ${node.totalReactions} Reactions</span>
            <span class="badge comments">💬 ${node.responseCount} Comments</span>
            <span class="badge reading-time">⏳ ${node.readingTime} min read</span>
            <span class="badge date">📅 ${new Date(node.dateAdded).toLocaleDateString()}</span>
          </div>
          <a href="${node.url}" target="_blank" class="read-more">Read More</a>
        </div>
      `;

      blogsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error:', error);
    blogsContainer.innerHTML = `<p>Unable to load blogs. ${error.message}</p>`;
  }
}


fetchHashnodePosts('shadbalti');

// Run Initialization on Page Load
document.addEventListener('DOMContentLoaded', initializePortfolio);