# 🏠 Jeito de Casa

Uma aplicação web moderna para organização doméstica, desenvolvida com React + Vite.

## 📋 Sobre o Projeto

**Jeito de Casa** é uma suíte de ferramentas para facilitar a gestão da sua casa. O projeto nasceu da necessidade de centralizar tarefas cotidianas como planejamento de refeições, divisão de contas e criação de receitas em uma única plataforma intuitiva.

## ✨ Funcionalidades

### 🍳 Criador de Receitas
- Crie e gerencie suas receitas culinárias
- Estruture ingredientes com quantidade, unidade e nome
- Adicione passos detalhados de preparo
- Exporte receitas em formato JSON
- Visualize em Markdown formatado
- Copie facilmente para compartilhar

### 📅 Organizador de Refeições
- Planejamento dinâmico de dias (sem limite fixo de semana)
- Adicione múltiplas refeições por dia
- Carregue receitas salvas em JSON
- **Cálculo inteligente de ingredientes:**
  - Informe o número de pessoas
  - Sistema calcula automaticamente os lotes necessários
  - Arredonda para cima para evitar falta de ingredientes
- **Lista de compras automática:**
  - Agrega ingredientes de todas as receitas
  - Checkbox interativo para marcar itens comprados
  - Exportação em Markdown
- **Sugestões de porções extras:**
  - Mostra quando haverá sobras
  - Ajuda no reaproveitamento de alimentos

### 💸 Calculadora de Contas
- Divida contas de forma justa entre moradores
- Dois modos de divisão:
  - **Igualitária:** Todos pagam o mesmo valor
  - **Proporcional:** Baseado na renda de cada pessoa
- Adicione múltiplos contribuintes
- Carregue e salve configurações em JSON
- Visualize resultados detalhados por pessoa

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **styled-components** - Estilização de componentes
- **react-markdown** - Renderização de Markdown

## 🎨 Design

- **Tema Claro/Escuro:** Alternância suave entre modos
- **Componentes Reutilizáveis:**
  - `SectionCard` - Cards padronizados
  - `CopyButton` - Botão de cópia com feedback
  - `FileUpload` - Upload de arquivos JSON
  - `DownloadJsonButton` - Download de dados
  - `DayCard` - Cards de planejamento de dias
- **Layout Responsivo:** Grid adaptativo para diferentes telas
- **Sidebar Colapsável:** Navegação otimizada

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16+)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/LeandroAdeko/jeito-de-casa.git

# Entre no diretório
cd jeito-de-casa

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
jeito-de-casa/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── CopyButton.jsx
│   │   ├── DayCard.jsx
│   │   ├── DownloadJsonButton.jsx
│   │   ├── FileUpload.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── SectionCard.jsx
│   │   ├── Sidebar.jsx
│   │   └── SidebarIcon.jsx
│   ├── pages/            # Páginas da aplicação
│   │   ├── BillSplitter.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MealOrganizer.jsx
│   │   └── RecipeCreator.jsx
│   ├── config/           # Configurações
│   │   └── tools.js      # Definição centralizada de ferramentas
│   ├── styles/           # Estilos CSS
│   │   ├── global.css
│   │   ├── layout.css
│   │   ├── dashboard.css
│   │   ├── meal-organizer.css
│   │   └── bill-splitter.css
│   ├── App.jsx           # Componente raiz
│   └── main.jsx          # Entry point
└── recipes/              # Receitas de exemplo (JSON)
```

## 🎯 Roadmap

- [ ] Autenticação de usuários
- [ ] Persistência de dados (LocalStorage/Backend)
- [ ] Modo de impressão para listas
- [ ] Compartilhamento de receitas
- [ ] Calculadora de conversão de unidades
- [ ] Sugestões de receitas baseadas em ingredientes disponíveis

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## 🙏 Créditos

Criado por [Leandro Silva](https://www.linkedin.com/in/leandrovlsilva/) + Antigravity

---

**Jeito de Casa** - Penando para organizar sua casa? A gente dá um jeito! 🏡✨
