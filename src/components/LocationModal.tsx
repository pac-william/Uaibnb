import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react';
import { createLocation, updateLocation, getCharacteristics } from '../services/api';
import type { Location, Characteristic } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
}

const LocationModal = ({ isOpen, onClose, location }: LocationModalProps) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    cidade: '',
    imagem: '',
    locacao_caracteristicas: [] as string[],
  });
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (location) {
      setFormData({
        titulo: location.fields.titulo,
        descricao: location.fields.descricao,
        preco: location.fields.preco.toString(),
        cidade: location.fields.cidade,
        imagem: location.fields.imagem,
        locacao_caracteristicas: location.fields.locacao_caracteristicas || [],
      });
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        preco: '',
        cidade: '',
        imagem: '',
        locacao_caracteristicas: [],
      });
    }
  }, [location]);

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const response = await getCharacteristics();
        setCharacteristics(response.data.records);
      } catch (error) {
        console.error('Error fetching characteristics:', error);
      }
    };
    fetchCharacteristics();
  }, []);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = {
        ...formData,
        preco: Number(formData.preco),
      };

      if (location) {
        await updateLocation(location.id, data);
        toast({
          title: 'Locação atualizada com sucesso!',
          status: 'success',
          duration: 3000,
        });
      } else {
        await createLocation(data);
        toast({
          title: 'Locação criada com sucesso!',
          status: 'success',
          duration: 3000,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: 'Erro ao salvar locação',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacteristicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      locacao_caracteristicas: selectedOptions,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {location ? 'Editar Locação' : 'Adicionar Nova Locação'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Título</FormLabel>
              <Input
                value={formData.titulo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, descricao: e.target.value }))
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Preço</FormLabel>
              <NumberInput
                value={formData.preco}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, preco: value }))
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Cidade</FormLabel>
              <Input
                value={formData.cidade}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cidade: e.target.value }))
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>URL da Imagem</FormLabel>
              <Input
                value={formData.imagem}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imagem: e.target.value }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Características</FormLabel>
              <Select
                multiple
                height="200px"
                value={formData.locacao_caracteristicas}
                onChange={handleCharacteristicChange}
              >
                {characteristics.map((characteristic) => (
                  <option key={characteristic.id} value={characteristic.id}>
                    {characteristic.fields.nome}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {location ? 'Atualizar' : 'Criar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LocationModal; 