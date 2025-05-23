import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LocationDetail from './pages/LocationDetail';
import Admin from './pages/Admin';
import Characteristics from './pages/Characteristics';
import Favorites from './pages/Favorites';
import Header from './components/Header';

const AppRoutes = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location/:id" element={<LocationDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/characteristics" element={<Characteristics />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
};

export default AppRoutes; 