import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getLocations, createLocation, updateLocation, deleteLocation, getCharacteristics } from '../services/api';
import type { Location, Characteristic } from '../types';

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
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
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

  @media (max-width: 480px) {
    font-size: 1.5rem;
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
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(49, 151, 149, 0.1);
  width: auto;
  white-space: nowrap;

  &:hover {
    background: #2c7a7b;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(49, 151, 149, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  margin: 0 -20px;
  padding: 0 20px;

  @media (max-width: 768px) {
    border-radius: 0;
    margin: 0 -20px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 4px;
  }
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

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  margin: 40px auto;
  max-height: calc(100vh - 80px);
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 20px auto;
    max-height: calc(100vh - 40px);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
  }
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
  width: 100%;

  &:focus {
    outline: none;
    border-color: #319795;
    box-shadow: 0 0 0 3px rgba(49, 151, 149, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;
  width: 100%;

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

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f7fafc;
  }

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  span {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
  }
`;

const CharacteristicIcon = styled.span`
  font-size: 1.25rem;
  min-width: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const CharacteristicsDisplay = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  
  span {
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    span {
      font-size: 1rem;
    }
  }
`;

const Admin = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    cidade: '',
    imagem: '',
    caracteristicas: [] as string[],
  });

  useEffect(() => {
    fetchLocations();
    fetchCharacteristics();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.data.records);
    } catch (error) {
      console.error('Erro ao buscar locações:', error);
    }
  };

  const fetchCharacteristics = async () => {
    try {
      const response = await getCharacteristics();
      setCharacteristics(response.data.records);
    } catch (error) {
      console.error('Erro ao buscar características:', error);
    }
  };

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setSelectedLocation(location);
      setFormData({
        titulo: location.fields.titulo,
        descricao: location.fields.descricao,
        preco: location.fields.preco.toString(),
        cidade: location.fields.cidade,
        imagem: location.fields.imagem,
        caracteristicas: location.fields.caracteristicas || [],
      });
    } else {
      setSelectedLocation(null);
      setFormData({
        titulo: '',
        descricao: '',
        preco: '',
        cidade: '',
        imagem: '',
        caracteristicas: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        preco: Number(formData.preco),
      };

      if (selectedLocation) {
        await updateLocation(selectedLocation.id, data);
      } else {
        await createLocation(data);
      }
      
      setIsModalOpen(false);
      fetchLocations();
    } catch (error) {
      console.error('Erro ao salvar locação:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta locação?')) {
      try {
        await deleteLocation(id);
        fetchLocations();
      } catch (error) {
        console.error('Erro ao excluir locação:', error);
      }
    }
  };

  const handleCharacteristicChange = (characteristicId: string) => {
    setFormData(prev => {
      const isSelected = prev.caracteristicas.includes(characteristicId);
      return {
        ...prev,
        caracteristicas: isSelected
          ? prev.caracteristicas.filter(id => id !== characteristicId)
          : [...prev.caracteristicas, characteristicId],
      };
    });
  };

  const getCharacteristicNames = (characteristicIds: string[]) => {
    return characteristicIds
      .map(id => characteristics.find(c => c.id === id))
      .filter(c => c)
      .map(c => (
        <span key={c!.id} title={c!.fields.nome}>
          {c!.fields.icone}
        </span>
      ));
  };

  return (
    <Container>
      <Header>
        <Title>Gerenciar Locações</Title>
        <Button onClick={() => handleOpenModal()}>
          <span>➕</span> Nova Locação
        </Button>
      </Header>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Título</Th>
              <Th>Cidade</Th>
              <Th>Preço</Th>
              <Th>Características</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <Td colSpan={5}>
                  <NoDataMessage>
                    Nenhuma locação cadastrada ainda. Clique em "Nova Locação" para começar!
                  </NoDataMessage>
                </Td>
              </tr>
            ) : (
              locations.map((location) => (
                <tr key={location.id}>
                  <Td>{location.fields.titulo}</Td>
                  <Td>{location.fields.cidade}</Td>
                  <Td>R$ {location.fields.preco}</Td>
                  <Td>
                    <CharacteristicsDisplay>
                      {location.fields.caracteristicas && 
                        getCharacteristicNames(location.fields.caracteristicas)}
                    </CharacteristicsDisplay>
                  </Td>
                  <Td>
                    <ActionButton onClick={() => handleOpenModal(location)}>
                      ✏️ Editar
                    </ActionButton>
                    <DeleteButton onClick={() => handleDelete(location.id)}>
                      🗑️ Excluir
                    </DeleteButton>
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
              {selectedLocation ? 'Editar Locação' : 'Nova Locação'}
            </ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Título</Label>
                <Input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Digite o título da locação"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Digite uma descrição detalhada da locação"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Preço por dia</Label>
                <Input
                  type="number"
                  value={formData.preco}
                  onChange={(e) =>
                    setFormData({ ...formData, preco: e.target.value })
                  }
                  placeholder="Digite o preço por dia"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Cidade</Label>
                <Input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) =>
                    setFormData({ ...formData, cidade: e.target.value })
                  }
                  placeholder="Digite a cidade"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>URL da Imagem</Label>
                <Input
                  type="url"
                  value={formData.imagem}
                  onChange={(e) =>
                    setFormData({ ...formData, imagem: e.target.value })
                  }
                  placeholder="Cole a URL da imagem"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Características</Label>
                <CheckboxGroup>
                  {characteristics.map((characteristic) => (
                    <CheckboxLabel key={characteristic.id}>
                      <input
                        type="checkbox"
                        checked={formData.caracteristicas.includes(characteristic.id)}
                        onChange={() => handleCharacteristicChange(characteristic.id)}
                      />
                      <CharacteristicIcon>
                        {characteristic.fields.icone}
                      </CharacteristicIcon>
                      <span>{characteristic.fields.nome}</span>
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedLocation ? 'Atualizar' : 'Criar'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Admin; 