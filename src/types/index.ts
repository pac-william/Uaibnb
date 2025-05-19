export interface Location {
  id: string;
  fields: {
    titulo: string;
    descricao: string;
    preco: number;
    cidade: string;
    imagem: string;
    locacao_caracteristicas?: string[];
  };
}

export interface Characteristic {
  id: string;
  fields: {
    nome: string;
    icone: string;
  };
}

export interface StyledProps {
  delay?: number;
  width?: string;
  height?: string;
}

export interface LocationResponse {
  records: Location[];
}

export interface CharacteristicResponse {
  records: Characteristic[];
} 