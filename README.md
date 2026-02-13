# 🏠 Jeito de Casa

Uma aplicação web moderna para organização doméstica, desenvolvida com React + Vite.

## 📋 Sobre o Projeto

**Jeito de Casa** é uma suíte de ferramentas para facilitar a gestão da sua casa. O projeto nasceu da necessidade de centralizar tarefas cotidianas como planejamento de refeições, divisão de contas e criação de receitas em uma única plataforma intuitiva e sincronizada.

## ✨ Funcionalidades

### 🔐 Autenticação e Sincronização
- Login seguro via Email/Senha ou Google (Firebase Auth)
- Sincronização em tempo real entre dispositivos via Firestore
- Dados persistentes vinculados à conta do usuário

### 🛒 Lista de Compras
- Gerenciamento de itens com quantidade e unidade
- **Importação inteligente:** Adicione ingredientes diretamente de suas receitas ou do seu planejamento no Organizador de Refeições
- Interface interativa para marcar itens durante a compra
- Limpeza automática de itens comprados ao finalizar

### 🍳 Criador de Receitas
- Estruture ingredientes com quantidade, unidade e nome
- Adicione passos detalhados de preparo
- Exporte receitas em formato JSON
- Visualize em Markdown formatado e copie facilmente

### 📅 Organizador de Refeições
- Planejamento dinâmico de dias
- Adicione múltiplas refeições por dia
- **Cálculo inteligente de ingredientes:** Informe o número de pessoas e o sistema calcula os lotes necessários automaticamente
- Arredondamento inteligente para evitar falta de ingredientes

### 💸 Calculadora de Contas
- Divida contas de forma igualitária ou proporcional à renda de cada morador
- Visualize resultados detalhados por pessoa
- Salve configurações de contribuintes para uso recorrente

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework frontend
- **Vite** - Build tool ultrarrápida
- **Firebase** - Authentication e Firestore (Banco de dados NoSQL)
- **styled-components** - CSS-in-JS para design moderno
- **React Router 6** - Roteamento com suporte a rotas protegidas
- **react-markdown** - Renderização de receitas e notas

## 🎨 Design e UI

- **Interface Premium:** Design limpo, bordas suaves e micro-interações
- **Standardized Headers:** Sistema de cabeçalhos sem bordas e ação primária destacada
- **Navbar Superior:** Navegação intuitiva adaptada para desktop e mobile
- **Atomic Buttons:** Sistema de botões padronizado (Variants: primary, secondary, danger, ghost)
- **Tema Híbrido:** Suporte visual para clareza e conforto

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18+)
- Conta no Firebase (para as chaves de configuração)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/LeandroAdeko/jeito-casa.git

# Entre no diretório
cd jeito-casa

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env com suas chaves do Firebase
# VITE_FIREBASE_API_KEY=...

# Execute em modo de desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```
jeito-casa/
├── src/
│   ├── components/       # Componentes atômicos e estruturais
│   │   ├── Button/       # Sistema de botões padronizado
│   │   ├── Input/        # Inputs, TextAreas e Selects estilizados
│   │   ├── Navbar.jsx    # Navegação superior
│   │   └── SectionCard.jsx
│   ├── contexts/         # Contextos (AuthContext, etc.)
│   ├── hooks/            # Hooks customizados (useFirebaseSync, etc.)
│   ├── pages/            # Páginas da aplicação
│   │   ├── Login.jsx
│   │   ├── ShoppingList.jsx
│   │   ├── MealOrganizer.jsx
│   │   └── BillSplitter.jsx
│   ├── config/           # Configurações do Firebase e Ferramentas
│   ├── styles/           # Tokens e estilos globais
│   ├── App.jsx           # Roteamento e Provedores
│   └── main.jsx
└── public/               # Ativos estáticos
```

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Jeito de Casa** - Organização doméstica sem complicações. 🏡✨
