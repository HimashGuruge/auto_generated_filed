import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Toolbar'; // හරි file name එක check කරන්න
import AdminDashboard from './components/adminDashboard';
import Registor from './components/Registor';
import HomePage from './components/Home';



function App() {
  return (
    <Router>
      <Navbar />
   
        <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/register" element={< Registor/>} />
        
         
        </Routes>
    
    </Router>
  );
}

export default App;
