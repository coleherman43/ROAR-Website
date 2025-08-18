import { useState, useEffect } from 'react';

function Resources() {
  const [resourcesContent, setResourcesContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        // For now, let's create a simple static version
        // Later you can add loadResources() to contentLoader.js
        setResourcesContent({
          title: "External Resources",
          content: `
            <h2>Organizing Resources</h2>
            <ul>
              <li><a href="https://ctb.ku.edu/en">Community Tool Box</a> - Comprehensive organizing guide</li>
              <li><a href="https://www.trainingforchange.org/">Training for Change</a> - Workshops and resources</li>
              <li><a href="https://beautifultrouble.org/">Beautiful Trouble</a> - Creative activism tactics</li>
            </ul>
            
            <h2>Legal Resources</h2>
            <ul>
              <li><a href="https://www.nlg.org/">National Lawyers Guild</a> - Legal support for activists</li>
              <li><a href="https://www.aclu-or.org/">ACLU Oregon</a> - Know your rights</li>
            </ul>
            
            <h2>Campus Resources</h2>
            <ul>
              <li><a href="https://studentlife.uoregon.edu/">Student Life</a> - UO student organizations</li>
              <li><a href="https://emu.uoregon.edu/">EMU</a> - Event spaces and services</li>
            </ul>
          `
        });
      } catch (error) {
        console.error('Failed to load resources:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchResources();
  }, []);

  if (loading) {
    return <div className="loading">Loading resources...</div>;
  }

  return (
    <div className="resources-page">
      <header className="page-header">
        <h1>Resources</h1>
        <p>Helpful links and tools for organizers</p>
      </header>

      <article className="resources-content">
        <div 
          className="prose"
          dangerouslySetInnerHTML={{ __html: resourcesContent.content }} 
        />
      </article>
    </div>
  );
}

export default Resources;