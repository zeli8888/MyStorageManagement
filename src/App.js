import './App.css';
import FoodStorageComponent from './component/FoodStorageComponent';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/food" element={<FoodStorageComponent />} />
        </Routes>
      </Router>
    </div>
  );
}

function Home() {
  return (
    <div className='container'>
      <h1>Home</h1>
      <p>
        <Link to="/food">Food Storage Management</Link>
      </p>
    </div>
  );
}

export default App;
