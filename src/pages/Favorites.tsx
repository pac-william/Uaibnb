import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useFavorites } from '../contexts/FavoritesContext';
import FeatureName from './FeatureName';
import FavoriteButton from '../components/FavoriteButton';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 48px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  padding: 0 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: backwards;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.4s ease;
`;

const Content = styled.div`
  padding: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
`;

const LocationTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 12px;
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: #2b6cb0;
  }
`;

const Description = styled.p`
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: #2d3748;
  }
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #38a169;
  margin-bottom: 8px;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: translateX(5px);
  }
`;

const City = styled.div`
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 12px;
`;

const CharacteristicsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #4a5568;
  font-size: 1.5rem;
  margin-top: 64px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const BackToHomeButton = styled.button`
  display: block;
  margin: 40px auto 0;
  padding: 12px 24px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3182ce;
    transform: translateY(-2px);
  }
`;

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleLocationClick = (locationId: string) => {
    navigate(`/location/${locationId}`);
  };

  return (
    <Container>
      <Title>Seus Lugares Favoritos</Title>

      {favorites.length === 0 ? (
        <EmptyMessage>
          <p>Você ainda não adicionou nenhum lugar aos favoritos.</p>
          <BackToHomeButton onClick={() => navigate('/')}>
            Voltar para a página inicial
          </BackToHomeButton>
        </EmptyMessage>
      ) : (
        <Grid>
          {favorites.map((location) => (
            <Card key={location.id} onClick={() => handleLocationClick(location.id)}>
              <Image
                src={location.fields.imagem || 'https://via.placeholder.com/300'}
                alt={location.fields.titulo || 'Local'}
              />
              <FavoriteButton location={location} />
              <Content>
                <LocationTitle>{location.fields.titulo || 'Sem título'}</LocationTitle>
                <Description>{location.fields.descricao || 'Sem descrição'}</Description>
                <Price>R$ {location.fields.preco || '0'}/dia</Price>
                <City>{location.fields.cidade || 'Cidade não informada'}</City>
                <CharacteristicsList>
                  {location.fields.locacao_caracteristicas?.map((charId) => (
                    <FeatureName key={charId} charId={charId} />
                  ))}
                </CharacteristicsList>
              </Content>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites; 