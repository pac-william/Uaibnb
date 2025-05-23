import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Location } from '../types';

interface FavoritesContextType {
  favorites: Location[];
  addFavorite: (location: Location) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Location[]>([]);

  // Carregar favoritos do localStorage quando o componente montar
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (location: Location) => {
    setFavorites(prev => {
      // Verificar se já não existe nos favoritos
      if (!prev.some(fav => fav.id === location.id)) {
        return [...prev, location];
      }
      return prev;
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(location => location.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(location => location.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 