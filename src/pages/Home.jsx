import { useState, useEffect } from 'react';
import { marked } from 'marked';

function Home() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch('/data/home-content.md');
        const text = await response.text();
        setContent(marked(text));
        setLoading(false);
      } catch (error) {
        console.error('Failed to load home content', error);
        setContent('<h1>ROAR Center</h1><p>Welcome to the Radical Organizing and Activist Resource Center</p>');
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-content">
      <div dangerouslySetInnerHTML={{ __html: content}} />
    </div>
  );
}

export default Home