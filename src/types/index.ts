import { HTMLAttributes } from 'react';

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

export interface StyledProps extends HTMLAttributes<HTMLElement> {
  delay?: number;
  width?: string;
  height?: string;
}

export interface LocationResponse {
  data: {
    records: Location[];
  };
}

export interface CharacteristicResponse {
  data: {
    records: Characteristic[];
  };
}

export interface LocationFormData {
  titulo: string;
  descricao: string;
  preco: number;
  cidade: string;
  imagem: string;
  locacao_caracteristicas?: string[];
} 