import { Link } from 'react-router-dom'

function Header() {
  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link>
        <Link to="/guides" style={{ textDecoration: 'none', color: '#333' }}>Guides</Link>
        <Link to="/history" style={{ textDecoration: 'none', color: '#333' }}>History</Link>
        <Link to="/organizations" style={{ textDecoration: 'none', color: '#333' }}>Organizations</Link>
        <Link to="/resources" style={{ textDecoration: 'none', color: '#333' }}>Resources</Link>
      </nav>
    </header>
  )
}

export default Header