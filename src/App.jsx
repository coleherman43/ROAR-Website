import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import History from './pages/History'
import OrganizingGuides from './pages/OrganizingGuides'
import Organizations from './pages/Organizations'
import Resources from './pages/Resources'
import CampusMapPage from './pages/CampusMap'
import './styles/content.css'
import './styles/map.css'

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
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/map" element={<CampusMapPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App