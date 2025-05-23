# Uaibnb 🏠

Plataforma web para aluguel de propriedades inspirada no Airbnb, desenvolvida com React, TypeScript e Styled Components.

## 🚀 Funcionalidades

### Principais
- **Navegação de propriedades**: Visualize uma lista completa de propriedades disponíveis para aluguel
- **Detalhes da propriedade**: Veja informações detalhadas, imagens e características de cada locação
- **Busca**: Encontre propriedades por nome/título
- **Sistema de favoritos**: Adicione e remova propriedades dos seus favoritos
- **Área administrativa**: Gerencie locações e características (CRUD completo)

### Sistema de Favoritos ⭐
- Botão de favorito em cada card de propriedade
- Página dedicada para visualizar todos os favoritos
- Persistência dos favoritos no localStorage
- Contador de favoritos no header
- Interface intuitiva com feedback visual

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para construção da interface
- **TypeScript** - Superset do JavaScript com tipagem estática
- **React Router DOM** - Navegação entre páginas
- **Styled Components** - Estilização CSS-in-JS
- **Vite** - Build tool e dev server
- **Airtable API** - Banco de dados e API

## 📁 Estrutura do Projeto

```
src/
├── components/                # Componentes reutilizáveis
│   ├── Header.tsx            # Cabeçalho com navegação
│   ├── FavoriteButton.tsx    # Botão de favoritos
│   ├── LocationModal.tsx     # Modal para locações
│   ├── CharacteristicModal.tsx # Modal para características
│   ├── LocationsList.tsx     # Lista de locações
│   ├── CharacteristicsList.tsx # Lista de características
│   ├── Toast.tsx             # Componente de notificação
│   ├── Preview.tsx           # Componente de preview
│   └── Navbar.tsx            # Barra de navegação
├── pages/                    # Páginas da aplicação
│   ├── Home.tsx             # Página inicial com lista de propriedades
│   ├── LocationDetail.tsx   # Detalhes da propriedade
│   ├── Favorites.tsx        # Página de favoritos
│   ├── Admin.tsx            # Área administrativa
│   ├── Characteristics.tsx  # Gerenciamento de características
│   └── FeatureName.tsx      # Componente para exibir características
├── contexts/                # Contextos React
│   ├── ToastContext.tsx     # Sistema de notificações
│   └── FavoritesContext.tsx # Gerenciamento de favoritos
├── services/                # Serviços e APIs
│   └── api.ts               # Configuração da API Airtable
├── types/                   # Tipos TypeScript adicionais
│   └── index.ts             # Definições de tipos extra
├── App.tsx                  # Componente principal da aplicação
├── main.tsx                 # Ponto de entrada do React
├── routes.tsx               # Configuração das rotas
├── types.ts                 # Definições principais de tipos TypeScript
└── style.css                # Estilos globais
```

## 🎯 Funcionalidades por Página

### Página Inicial (/)
- Lista todas as propriedades disponíveis
- Cards com imagem, título, descrição, preço e características
- Botão de favorito em cada card
- Campo de busca por título
- Loading skeleton durante carregamento

### Detalhes da Propriedade (/location/:id)
- Informações completas da propriedade
- Imagem em tamanho maior
- Botão de favorito (tamanho large)
- Lista de características
- Botão para voltar à página inicial

### Favoritos (/favorites)
- Lista todas as propriedades favoritadas
- Layout idêntico à página inicial
- Mensagem quando não há favoritos
- Botão para retornar à página inicial

### Área Administrativa (/admin)
- CRUD completo de locações
- Formulário para adicionar/editar propriedades
- Lista com ações de editar/excluir

### Características (/characteristics)
- Gerenciamento de características das propriedades
- CRUD completo de características

## 🚀 Como Executar

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd Uaibnb
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
   - A API do Airtable já está configurada no projeto
   - Para uso em produção, mova as credenciais para variáveis de ambiente

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

## 📱 Navegação

- **Início**: Lista de todas as propriedades
- **Favoritos**: Suas propriedades favoritas (com contador no header)
- **Área Administrativa**: Gerenciamento de locações e características

## 🎨 Design e UX

- Design responsivo e moderno
- Animações suaves (fadeIn, hover effects)
- Loading skeletons para melhor UX
- Sistema de toast para notificações
- Cores e tipografia consistentes
- Feedback visual em todas as interações

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Visualiza o build de produção
npm run lint         # Executa o linter
```

## 📦 Dependências Principais

- `react` - Biblioteca principal
- `react-router-dom` - Roteamento
- `styled-components` - Estilização
- `axios` - Cliente HTTP para API
- `typescript` - Tipagem estática

## 🌟 Destaques Técnicos

- **Context API**: Gerenciamento de estado global para favoritos
- **localStorage**: Persistência dos favoritos
- **TypeScript**: Tipagem completa para melhor DX
- **Styled Components**: CSS-in-JS com temas e props
- **React Hooks**: useState, useEffect, useContext, useNavigate
- **Error Handling**: Tratamento de erros da API
- **Loading States**: Estados de carregamento em todas as operações

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais. 