// Blog configuration
const POSTS_PER_PAGE = 10;
const GITHUB_USERNAME = 'shivamnox';
const POSTS_DIR = '../posts';

// Global state
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let allLabels = new Set();

// Parse markdown frontmatter - IMPROVED VERSION
function parseFrontmatter(content) {
    // Remove any BOM or leading whitespace
    content = content.trim();
    
    // Check if content starts with ---
    if (!content.startsWith('---')) {
        console.log('No frontmatter found, using defaults');
        return { 
            metadata: {
                title: 'Untitled Post',
                author: GITHUB_USERNAME,
                date: new Date().toISOString().split('T')[0],
                labels: []
            }, 
            content: content 
        };
    }
    
    // Find the closing ---
    const lines = content.split('\n');
    let endIndex = -1;
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
            endIndex = i;
            break;
        }
    }
    
    if (endIndex === -1) {
        console.log('Frontmatter not closed properly');
        return { 
            metadata: {
                title: 'Untitled Post',
                author: GITHUB_USERNAME,
                date: new Date().toISOString().split('T')[0],
                labels: []
            }, 
            content: content 
        };
    }
    
    // Extract frontmatter and content
    const frontmatterLines = lines.slice(1, endIndex);
    const markdownContent = lines.slice(endIndex + 1).join('\n').trim();
    
    // Parse frontmatter
    const metadata = {
        author: GITHUB_USERNAME,
        date: new Date().toISOString().split('T')[0],
        labels: []
    };
    
    frontmatterLines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            
            if (key && value) {
                if (key === 'labels') {
                    metadata[key] = value.split(',').map(l => l.trim()).filter(l => l);
                } else {
                    metadata[key] = value.replace(/^["']|["']$/g, '');
                }
            }
        }
    });
    
    console.log('Parsed metadata:', metadata);
    return { metadata, content: markdownContent };
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    return html;
}

// Fetch posts index
async function fetchPostsIndex() {
    try {
        const response = await fetch(`${POSTS_DIR}/index.json`);
        if (!response.ok) {
            throw new Error('Posts index not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts index:', error);
        return [];
    }
}

// Load all posts
async function loadPosts() {
    const postsIndex = await fetchPostsIndex();
    
    if (postsIndex.length === 0) {
        document.getElementById('blogPosts').innerHTML = '<div class="no-posts">No posts found. Create posts/index.json to get started!</div>';
        return;
    }
    
    const postsPromises = postsIndex.map(async (postFile) => {
        try {
            const response = await fetch(`${POSTS_DIR}/${postFile}`);
            const content = await response.text();
            const { metadata, content: markdown } = parseFrontmatter(content);
            
            // Extract excerpt (first 150 chars of content)
            const plainText = markdown.replace(/[#*`[\]()]/g, '').trim();
            const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
            
            // Add labels to set
            if (metadata.labels) {
                metadata.labels.forEach(label => allLabels.add(label));
            }
            
            return {
                filename: postFile.replace('.md', ''),
                title: metadata.title || 'Untitled',
                author: metadata.author || GITHUB_USERNAME,
                date: metadata.date || new Date().toISOString(),
                image: metadata.image || '',
                labels: metadata.labels || [],
                excerpt: excerpt,
                content: markdown
            };
        } catch (error) {
            console.error(`Error loading post ${postFile}:`, error);
            return null;
        }
    });
    
    allPosts = (await Promise.all(postsPromises)).filter(post => post !== null);
    
    // Sort by date (newest first)
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Initialize filters
    populateLabelFilter();
    
    // Display posts
    filteredPosts = [...allPosts];
    renderPosts();
}

// Populate label filter
function populateLabelFilter() {
    const labelFilter = document.getElementById('labelFilter');
    allLabels.forEach(label => {
        const option = document.createElement('option');
        option.value = label;
        option.textContent = label;
        labelFilter.appendChild(option);
    });
}

// Render posts for current page
function renderPosts() {
    const blogPostsContainer = document.getElementById('blogPosts');
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);
    
    if (postsToShow.length === 0) {
        blogPostsContainer.innerHTML = '<div class="no-posts">No posts match your search criteria.</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    blogPostsContainer.innerHTML = postsToShow.map(post => {
        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <div class="post-card" onclick="window.location.href='post.html?slug=${post.filename}'">
                <div class="post-image">
                    ${post.image ? `<img src="${post.image}" alt="${post.title}" onerror="this.style.display='none'">` : ''}
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-author">
                            <i class="fab fa-github"></i>
                            ${post.author}
                        </span>
                        <span class="post-date">
                            <i class="far fa-calendar"></i>
                            ${formattedDate}
                        </span>
                    </div>
                    <h3>${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-labels">
                        ${post.labels.map(label => `<span class="label">${label}</span>`).join('')}
                    </div>
                    <a href="post.html?slug=${post.filename}" class="read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }).join('');
    
    renderPagination();
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginationContainer = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
        <span class="page-number">Page ${currentPage} of ${totalPages}</span>
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filter posts
function filterPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedLabel = document.getElementById('labelFilter').value;
    
    filteredPosts = allPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                            post.excerpt.toLowerCase().includes(searchTerm);
        const matchesLabel = !selectedLabel || post.labels.includes(selectedLabel);
        
        return matchesSearch && matchesLabel;
    });
    
    currentPage = 1;
    renderPosts();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    
    document.getElementById('searchInput').addEventListener('input', filterPosts);
    document.getElementById('labelFilter').addEventListener('change', filterPosts);
});

// Make changePage available globally
window.changePage = changePage;
