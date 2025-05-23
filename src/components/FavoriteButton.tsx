import React from 'react';
import styled from 'styled-components';
import { useFavorites } from '../contexts/FavoritesContext';
import { Location } from '../types';

interface FavoriteButtonProps {
  location: Location;
  size?: 'small' | 'medium' | 'large';
}

const Button = styled.button<{ size: string; isFavorite: boolean }>`
  background: ${({ isFavorite }) => isFavorite ? 'rgba(237, 100, 100, 0.9)' : 'rgba(255, 255, 255, 0.8)'};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  width: ${({ size }) => 
    size === 'small' ? '32px' : 
    size === 'large' ? '48px' : '40px'
  };
  height: ${({ size }) => 
    size === 'small' ? '32px' : 
    size === 'large' ? '48px' : '40px'
  };
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    background: ${({ isFavorite }) => isFavorite ? 'rgba(224, 36, 94, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  }
  
  svg {
    width: ${({ size }) => 
      size === 'small' ? '16px' : 
      size === 'large' ? '24px' : '20px'
    };
    height: ${({ size }) => 
      size === 'small' ? '16px' : 
      size === 'large' ? '24px' : '20px'
    };
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
`;

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ location, size = 'medium' }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(location.id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o evento clique propague para o card
    
    if (favorited) {
      removeFavorite(location.id);
    } else {
      addFavorite(location);
    }
  };
  
  return (
    <Button 
      onClick={handleClick} 
      size={size} 
      isFavorite={favorited}
      aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <svg 
        fill={favorited ? 'white' : '#e53e3e'} 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {favorited ? (
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        ) : (
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        )}
      </svg>
    </Button>
  );
};

export default FavoriteButton; 