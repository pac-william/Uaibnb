import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useFavorites } from '../contexts/FavoritesContext';

const HeaderContainer = styled.header`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: #319795;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #2c7a7b;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? '#319795' : '#4a5568'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '600' : '500'};
  padding: 0.5rem 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #319795;
    transform: scaleX(${props => props.$active ? 1 : 0});
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #319795;
    
    &:after {
      transform: scaleX(1);
    }
  }
`;

const AdminNav = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: -1rem;
    height: 24px;
    width: 1px;
    background: #e2e8f0;
  }
`;

const FavoriteBadge = styled.span<{ $hasItems: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${props => props.$hasItems ? '#e53e3e' : 'inherit'};
  
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const Header = () => {
  const location = useLocation();
  const { favorites } = useFavorites();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/characteristics');

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <span role="img" aria-label="house">🏠</span>
          Uaibnb
        </Logo>
        <Nav>
          <NavLink to="/" $active={location.pathname === '/'}>
            Início
          </NavLink>
          <NavLink to="/favorites" $active={location.pathname === '/favorites'}>
            <FavoriteBadge $hasItems={favorites.length > 0}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Favoritos{favorites.length > 0 && ` (${favorites.length})`}
            </FavoriteBadge>
          </NavLink>
          {isAdminRoute && (
            <AdminNav>
              <NavLink to="/admin" $active={location.pathname === '/admin'}>
                Locações
              </NavLink>
              <NavLink to="/characteristics" $active={location.pathname === '/characteristics'}>
                Características
              </NavLink>
            </AdminNav>
          )}
          {!isAdminRoute && (
            <NavLink to="/admin">
              Área Administrativa
            </NavLink>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 