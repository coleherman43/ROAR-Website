import { marked } from 'marked';

// Configure marked for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Simple frontmatter parser (browser-compatible alternative to gray-matter)
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: content };
  }
  
  const frontmatterText = match[1];
  const markdownContent = match[2];
  
  // Simple YAML parser for frontmatter
  const data = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
      }
      
      // Handle booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      data[key] = value;
    }
  });
  
  return { data, content: markdownContent };
}

/**
 * Load and parse a single markdown file
 * @param {string} filepath - Path to markdown file (e.g., '/content/guides/event-planning.md')
 * @returns {Object} - Parsed content with frontmatter and HTML
 */
export async function loadMarkdownFile(filepath) {
  try {
    // Add base URL to the filepath
    const url = `${import.meta.env.BASE_URL}${filepath.startsWith('/') ? filepath.slice(1) : filepath}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${filepath}: ${response.status}`);
    }
    
    const rawContent = await response.text();
    const { data, content } = parseFrontmatter(rawContent);
    
    return {
      ...data,
      content: marked(content),
      slug: filepath.split('/').pop().replace('.md', ''),
      rawContent: content
    };
  } catch (error) {
    console.error('Error loading markdown file:', error);
    return null;
  }
}

/**
 * Load all files from a content directory
 * @param {string} directory - Directory name (e.g., 'guides', 'history')
 * @param {Array} filenames - Array of filename strings without .md extension
 * @returns {Array} - Array of parsed content objects
 */
export async function loadContentDirectory(directory, filenames) {
  const promises = filenames.map(filename => 
    loadMarkdownFile(`content/${directory}/${filename}.md`) // Remove leading slash since loadMarkdownFile handles it
  );
  
  const results = await Promise.all(promises);
  return results.filter(item => item !== null); // Filter out failed loads
}

/**
 * Load organizing guides dynamically using Vite's glob import
 * This automatically discovers all .md files in the guides directory at build time
 * @returns {Array} - Array of guide objects
 */
export async function loadGuides() {
  try {
    // Vite automatically discovers all .md files in the guides directory
    const guideModules = import.meta.glob('/public/content/guides/*.md', { 
      as: 'raw'
    });
    
    const guides = [];
    
    // Load each discovered guide file
    for (const [path, moduleLoader] of Object.entries(guideModules)) {
      try {
        const rawContent = await moduleLoader();
        const { data, content } = parseFrontmatter(rawContent);
        
        // Extract filename for slug
        const filename = path.split('/').pop().replace('.md', '');
        
        guides.push({
          ...data,
          content: marked(content),
          slug: filename,
          rawContent: content
        });
      } catch (error) {
        console.error(`Error loading guide: ${path}`, error);
        // Skip this file and continue with others
      }
    }
    
    console.log(`Dynamically loaded ${guides.length} guides`);
    
    // Sort by featured first, then by date
    return guides.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date || 0) - new Date(a.date || 0);
    });
    
  } catch (error) {
    console.error('Error loading guides dynamically:', error);
    return [];
  }
}

/**
 * Search guides by title, content, or tags
 * @param {Array} guides - Array of guide objects
 * @param {string} query - Search query
 * @returns {Array} - Filtered guides
 */
export function searchGuides(guides, query) {
  if (!query.trim()) return guides;
  
  const searchTerm = query.toLowerCase();
  
  return guides.filter(guide => {
    const titleMatch = guide.title?.toLowerCase().includes(searchTerm);
    const contentMatch = guide.rawContent?.toLowerCase().includes(searchTerm);
    const tagMatch = guide.tags?.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    );
    const categoryMatch = guide.category?.toLowerCase().includes(searchTerm);
    
    return titleMatch || contentMatch || tagMatch || categoryMatch;
  });
}

/**
 * Filter guides by category
 * @param {Array} guides - Array of guide objects
 * @param {string} category - Category to filter by
 * @returns {Array} - Filtered guides
 */
export function filterGuidesByCategory(guides, category) {
  if (!category || category === 'all') return guides;
  return guides.filter(guide => guide.category === category);
}

/**
 * Get all unique categories from guides
 * @param {Array} guides - Array of guide objects
 * @returns {Array} - Array of unique category strings
 */
export function getGuideCategories(guides) {
  const categories = guides.map(guide => guide.category).filter(Boolean);
  return [...new Set(categories)];
}

/**
 * Load history content
 * @returns {Object} - History content object
 */
export async function loadHistory() {
  const timeline = await loadMarkdownFile('content/history/timeline.md'); // Remove leading slash
  return { timeline };
}

/**
 * Load organizations content  
 * @returns {Object} - Organizations content object
 */
export async function loadOrganizations() {
  const currentOrgs = await loadMarkdownFile('content/organizations/current-orgs.md'); // Remove leading slash
  return { currentOrgs };
}