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
  Checkbox,
  SimpleGrid,
  useToast,
  FormErrorMessage,
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
  const [errors, setErrors] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    cidade: '',
    imagem: '',
  });
  const toast = useToast();

  useEffect(() => {
    if (location) {
      setFormData({
        titulo: location.fields.titulo || '',
        descricao: location.fields.descricao || '',
        preco: location.fields.preco?.toString() || '',
        cidade: location.fields.cidade || '',
        imagem: location.fields.imagem || '',
        locacao_caracteristicas: Array.isArray(location.fields.locacao_caracteristicas)
          ? location.fields.locacao_caracteristicas
          : [],
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
    setErrors({ titulo: '', descricao: '', preco: '', cidade: '', imagem: '' });
  }, [location]);

  useEffect(() => {
    const fetchCharacteristics = async () => {
      try {
        const response = await getCharacteristics();
        setCharacteristics(response.data.records || []);
      } catch (error: any) {
        console.error('Error fetching characteristics:', error);
        toast({
          title: 'Erro ao carregar características',
          description: error.response?.data?.error?.message || 'Falha na conexão com o servidor.',
          status: 'error',
          duration: 5000,
        });
      }
    };
    fetchCharacteristics();
  }, [toast]);

  const validateForm = () => {
    const newErrors = {
      titulo: formData.titulo.trim() ? '' : 'O título é obrigatório.',
      descricao: formData.descricao.trim() ? '' : 'A descrição é obrigatória.',
      preco:
        formData.preco && !isNaN(Number(formData.preco)) && Number(formData.preco) >= 0
          ? ''
          : 'Insira um preço válido (número maior ou igual a 0).',
      cidade: formData.cidade.trim() ? '' : 'A cidade é obrigatória.',
      imagem: formData.imagem.trim() && /^https?:\/\/.+\..+/.test(formData.imagem)
        ? ''
        : 'Insira uma URL de imagem válida (ex: https://exemplo.com/imagem.jpg).',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Erro no formulário',
        description: 'Por favor, corrija os campos destacados.',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    console.log(formData.locacao_caracteristicas);
    

    try {
      setIsLoading(true);
      const data = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        preco: Number(formData.preco),
        cidade: formData.cidade,
        imagem: formData.imagem,
        locacao_caracteristicas: formData.locacao_caracteristicas,
      };

      const payload = { records: [{ fields: data }] };
      console.log(payload);
      
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
    } catch (error: any) {
      console.error('❌ Erro ao salvar locação:', error.response?.data || error);
      const errorMessage =
        error.response?.data?.error?.message || 'Erro ao salvar locação.';
      toast({
        title: 'Erro ao salvar locação',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacteristicChange = (characteristicId: string) => {
    setFormData((prev) => {
      const isSelected = prev.locacao_caracteristicas.includes(characteristicId);
      return {
        ...prev,
        locacao_caracteristicas: isSelected
          ? prev.locacao_caracteristicas.filter((id) => id !== characteristicId)
          : [...prev.locacao_caracteristicas, characteristicId],
      };
    });
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
            <FormControl isRequired isInvalid={!!errors.titulo}>
              <FormLabel>Título</FormLabel>
              <Input
                value={formData.titulo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                }
                placeholder="Digite o título da locação"
              />
              <FormErrorMessage>{errors.titulo}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.descricao}>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, descricao: e.target.value }))
                }
                placeholder="Digite uma descrição detalhada"
              />
              <FormErrorMessage>{errors.descricao}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.preco}>
              <FormLabel>Preço (R$/dia)</FormLabel>
              <NumberInput
                value={formData.preco}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, preco: value }))
                }
                min={0}
                precision={2}
              >
                <NumberInputField placeholder="Digite o preço" />
              </NumberInput>
              <FormErrorMessage>{errors.preco}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.cidade}>
              <FormLabel>Cidade</FormLabel>
              <Input
                value={formData.cidade}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cidade: e.target.value }))
                }
                placeholder="Digite a cidade"
              />
              <FormErrorMessage>{errors.cidade}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.imagem}>
              <FormLabel>URL da Imagem</FormLabel>
              <Input
                value={formData.imagem}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imagem: e.target.value }))
                }
                placeholder="Cole a URL da imagem (ex: https://exemplo.com/imagem.jpg)"
                type="url"
              />
              <FormErrorMessage>{errors.imagem}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Características</FormLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                {characteristics.length === 0 ? (
                  <p>Nenhuma característica disponível</p>
                ) : (
                  characteristics.map((characteristic) => (
                    <Checkbox
                      key={characteristic.id}
                      isChecked={formData.locacao_caracteristicas.includes(characteristic.id)}
                      onChange={() => handleCharacteristicChange(characteristic.id)}
                    >
                      {characteristic.fields.icone || '✅'} {characteristic.fields.nome}
                    </Checkbox>
                  ))
                )}
              </SimpleGrid>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {location ? 'Atualizar' : 'Criar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LocationModal;
