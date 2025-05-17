import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getLocation, getCharacteristics } from '../services/api';
import type { Location, Characteristic } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BackButton = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 1rem;

  &:hover {
    background: #3182ce;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 16px;
`;

const Description = styled.p`
  color: #4a5568;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  color: #38a169;
  font-weight: bold;
  margin-bottom: 16px;
`;

const City = styled.div`
  color: #718096;
  font-size: 1.125rem;
  margin-bottom: 24px;
`;

const CharacteristicsSection = styled.div`
  margin-top: 32px;
`;

const CharacteristicsTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 16px;
`;

const CharacteristicsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const CharacteristicCard = styled.div`
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const CharacteristicName = styled.h3`
  font-size: 1.125rem;
  color: #2d3748;
  margin-bottom: 8px;
`;

const CharacteristicDescription = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
`;

const LocationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [characteristics, setCharacteristics] = useState<Record<string, Characteristic>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const [locationRes, characteristicsRes] = await Promise.all([
            getLocation(id),
            getCharacteristics(),
          ]);

          setLocation(locationRes.data);
          const characteristicsMap = characteristicsRes.data.records.reduce(
            (acc, char) => ({
              ...acc,
              [char.id]: char,
            }),
            {}
          );
          setCharacteristics(characteristicsMap);
        }
      } catch (error) {
        console.error('Error fetching location details:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!location) {
    return <Container>Carregando...</Container>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>← Voltar</BackButton>
      <ImageContainer>
        <Image src={location.fields.imagem} alt={location.fields.titulo} />
      </ImageContainer>
      <Title>{location.fields.titulo}</Title>
      <Description>{location.fields.descricao}</Description>
      <Price>R$ {location.fields.preco}/dia</Price>
      <City>{location.fields.cidade}</City>

      {location.fields.locacao_caracteristicas && location.fields.locacao_caracteristicas.length > 0 && (
        <CharacteristicsSection>
          <CharacteristicsTitle>Características</CharacteristicsTitle>
          <CharacteristicsList>
            {location.fields.locacao_caracteristicas.map((charId) => {
              const characteristic = characteristics[charId];
              if (!characteristic) return null;

              return (
                <CharacteristicCard key={charId}>
                  <CharacteristicName>{characteristic.fields.nome}</CharacteristicName>
                  <CharacteristicDescription>
                    {characteristic.fields.descricao}
                  </CharacteristicDescription>
                </CharacteristicCard>
              );
            })}
          </CharacteristicsList>
        </CharacteristicsSection>
      )}
    </Container>
  );
};

export default LocationDetail; 