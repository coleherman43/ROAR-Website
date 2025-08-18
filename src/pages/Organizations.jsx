import { useState, useEffect } from 'react';
import { loadOrganizations } from '../utils/contentLoader';

function Organizations() {
  const [organizationsContent, setOrganizationsContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const content = await loadOrganizations();
        setOrganizationsContent(content);
      } catch (error) {
        console.error('Failed to load organizations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrganizations();
  }, []);

  if (loading) {
    return <div className="loading">Loading organizations...</div>;
  }

  if (!organizationsContent?.currentOrgs) {
    return <div className="error">Failed to load organizations content.</div>;
  }

  return (
    <div className="organizations-page">
      <header className="page-header">
        <h1>Partner Organizations</h1>
        <p>Meet the organizations that make up the ROAR coalition</p>
      </header>

      <article className="organizations-content">
        <div 
          className="prose"
          dangerouslySetInnerHTML={{ __html: organizationsContent.currentOrgs.content }} 
        />
      </article>
    </div>
  );
}

export default Organizations;