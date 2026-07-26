import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Submit from './pages/Submit';
import Dashboard from './pages/Dashboard';
import Wall from './pages/Wall';
import Embed from './pages/Embed';

function Layout() {
  const location = useLocation();
  const isEmbedPage = location.pathname === '/embed';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isEmbedPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Submit />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/embed" element={<Embed />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;