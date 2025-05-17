import { useState, useEffect } from 'react';
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  Heading,
  VStack,
  Badge,
  Container,
} from '@chakra-ui/react';
import { getLocations, getCharacteristics } from '../services/api';
import type { Location, Characteristic } from '../types';

const Preview = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [characteristics, setCharacteristics] = useState<Record<string, Characteristic>>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, characteristicsRes] = await Promise.all([
          getLocations(),
          getCharacteristics(),
        ]);

        setLocations(locationsRes.data.records);
        const characteristicsMap = characteristicsRes.data.records.reduce(
          (acc, char) => ({
            ...acc,
            [char.id]: char,
          }),
          {}
        );
        setCharacteristics(characteristicsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={8} textAlign="center">
        Locações Disponíveis
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {locations.map((location) => (
          <Box
            key={location.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
          >
            <Image
              src={location.fields.imagem}
              alt={location.fields.titulo}
              height="200px"
              width="100%"
              objectFit="cover"
            />
            <VStack p={4} align="stretch" spacing={3}>
              <Heading size="md">{location.fields.titulo}</Heading>
              <Text color="gray.600">{location.fields.descricao}</Text>
              <Text fontWeight="bold" fontSize="xl" color="teal.600">
                R$ {location.fields.preco}/dia
              </Text>
              <Text color="gray.500">{location.fields.cidade}</Text>
              <Box>
                {location.fields.locacao_caracteristicas?.map((charId) => (
                  <Badge
                    key={charId}
                    mr={2}
                    mb={2}
                    colorScheme="teal"
                    variant="subtle"
                  >
                    {characteristics[charId]?.fields.nome}
                  </Badge>
                ))}
              </Box>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Preview; 