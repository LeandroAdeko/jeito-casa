# 🏠 Jeito de Casa

Uma aplicação web moderna e resiliente para organização doméstica, desenvolvida com React + Vite e potencializada pelo ecossistema Firebase.

## 📋 Sobre o Projeto

**Jeito de Casa** é uma suíte caseira de ferramentas projetada para simplificar a gestão cotidiana. O projeto foca em centralizar o planejamento de refeições, listas de compras e finanças domésticas em uma interface intuitiva, rápida e acessível de qualquer dispositivo.

## ✨ Funcionalidades Principais

### 🔐 Autenticação e Sincronização em Tempo Real
- **Acesso Seguro**: Login via Email/Senha ou Google (Firebase Auth).
- **Eco-sistema Cloud**: Seus dados são sincronizados instantaneamente entre dispositivos via Cloud Firestore.
- **Offline-First**: Continue consultando e editando suas listas mesmo sem conexão; as mudanças serão sincronizadas assim que você voltar online.

### 🛒 Lista de Compras Dinâmica
- **Listas Nomeados**: Crie e gerencie múltiplas listas de compras (ex: "Semanal", "Natal", "Churrasco").
- **Importação Inteligente**: 
  - **Do Planejamento**: Puxe automaticamente todos os ingredientes do seu cronograma de refeições.
  - **De Receitas**: Selecione receitas específicas e ajuste as quantidades (+/-) antes de importar.
  - **De Preferidos**: Selecione seus produtos preferidos de forma simples.
- **Modo Supermercado ("Zen")**: Interface focada no essencial para evitar cliques acidentais enquanto você percorre os corredores.
- **Finalização Flexível**: Escolha entre limpar apenas itens comprados, desmarcar tudo ou apagar a lista completa.

### 📅 Organizador de Refeições
- **Layout Horizontal**: Visualização fluida e responsiva dos dias de planejamento.
- **Cálculo de Lotes**: Informe o número de pessoas e o app calcula automaticamente quantos lotes de cada receita você precisa preparar.
- **Integração Total**: Gere sua lista de compras com um clique a partir do que foi planejado.

### 🍳 Criador de Receitas
- **Estruturação Completa**: Ingredientes com unidades padronizadas e passos detalhados.
- **Markdown Preview**: Visualize como sua receita ficará formatada antes de salvar.
- **Portabilidade**: Importe e exporte receitas em JSON para backup ou compartilhamento manual.

### 💸 Calculadora de Contas
- **Divisão Proporcional**: Calcule quem deve pagar o quê baseado na renda individual, garantindo uma divisão justa em contas compartilhadas.
- **Modo Igualitário**: Para divisões simples entre todos os moradores.

## 🎨 Design e User Experience

- **Navegação Superior**: Navbar sticky com menu hamburger para mobile e dropdown de perfil.
- **Standardized Headers**: Cabeçalhos modernos e consistentes com ícones expressivos e ações rápidas.
- **Sistema de Design Atômico**: Componentes de interface (Botões, Inputs, Cards) totalmente padronizados para uma experiência visual coesa.
- **Modais de Elite**: Substituição de alertas nativos por diálogos de confirmação elegantes e contextuais.

## 🚀 Guia de Início Rápido

### Instalação

```bash
# Clone e entre na pasta
git clone https://github.com/LeandroAdeko/jeito-casa.git
cd jeito-casa

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env)
# VITE_FIREBASE_API_KEY=sua_chave
# VITE_FIREBASE_AUTH_DOMAIN=seu_dominio
# ...etc

# Rode o servidor de dev
npm run dev
```

## 📁 Estrutura Técnica

```
jeito-casa/
├── src/
│   ├── components/      # Componentes atômicos (Button, Input, Modal)
│   ├── contexts/        # Gerenciamento de estado Global (Auth)
│   ├── hooks/           # Lógica reutilizável (useFirebaseSync, useRecipes)
│   ├── pages/           # Telas da aplicação (Dashboard, ShoppingList, etc)
│   ├── config/          # Centralização de configurações e chaves
│   └── styles/          # Design System e Tokens Globais
└── firestore.rules      # Regras de segurança do banco de dados
```

---

**Jeito de Casa** - A inteligência que faltava na sua rotina doméstica. 🏡✨
