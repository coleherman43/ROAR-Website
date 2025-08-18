// src/pages/History.jsx
import { useState, useEffect } from 'react';
import { loadHistory } from '../utils/contentLoader';

function History() {
  const [historyContent, setHistoryContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const content = await loadHistory();
        setHistoryContent(content);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="loading">Loading history...</div>;
  }

  if (!historyContent?.timeline) {
    return <div className="error">Failed to load history content.</div>;
  }

  return (
    <div className="history-page">
      <header className="page-header">
        <h1>History of Campus Organizing</h1>
        <p>The legacy of student activism at the University of Oregon</p>
      </header>

      <article className="history-content">
        <div 
          className="prose"
          dangerouslySetInnerHTML={{ __html: historyContent.timeline.content }} 
        />
      </article>
    </div>
  );
}

export default History;