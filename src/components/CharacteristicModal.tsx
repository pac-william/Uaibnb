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
  VStack,
  useToast,
} from '@chakra-ui/react';
import { createCharacteristic, updateCharacteristic } from '../services/api';
import type { Characteristic } from '../types';

interface CharacteristicModalProps {
  isOpen: boolean;
  onClose: () => void;
  characteristic: Characteristic | null;
}

const CharacteristicModal = ({
  isOpen,
  onClose,
  characteristic,
}: CharacteristicModalProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (characteristic) {
      setFormData({
        nome: characteristic.fields.nome,
        descricao: characteristic.fields.descricao,
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
      });
    }
  }, [characteristic]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (characteristic) {
        await updateCharacteristic(characteristic.id, formData);
        toast({
          title: 'Característica atualizada com sucesso!',
          status: 'success',
          duration: 3000,
        });
      } else {
        await createCharacteristic(formData);
        toast({
          title: 'Característica criada com sucesso!',
          status: 'success',
          duration: 3000,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving characteristic:', error);
      toast({
        title: 'Erro ao salvar característica',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {characteristic ? 'Editar Característica' : 'Adicionar Nova Característica'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nome: e.target.value }))
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
            {characteristic ? 'Atualizar' : 'Criar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CharacteristicModal; 