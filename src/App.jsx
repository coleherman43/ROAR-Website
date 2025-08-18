import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import History from './pages/History'
import OrganizingGuides from './pages/OrganizingGuides'
import Organizations from './pages/Organizations'  // Add this
import Resources from './pages/Resources'          // Add this
import './styles/content.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/guides" element={<OrganizingGuides />} />
            <Route path="/organizations" element={<Organizations />} />  {/* Add this */}
            <Route path="/resources" element={<Resources />} />          {/* Add this */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App