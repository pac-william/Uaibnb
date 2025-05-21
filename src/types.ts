export interface Location {
  id: string;
  createdTime?: string;
  fields: {
    id?: number;
    titulo: string;
    descricao?: string;
    preco: number;
    cidade?: string;
    imagem?: string;
    usuario_criacao?: {
      id: string;
      email: string;
      name: string;
    };
    usuario_atualizacao?: {
      id: string;
      email: string;
      name: string;
    };
    locacao_caracteristicas?: string[];
    nome_caracteristica?: string[];
  };
}

export interface LocationResponse {
  records: Location[];
}

export interface Characteristic {
  id: string;
  createdTime?: string;
  fields: {
    id?: number;
    nome: string;
    descricao?: string;
    icone?: string;
    usuario_criacao?: {
      id: string;
      email: string;
      name: string;
    };
    usuario_atualizacao?: {
      id: string;
      email: string;
      name: string;
    };
    locacao_caracteristicas?: string[];
    nome_caracteristica?: string[];
  };
}

export interface CharacteristicResponse {
  records: Characteristic[];
}