// Configuration
const GITHUB_USERNAME = 'shivamnox';
const POSTS_DIR = '../posts';

// Get post slug from URL
function getPostSlug() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('slug');
}

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

// Enhanced markdown to HTML converter
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Code blocks (must be first)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
        if (para.match(/^<(h[1-3]|ul|ol|pre|blockquote)/)) {
            return para;
        }
        return `<p>${para}</p>`;
    }).join('\n');
    
    return html;
}

// Escape HTML for code blocks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Fetch all posts for related posts
async function fetchAllPosts() {
    try {
        const response = await fetch(`${POSTS_DIR}/index.json`);
        if (!response.ok) {
            throw new Error('Posts index not found');
        }
        const postsIndex = await response.json();
        
        const postsPromises = postsIndex.map(async (postFile) => {
            try {
                const response = await fetch(`${POSTS_DIR}/${postFile}`);
                const content = await response.text();
                const { metadata } = parseFrontmatter(content);
                
                return {
                    filename: postFile.replace('.md', ''),
                    title: metadata.title || 'Untitled',
                    date: metadata.date || new Date().toISOString(),
                    labels: metadata.labels || []
                };
            } catch (error) {
                return null;
            }
        });
        
        return (await Promise.all(postsPromises)).filter(post => post !== null);
    } catch (error) {
        console.error('Error fetching all posts:', error);
        return [];
    }
}

// Find related posts based on labels
function findRelatedPosts(currentPostLabels, currentSlug, allPosts) {
    if (!currentPostLabels || currentPostLabels.length === 0) {
        return [];
    }
    
    const relatedPosts = allPosts
        .filter(post => post.filename !== currentSlug)
        .map(post => {
            const commonLabels = post.labels.filter(label => 
                currentPostLabels.includes(label)
            );
            return {
                ...post,
                relevance: commonLabels.length
            };
        })
        .filter(post => post.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 3);
    
    return relatedPosts;
}

// Render related posts
function renderRelatedPosts(relatedPosts) {
    const relatedContainer = document.getElementById('relatedPosts');
    
    if (relatedPosts.length === 0) {
        relatedContainer.innerHTML = '<div class="no-related">No related posts found.</div>';
        return;
    }
    
    relatedContainer.innerHTML = relatedPosts.map(post => {
        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="related-post-card" onclick="window.location.href='post.html?slug=${post.filename}'">
                <h4>${post.title}</h4>
                <div class="related-date">
                    <i class="far fa-calendar"></i>
                    ${formattedDate}
                </div>
            </div>
        `;
    }).join('');
}

// Load and display post
async function loadPost() {
    const slug = getPostSlug();
    
    if (!slug) {
        document.querySelector('.loading').innerHTML = '<p>Post not found.</p>';
        return;
    }
    
    try {
        // Fetch post content
        const response = await fetch(`${POSTS_DIR}/${slug}.md`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const content = await response.text();
        const { metadata, content: markdown } = parseFrontmatter(content);
        
        // Update page title
        document.getElementById('pageTitle').textContent = `${metadata.title || 'Post'} - Shivam Kumar`;
        
        // Display post
        document.querySelector('.loading').style.display = 'none';
        document.getElementById('postContent').style.display = 'block';
        
        // Set title
        document.getElementById('postTitle').textContent = metadata.title || 'Untitled Post';
        
        // Set author
        document.getElementById('postAuthor').textContent = metadata.author || GITHUB_USERNAME;
        
        // Set date
        const formattedDate = new Date(metadata.date || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('postDate').textContent = formattedDate;
        
        // Set featured image
        if (metadata.image) {
            document.getElementById('postImage').innerHTML = `<img src="${metadata.image}" alt="${metadata.title}">`;
        }
        
        // Set post body
        const htmlContent = markdownToHtml(markdown);
        document.getElementById('postBody').innerHTML = htmlContent;
        
        // Highlight code blocks
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
        
        // Set labels
        const labelsContainer = document.getElementById('postLabels');
        if (metadata.labels && metadata.labels.length > 0) {
            labelsContainer.innerHTML = metadata.labels.map(label => 
                `<span class="label" onclick="window.location.href='index.html?label=${encodeURIComponent(label)}'">${label}</span>`
            ).join('');
        } else {
            document.querySelector('.post-labels-section').style.display = 'none';
        }
        
        // Load and display related posts
        const allPosts = await fetchAllPosts();
        const relatedPosts = findRelatedPosts(metadata.labels, slug, allPosts);
        renderRelatedPosts(relatedPosts);
        
    } catch (error) {
        console.error('Error loading post:', error);
        document.querySelector('.loading').innerHTML = '<p>Error loading post. Please try again.</p>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', loadPost);
