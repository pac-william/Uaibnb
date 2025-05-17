import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

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

const Header = () => {
  const location = useLocation();
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