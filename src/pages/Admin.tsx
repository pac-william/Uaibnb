import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getLocations, createLocation, updateLocation, deleteLocation, getCharacteristics } from '../services/api';
import type { Location, Characteristic, StyledProps, LocationResponse, CharacteristicResponse, LocationFormData } from '../types';
import { useToast } from '../contexts/ToastContext';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 3rem auto;
  padding: 0 24px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 80px;
    height: 5px;
    background: #319795;
    border-radius: 3px;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Button = styled.button`
  background: #319795;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(49, 151, 149, 0.2);
  cursor: pointer;

  &:hover {
    background: #2c7a7b;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(49, 151, 149, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin: 0 -24px;
  padding: 0 24px;

  @media (max-width: 768px) {
    border-radius: 0;
    margin: 0 -24px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  text-align: left;
  padding: 18px;
  background: #f7fafc;
  color: #2d3748;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
`;

const Tr = styled.tr<StyledProps>`
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${({ delay }) => delay || 0}s;
  animation-fill-mode: backwards;

  &:hover {
    background: #f7fafc;
    transition: background 0.2s ease;
  }
`;

const Td = styled.td`
  padding: 18px;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 0.9375rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(Button)`
  padding: 10px 18px;
  font-size: 0.875rem;
  height: 38px;
  min-width: 38px;
`;

const EditButton = styled(ActionButton)`
  background: #fff;
  color: #319795;
  border: 1px solid #319795;
  box-shadow: none;

  &:hover {
    background: #e6fffa;
    color: #2c7a7b;
    border-color: #2c7a7b;
    box-shadow: 0 4px 8px rgba(49, 151, 149, 0.2);
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
    box-shadow: 0 4px 8px rgba(229, 62, 62, 0.2);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  z-index: 1000;
  overflow-y: auto;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  position: relative;
  margin: 40px auto;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  animation: ${slideIn} 0.4s ease-out;

  @media (max-width: 768px) {
    padding: 24px;
    margin: 20px auto;
    max-height: calc(100vh - 40px);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  width: 100%;
  background: #f7fafc;

  &:focus {
    outline: none;
    border-color: #319795;
    box-shadow: 0 0 0 4px rgba(49, 151, 149, 0.15);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Textarea = styled.textarea`
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 140px;
  resize: vertical;
  transition: all 0.2s;
  width: 100%;
  background: #f7fafc;

  &:focus {
    outline: none;
    border-color: #319795;
    box-shadow: 0 0 0 4px rgba(49, 151, 149, 0.15);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 12px;
`;

const ModalTitle = styled.h2`
  color: #1a202c;
  margin-bottom: 28px;
  font-size: 1.75rem;
  font-weight: 700;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 64px 0;
  color: #718096;
  font-size: 1.25rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
  background: #fff;

  &:hover {
    background: #e6fffa;
    border-color: #319795;
  }

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #319795;
  }

  span {
    font-size: 1rem;
    color: #2d3748;
  }
`;

const CharacteristicIcon = styled.span`
  font-size: 1.5rem;
  min-width: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const CharacteristicsDisplay = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  
  span {
    font-size: 1.5rem;
    transition: transform 0.2s ease;
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e53e3e;
  font-size: 1.2rem;
  margin: 2rem 0;
  animation: ${fadeIn} 0.5s ease-out;
`;

// Skeleton Loader Styles
const SkeletonTable = styled(Table)`
  background: #f7fafc;
`;

const SkeletonTd = styled(Td)`
  padding: 18px;
`;

const SkeletonLine = styled.div<StyledProps>`
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  width: ${({ width }) => width || '100%'};
`;

const Admin = () => {
  const { showToast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<LocationFormData>({
    titulo: '',
    descricao: '',
    preco: 0,
    cidade: '',
    imagem: '',
    locacao_caracteristicas: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [locationsResponse, characteristicsResponse] = await Promise.all([
        getLocations(),
        getCharacteristics()
      ]);
      setLocations(locationsResponse.data.records);
      setCharacteristics(characteristicsResponse.data.records);
    } catch (error) {
      showToast('Erro ao carregar dados', 'error');
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        titulo: location.fields.titulo,
        descricao: location.fields.descricao,
        preco: location.fields.preco,
        cidade: location.fields.cidade,
        imagem: location.fields.imagem,
        locacao_caracteristicas: location.fields.locacao_caracteristicas || []
      });
    } else {
      setEditingLocation(null);
      setFormData({
        titulo: '',
        descricao: '',
        preco: 0,
        cidade: '',
        imagem: '',
        locacao_caracteristicas: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, formData);
        showToast('Locação atualizada com sucesso!', 'success');
      } else {
        await createLocation(formData);
        showToast('Locação criada com sucesso!', 'success');
      }
      setEditingLocation(null);
      setFormData({
        titulo: '',
        descricao: '',
        preco: 0,
        cidade: '',
        imagem: '',
        locacao_caracteristicas: []
      });
      fetchData();
    } catch (error) {
      showToast('Erro ao salvar locação', 'error');
      console.error('Erro ao salvar locação:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta locação?')) {
      try {
        await deleteLocation(id);
        showToast('Locação excluída com sucesso!', 'success');
        fetchData();
      } catch (error) {
        showToast('Erro ao excluir locação', 'error');
        console.error('Erro ao excluir locação:', error);
      }
    }
  };

  const handleCharacteristicChange = (characteristicId: string) => {
    setFormData(prev => {
      const isSelected = prev.locacao_caracteristicas.includes(characteristicId);
      return {
        ...prev,
        locacao_caracteristicas: isSelected
          ? prev.locacao_caracteristicas.filter(id => id !== characteristicId)
          : [...prev.locacao_caracteristicas, characteristicId],
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

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <TableContainer>
      <SkeletonTable>
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
          {[...Array(5)].map((_, index) => (
            <Tr key={index} delay={index * 0.1}>
              <SkeletonTd><SkeletonLine width="70%" /></SkeletonTd>
              <SkeletonTd><SkeletonLine width="50%" /></SkeletonTd>
              <SkeletonTd><SkeletonLine width="40%" /></SkeletonTd>
              <SkeletonTd><SkeletonLine width="60%" /></SkeletonTd>
              <SkeletonTd><SkeletonLine width="80%" /></SkeletonTd>
            </Tr>
          ))}
        </tbody>
      </SkeletonTable>
    </TableContainer>
  );

  return (
    <Container>
      <Header>
        <Title>Gerenciar Locações</Title>
        <Button onClick={() => handleOpenModal()}>
          <span>➕</span> Nova Locação
        </Button>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? (
        <SkeletonLoader />
      ) : locations.length === 0 ? (
        <NoDataMessage>
          Nenhuma locação cadastrada. Clique em "Nova Locação" para começar!
        </NoDataMessage>
      ) : (
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
              {locations.map((location, index) => (
                <Tr key={location.id} delay={index * 0.1}>
                  <Td>{location.fields.titulo || 'Sem título'}</Td>
                  <Td>{location.fields.cidade || 'Cidade não informada'}</Td>
                  <Td>R$ {location.fields.preco || '0'}</Td>
                  <Td>
                    <CharacteristicsDisplay>
                      {Array.isArray(location.fields.locacao_caracteristicas) &&
                        getCharacteristicNames(location.fields.locacao_caracteristicas)}
                    </CharacteristicsDisplay>
                  </Td>
                  <Td>
                    <ActionButtons>
                      <EditButton onClick={() => handleOpenModal(location)}>
                        ✏️ Editar
                      </EditButton>
                      <DeleteButton onClick={() => handleDelete(location.id)}>
                        🗑️ Excluir
                      </DeleteButton>
                    </ActionButtons>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalTitle>
              {editingLocation ? 'Editar Locação' : 'Nova Locação'}
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
                    setFormData({ ...formData, preco: Number(e.target.value) })
                  }
                  placeholder="Digite o preço por dia"
                  min="0"
                  step="0.01"
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
                  {characteristics.length === 0 ? (
                    <NoDataMessage>Nenhuma característica disponível</NoDataMessage>
                  ) : (
                    characteristics.map((characteristic) => (
                      <CheckboxLabel key={characteristic.id}>
                        <input
                          type="checkbox"
                          checked={formData.locacao_caracteristicas.includes(characteristic.id)}
                          onChange={() => handleCharacteristicChange(characteristic.id)}
                        />
                        <CharacteristicIcon>
                          {characteristic.fields.icone}
                        </CharacteristicIcon>
                        <span>{characteristic.fields.nome}</span>
                      </CheckboxLabel>
                    ))
                  )}
                </CheckboxGroup>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLocation ? 'Atualizar' : 'Criar'}
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