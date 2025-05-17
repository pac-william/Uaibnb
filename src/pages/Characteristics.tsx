import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCharacteristics, createCharacteristic, updateCharacteristic } from '../services/api';
import type { Characteristic } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c5282;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: #319795;
    border-radius: 2px;
  }
`;

const Button = styled.button`
  background: #319795;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(49, 151, 149, 0.1);

  &:hover {
    background: #2c7a7b;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(49, 151, 149, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 0.9375rem;
`;

const ActionButton = styled(Button)`
  padding: 8px 16px;
  font-size: 0.875rem;
  margin: 0;
  height: 36px;
  min-width: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const DeleteButton = styled(ActionButton)`
  background: #fff;
  color: #e53e3e;
  border: 1px solid #e53e3e;
  box-shadow: none;

  &:hover {
    background: #fff5f5;
    color: #c53030;
    border-color: #c53030;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(229, 62, 62, 0.1);
  }
`;

const EditButton = styled(ActionButton)`
  background: #fff;
  color: #319795;
  border: 1px solid #319795;
  box-shadow: none;

  &:hover {
    background: #f0ffff;
    color: #2c7a7b;
    border-color: #2c7a7b;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(49, 151, 149, 0.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #4a5568;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #319795;
    box-shadow: 0 0 0 3px rgba(49, 151, 149, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const ModalTitle = styled.h2`
  color: #2d3748;
  margin-bottom: 24px;
  font-size: 1.5rem;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #718096;
  font-size: 1.125rem;
`;

const IconPreview = styled.div`
  font-size: 2rem;
  text-align: center;
  margin-top: 8px;
`;

const Characteristics = () => {
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<Characteristic | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    icone: '',
  });

  useEffect(() => {
    fetchCharacteristics();
  }, []);

  const fetchCharacteristics = async () => {
    try {
      const response = await getCharacteristics();
      setCharacteristics(response.data.records);
    } catch (error) {
      console.error('Erro ao buscar características:', error);
    }
  };

  const handleOpenModal = (characteristic?: Characteristic) => {
    if (characteristic) {
      setSelectedCharacteristic(characteristic);
      setFormData({
        nome: characteristic.fields.nome,
        icone: characteristic.fields.icone,
      });
    } else {
      setSelectedCharacteristic(null);
      setFormData({
        nome: '',
        icone: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCharacteristic) {
        await updateCharacteristic(selectedCharacteristic.id, formData);
      } else {
        await createCharacteristic(formData);
      }
      
      setIsModalOpen(false);
      fetchCharacteristics();
    } catch (error) {
      console.error('Erro ao salvar característica:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta característica?')) {
      try {
        await deleteCharacteristic(id);
        fetchCharacteristics();
      } catch (error) {
        console.error('Erro ao excluir característica:', error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Gerenciar Características</Title>
        <Button onClick={() => handleOpenModal()}>
          <span>➕</span> Nova Característica
        </Button>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>Ícone</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {characteristics.length === 0 ? (
              <tr>
                <Td colSpan={3}>
                  <NoDataMessage>
                    Nenhuma característica cadastrada ainda. Clique em "Nova Característica" para começar!
                  </NoDataMessage>
                </Td>
              </tr>
            ) : (
              characteristics.map((characteristic) => (
                <tr key={characteristic.id}>
                  <Td>{characteristic.fields.nome}</Td>
                  <Td>
                    <span role="img" aria-label={characteristic.fields.nome}>
                      {characteristic.fields.icone}
                    </span>
                  </Td>
                  <Td>
                    <ActionButtons>
                      <EditButton onClick={() => handleOpenModal(characteristic)}>
                        ✏️ Editar
                      </EditButton>
                      <DeleteButton onClick={() => handleDelete(characteristic.id)}>
                        🗑️ Excluir
                      </DeleteButton>
                    </ActionButtons>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalTitle>
              {selectedCharacteristic ? 'Editar Característica' : 'Nova Característica'}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Nome</Label>
                <Input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Digite o nome da característica"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Ícone (emoji)</Label>
                <Input
                  type="text"
                  value={formData.icone}
                  onChange={(e) =>
                    setFormData({ ...formData, icone: e.target.value })
                  }
                  placeholder="Cole um emoji aqui (ex: 🏠, 🛁, 🚗)"
                  required
                />
                {formData.icone && (
                  <IconPreview>
                    <span role="img" aria-label="preview">
                      {formData.icone}
                    </span>
                  </IconPreview>
                )}
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedCharacteristic ? 'Atualizar' : 'Criar'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Characteristics; 