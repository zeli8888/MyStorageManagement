import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>
        <Link to="/about">Go to About</Link>
      </p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>About</h1>
      <p>This is the about page.</p>
    </div>
  );
}
export default App;
