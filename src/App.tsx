import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Routes from './routes';
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
    <ToastProvider>
      <FavoritesProvider>
        <Router>
          <GlobalStyle />
          <Routes />
        </Router>
      </FavoritesProvider>
    </ToastProvider>
  );
}

export default App; 