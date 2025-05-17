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
    descricao: string;
  };
}

export interface LocationResponse {
  records: Location[];
}

export interface CharacteristicResponse {
  records: Characteristic[];
} 