export interface Location {
  id: string;
  fields: {
    titulo: string;
    descricao: string;
    preco: number;
    cidade: string;
    imagem: string;
    caracteristicas?: string[]; // IDs das características
  };
}

export interface LocationResponse {
  records: Location[];
}

export interface Characteristic {
  id: string;
  fields: {
    nome: string;
    icone: string;
  };
}

export interface CharacteristicResponse {
  records: Characteristic[];
} 