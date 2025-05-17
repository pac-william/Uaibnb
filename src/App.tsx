import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LocationDetail from './pages/LocationDetail';
import Admin from './pages/Admin';
import Characteristics from './pages/Characteristics';
import Header from './components/Header';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f7fafc;
    color: #2d3748;
    min-height: 100vh;
  }

  button {
    cursor: pointer;
  }

  input, textarea {
    font-family: inherit;
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:id" element={<LocationDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/characteristics" element={<Characteristics />} />
      </Routes>
    </Router>
  );
}

export default App; 