import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PrescriptionAnalysis from './pages/PrescriptionAnalysis';
import OrganModels from './pages/OrganModels';
import MedicineScanner from './pages/MedicineScanner';
import About from './pages/About';
import Contact from './pages/Contact';
import UserHome from './pages/Userhome';
import SymptomAnalyzer from './pages/SymptomAnalyzer';
import './styles/main.scss';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prescription" element={<PrescriptionAnalysis />} />
          <Route path="/organs" element={<OrganModels />} />
          <Route path="/medicine" element={<MedicineScanner />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/userhome" element={<UserHome />} /> 
          <Route path="/symptoms" element={<SymptomAnalyzer />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;