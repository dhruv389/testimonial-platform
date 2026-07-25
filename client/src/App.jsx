import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Submit from './pages/Submit';
import Dashboard from './pages/Dashboard';
import Wall from './pages/Wall';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Submit />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wall" element={<Wall />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;