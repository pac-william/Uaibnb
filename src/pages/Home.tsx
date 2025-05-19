import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { getLocations } from '../services/api';
import type { Location } from '../types';
import { useToast } from '../contexts/ToastContext';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
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
  animation-delay: ${({ delay }) => delay || 0}s;

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

const Badge = styled.span`
  background: #e6fffa;
  color: #319795;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.3s ease, transform 0.3s ease;

  ${Card}:hover & {
    background: #b2f5ea;
    transform: translateY(-2px);
  }
`;

// Skeleton Loader Styles
const SkeletonCard = styled(Card)`
  background: #f7fafc;
  box-shadow: none;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 220px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 936px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonText = styled.div`
  width: ${({ width }) => width || '80%'};
  height: ${({ height }) => height || '20px'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 936px 100%;
  border-radius: 8px;
  animation: ${shimmer} 1.5s infinite linear;
  margin-bottom: 12px;
`;

const SkeletonBadge = styled(SkeletonText)`
  width: 80px;
  height: 24px;
  display: inline-block;
  margin-right: 8px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e53e3e;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const InputSearch = styled.input`
  display: block;
  width: 100%;
  max-width: 480px;
  margin: 0 auto 32px;
  padding: 12px 16px;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  outline: none;
  transition: 0.3s border-color;

  &:focus {
    border-color: #2b6cb0;
  }
`;


const Home = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getLocations();
        console.log('API Response:', response.data.records); // Debugging
        setLocations(response.data.records || []);
      } catch (error) {
        showToast('Erro ao carregar localizações. Tente novamente.', 'error');
        setError('Não foi possível carregar as localizações.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [showToast]);

  const handleLocationClick = (locationId: string) => {
    navigate(`/location/${locationId}`);
  };

  const filteredLocations = locations.filter((location) =>
    location.fields.titulo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <Grid>
      {[...Array(6)].map((_, index) => (
        <SkeletonCard key={index} delay={index * 0.1}>
          <SkeletonImage />
          <Content>
            <SkeletonText width="70%" height="28px" />
            <SkeletonText width="90%" />
            <SkeletonText width="60%" height="24px" />
            <SkeletonText width="50%" />
            <CharacteristicsList>
              <SkeletonBadge />
              <SkeletonBadge />
            </CharacteristicsList>
          </Content>
        </SkeletonCard>
      ))}
    </Grid>
  );

  return (
    <Container>
      <Title>Lugares Incríveis para Aluguel</Title>
      <InputSearch
        type="text"
        placeholder="Buscar..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isLoading ? (
        <SkeletonLoader />
      ) : locations.length === 0 ? (
        <ErrorMessage>Nenhum local encontrado.</ErrorMessage>
      ) : (
        <Grid>
          {filteredLocations.map((location, index) => (
            <Card
              key={location.id}
              onClick={() => handleLocationClick(location.id)}
              delay={index * 0.1}
            >
              <Image
                src={location.fields.imagem || 'https://via.placeholder.com/300'}
                alt={location.fields.titulo || 'Local'}
              />
              <Content>
                <LocationTitle>{location.fields.titulo || 'Sem título'}</LocationTitle>
                <Description>{location.fields.descricao || 'Sem descrição'}</Description>
                <Price>R$ {location.fields.preco || '0'}/dia</Price>
                <City>{location.fields.cidade || 'Cidade não informada'}</City>
                {Array.isArray(location.fields.locacao_caracteristicas) &&
                  location.fields.locacao_caracteristicas.length > 0 && (
                    <CharacteristicsList>
                      {location.fields.locacao_caracteristicas.map((charId) => (
                        <Badge key={charId}>Característica {charId}</Badge>
                      ))}
                    </CharacteristicsList>
                  )}
              </Content>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;