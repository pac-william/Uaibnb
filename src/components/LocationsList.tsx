import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Heading,
  VStack,
  HStack,
  Image,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { getLocations } from '../services/api';
import type { Location } from '../types';
import LocationModal from './LocationModal';

const LocationsList = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.data.records);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    onOpen();
  };

  const handleAdd = () => {
    setSelectedLocation(null);
    onOpen();
  };

  const handleModalClose = () => {
    onClose();
    fetchLocations();
  };

  return (
    <VStack align="stretch" spacing={4}>
      <HStack justify="space-between">
        <Heading size="lg">Locações</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleAdd}>
          Adicionar Locação
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Imagem</Th>
              <Th>Título</Th>
              <Th>Cidade</Th>
              <Th>Preço</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {locations.map((location) => (
              <Tr key={location.id}>
                <Td>
                  <Image
                    src={location.fields.imagem}
                    alt={location.fields.titulo}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Td>
                <Td>{location.fields.titulo}</Td>
                <Td>{location.fields.cidade}</Td>
                <Td>R$ {location.fields.preco}</Td>
                <Td>
                  <Button
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleEdit(location)}
                  >
                    Editar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <LocationModal
        isOpen={isOpen}
        onClose={handleModalClose}
        location={selectedLocation}
      />
    </VStack>
  );
};

export default LocationsList; 
