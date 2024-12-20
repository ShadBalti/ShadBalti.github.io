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
}

const projectsContainer = document.getElementById("projects-container");
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const closeModalButton = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');


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
      if (project.fork === false && project.description != "") {
        const languages = await fetchLanguages(project.name);
        const languagesList = Object.keys(languages).join(", ") || "No languages found";

        const projectElement = document.createElement("div");
        projectElement.classList.add("project-card");

        projectElement.innerHTML = `
        <div class="project-header">
          <img src="${project.owner.avatar_url}" alt="${project.owner.login}" class="avatar" />
          <h3>${project.name}</h3>
          <button class="show-commit-button" data-project="${project.name}">Show Commits</button>

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
         <div class="project-links">
    <a href="${project.html_url}" target="_blank" class="view-project">View Project</a>
    ${project.homepage 
      ? `<a href="${project.homepage}" target="_blank" class="view-demo">Live Demo</a>` 
      : `<span class="no-demo">No Live Demo Available</span>`}
  </div>
      `;

        projectsContainer.appendChild(projectElement);
        // Add event listener to "Show Commits" button
        const showCommitButton = projectElement.querySelector(".show-commit-button");
        showCommitButton.addEventListener("click", () => showCommits(project.name));
      }
    }
  } catch (error) {
    console.error("Error:", error);https://github.com/ShadBalti/ShadBalti.github.io
    projectsContainer.innerHTML = `<p>Unable to load projects. ${error.message}</p>`;
  }
}

// Fetch and display recent commits
async function showCommits(projectName) {
  try {
    const response = await fetch(`https://api.github.com/repos/ShadBalti/${projectName}/commits`);
    if (!response.ok) throw new Error("Failed to fetch commits");

    const commits = await response.json();
    modalContent.innerHTML = ""; // Clear previous content

    commits.slice(0, 5).forEach(async (commit) => {
      const commitElement = document.createElement("div");
      commitElement.classList.add("commit-item");

      // Fetch commit details for files changed
      const commitDetailsResponse = await fetch(commit.url);
      const commitDetails = await commitDetailsResponse.json();

      // Create the commit element
      commitElement.innerHTML = `
        <div class="commit-header">
          <div class="commit-author-info">
            <img src="https://avatars.githubusercontent.com/${commit.author?.login || ''}" 
                 alt="Author Avatar" class="author-avatar" />
            <span class="author-name">${commit.commit.author.name}</span>
            <span class="commit-hash">(${commit.sha.slice(0, 7)})</span>
          </div>
          <div class="commit-date">${new Date(commit.commit.author.date).toLocaleString()}</div>
        </div>
        <p class="commit-message">${commit.commit.message}</p>
        <div class="files-changed">
          <strong>Files Changed:</strong>
          <ul>
            ${commitDetails.files.map(file => `
              <li>
                <span>${file.filename}</span>
                <span class="additions">+${file.additions}</span>
                <span class="deletions">-${file.deletions}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <p class="committer-name"><strong>Committer:</strong> ${commit.committer ? commit.committer.login : "N/A"}</p>
        <div class="commit-actions">
          <a href="${commit.html_url}" target="_blank" class="view-commit-link">
            <i class="fas fa-code-branch"></i> View on GitHub
          </a>
        </div>
      `;
      modalContent.appendChild(commitElement);
    });

    modal.style.display = 'block';
    overlay.style.display = 'block';
  } catch (error) {
    modalContent.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}
// Close the modal
function closeModal() {
  modal.style.display = 'none';
  overlay.style.display = 'none';
}

closeModalButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);



const blogsContainer = document.getElementById("blogs-container");

async function fetchDevToPosts(username) {
  const url = `https://dev.to/api/articles?username=${username}`;

  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch articles');

    const posts = await response.json();
    // Check if posts are available
    if (posts.length === 0) {
      blogsContainer.innerHTML = `<p>No articles found for user: ${username}.</p>`;
      return;
    }

    posts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.classList.add('blog-card');

      postElement.innerHTML = `
  <img src="${post.cover_image || 'default-image.jpg'}" alt="${post.title}" class="cover-image" />
  <div class="blog-content">
    <h3>${post.title}</h3>
    <p>${post.description || "No description available."}</p>
    <div class="blog-details">
      <span class="badge reactions">❤️ ${post.positive_reactions_count} Reactions</span>
      <span class="badge comments">💬 ${post.comments_count} Comments</span>
      <span class="badge reading-time">⏳ ${post.reading_time_minutes} min read</span>
      <span class="badge date">📅 ${new Date(post.published_at).toLocaleDateString()}</span>
    </div>
    <a href="${post.url}" target="_blank" class="read-more">
      Read more about "${post.title}"
    </a>
  </div>
`;

      blogsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error:', error);
    blogsContainer.innerHTML = `<p>Unable to load articles. ${error.message}</p>`;
  }
}

fetchDevToPosts('shadbalti');
// Run Initialization on Page Load
document.addEventListener('DOMContentLoaded', initializePortfolio);