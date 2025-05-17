import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getLocations } from '../services/api';
import type { Location } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c5282;
  text-align: center;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 16px;
`;

const LocationTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: #4a5568;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Price = styled.div`
  font-size: 1.25rem;
  color: #38a169;
  font-weight: bold;
`;

const City = styled.div`
  color: #718096;
  font-size: 0.875rem;
  margin-top: 4px;
`;

const CharacteristicsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Badge = styled.span`
  background: #e6fffa;
  color: #319795;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const Home = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        setLocations(response.data.records);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = (locationId: string) => {
    navigate(`/location/${locationId}`);
  };

  return (
    <Container>
      <Title>Lugares Disponíveis para Aluguel</Title>
      <Grid>
        {locations.map((location) => (
          <Card
            key={location.id}
            onClick={() => handleLocationClick(location.id)}
          >
            <Image
              src={location.fields.imagem}
              alt={location.fields.titulo}
            />
            <Content>
              <LocationTitle>{location.fields.titulo}</LocationTitle>
              <Description>{location.fields.descricao}</Description>
              <Price>R$ {location.fields.preco}/dia</Price>
              <City>{location.fields.cidade}</City>
              {location.fields.locacao_caracteristicas && (
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
    </Container>
  );
};

export default Home; 