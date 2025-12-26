# Guia de Estilo - Jeito de Casa

> **Versão:** 1.0  
> **Última Atualização:** 25/12/2025  
> **Status:** ✅ Padrão Oficial do Projeto

## 📋 Índice

1. [Filosofia do Projeto](#filosofia-do-projeto)
2. [Estilização](#estilização)
3. [Estrutura de Componentes](#estrutura-de-componentes)
4. [Nomenclatura](#nomenclatura)
5. [Autenticação](#autenticação)
6. [Persistência de Dados](#persistência-de-dados)
7. [Inputs e Formulários](#inputs-e-formulários)
8. [Boas Práticas](#boas-práticas)

---

## 🎯 Filosofia do Projeto

### Princípios Fundamentais

1. **Consistência acima de tudo** - Um padrão bem definido é melhor que múltiplas abordagens
2. **Developer Experience** - Código fácil de ler, manter e estender
3. **Performance** - Otimizar sem sacrificar legibilidade
4. **Acessibilidade** - Interfaces usáveis por todos

---

## 🎨 Estilização

### ✅ Padrão Oficial: Styled Components

**Decisão:** Todos os componentes devem usar `styled-components`.

#### Por quê?

- ✅ **Scoped Styles** - Sem conflitos de CSS
- ✅ **Temas Dinâmicos** - Suporte nativo a temas (dark/light)
- ✅ **Type Safety** - Melhor integração com TypeScript (futuro)
- ✅ **Component-based** - Alinhado com filosofia React
- ✅ **No Build Config** - Funciona out-of-the-box

### Estrutura Básica

```javascript
import React from 'react';
import styled from 'styled-components';

// 1. Definir styled components ANTES do componente funcional
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 20px;
`;

// 2. Componente funcional
const MyComponent = () => {
  return (
    <Container>
      <Title>Meu Título</Title>
    </Container>
  );
};

export default MyComponent;
```

### Variáveis CSS Globais

**Usar sempre as variáveis CSS definidas em `global.css`:**

```css
/* Cores */
var(--primary-color)
var(--bg-color)
var(--card-bg)
var(--text-color)
var(--text-secondary)
var(--border-color)

/* Layout */
var(--sidebar-width)
var(--sidebar-width-collapsed)

/* Efeitos */
var(--shadow)
var(--hover-bg)
var(--transition-speed)
```

**Exemplo:**

```javascript
const Card = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  color: var(--text-color);
`;
```

### Responsividade

**Usar media queries dentro dos styled components:**

```javascript
const HeroTitle = styled.h1`
  font-size: 3rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;
```

### Breakpoints Padrão

```javascript
// Mobile: < 480px
// Tablet: 481px - 768px
// Desktop: > 768px
```

### Extensão de Componentes

**Para estender styled components existentes:**

```javascript
import { Link } from 'react-router-dom';

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
`;

// Estender Button
const PrimaryButton = styled(Button)`
  background: var(--primary-color);
  color: white;
`;

// Estender componentes de bibliotecas
const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--primary-color);
`;
```

### Props Dinâmicas

**Usar `$` prefix para props transientes (não passadas ao DOM):**

```javascript
const Button = styled.button`
  background: ${props => props.$variant === 'primary' 
    ? 'var(--primary-color)' 
    : 'transparent'};
  color: ${props => props.$variant === 'primary' 
    ? 'white' 
    : 'var(--text-color)'};
`;

// Uso
<Button $variant="primary">Clique</Button>
```

### ❌ O que NÃO fazer

```javascript
// ❌ NÃO usar CSS tradicional em componentes novos
import './styles.css';

// ❌ NÃO usar inline styles para estilização complexa
<div style={{ padding: '20px', background: '#fff' }}>

// ❌ NÃO criar arquivos .css separados
// Exceção: global.css para variáveis CSS
```

---

## 🧩 Estrutura de Componentes

### Organização de Arquivos

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── index.js    # Barrel export
│   ├── Card/
│   └── ...
├── pages/              # Páginas/Rotas
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   └── ...
├── contexts/           # React Contexts
│   └── AuthContext.jsx
├── hooks/              # Custom Hooks
│   ├── useAuth.js
│   └── useLocalStorage.js
├── config/             # Configurações
│   ├── firebaseConfig.js
│   └── tools.js
└── styles/             # Apenas global.css
    └── global.css
```

### Anatomia de um Componente

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

// 2. Styled Components
const Container = styled.div`...`;
const Title = styled.h1`...`;

// 3. Componente Principal
const MyComponent = ({ prop1, prop2 }) => {
  // 3.1. Hooks
  const { currentUser } = useAuth();
  const [state, setState] = useState(null);
  
  // 3.2. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 3.3. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 3.4. Render
  return (
    <Container>
      <Title>{prop1}</Title>
    </Container>
  );
};

// 4. Export
export default MyComponent;
```

### Barrel Exports

**Para componentes com múltiplos arquivos:**

```javascript
// components/CurrencyInput/index.js
export { CurrencyInput } from './CurrencyInput';
export { CurrencyListInput } from './CurrencyListInput';

// Uso
import { CurrencyInput, CurrencyListInput } from '../components/CurrencyInput';
```

---

## 📝 Nomenclatura

### Componentes

```javascript
// ✅ PascalCase para componentes
const UserProfile = () => {};
const NavigationBar = () => {};

// ✅ PascalCase para styled components
const Container = styled.div``;
const PrimaryButton = styled.button``;
```

### Variáveis e Funções

```javascript
// ✅ camelCase para variáveis
const userName = 'João';
const isLoggedIn = true;

// ✅ camelCase para funções
const handleSubmit = () => {};
const fetchUserData = async () => {};
```

### Arquivos

```javascript
// ✅ PascalCase para componentes
UserProfile.jsx
NavigationBar.jsx

// ✅ camelCase para utilitários
currencyUtils.js
dateHelpers.js

// ✅ camelCase para hooks
useAuth.js
useLocalStorage.js

// ✅ PascalCase para contextos
AuthContext.jsx
ThemeContext.jsx
```

### Constantes

```javascript
// ✅ UPPER_SNAKE_CASE para constantes globais
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// ✅ Definir em arquivos de config
// config/constants.js
export const TOOLS = [...];
```

---

## 🔐 Autenticação

### Hook useAuth

**Padrão oficial para autenticação:**

```javascript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { currentUser, login, logout, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {currentUser ? (
        <p>Olá, {currentUser.displayName}!</p>
      ) : (
        <button onClick={() => navigate('/login')}>Entrar</button>
      )}
    </div>
  );
};
```

### Métodos Disponíveis

```javascript
const {
  currentUser,        // Usuário atual ou null
  loading,            // Boolean - carregando estado auth
  error,              // String - mensagem de erro
  register,           // (email, password, displayName) => Promise
  login,              // (email, password) => Promise
  loginWithGoogle,    // () => Promise
  logout,             // () => Promise
  resetPassword,      // (email) => Promise
  getUserData,        // (uid) => Promise
} = useAuth();
```

### Rotas Protegidas

```javascript
import ProtectedRoute from '../components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### ✅ Padrão: useAuth em TODAS as Ferramentas

**IMPORTANTE:** Todas as páginas de ferramentas devem usar `useAuth`, mesmo que não exijam login.

```javascript
// ✅ CORRETO - Todas as ferramentas devem ter
import { useAuth } from '../contexts/AuthContext';

const MyTool = () => {
  const { currentUser } = useAuth();
  
  // Personalizar experiência
  // Preparar para sincronização Firebase
  
  return (
    <div>
      {currentUser && <p>Bem-vindo, {currentUser.displayName}!</p>}
      {/* Conteúdo da ferramenta */}
    </div>
  );
};
```

### Sincronização com Firebase

**Padrão para sincronizar localStorage com Firebase:**

```javascript
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const MyTool = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useLocalStorage('myTool', initialData);

  // Carregar dados do Firebase quando usuário logar
  useEffect(() => {
    const loadFromFirebase = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'myTool', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setData(docSnap.data());
          }
        } catch (error) {
          console.error('Erro ao carregar do Firebase:', error);
        }
      }
    };

    loadFromFirebase();
  }, [currentUser]);

  // Salvar no Firebase quando dados mudarem
  useEffect(() => {
    const saveToFirebase = async () => {
      if (currentUser && data) {
        try {
          const docRef = doc(db, 'myTool', currentUser.uid);
          await setDoc(docRef, data);
        } catch (error) {
          console.error('Erro ao salvar no Firebase:', error);
        }
      }
    };

    // Debounce para evitar muitas escritas
    const timeoutId = setTimeout(saveToFirebase, 1000);
    return () => clearTimeout(timeoutId);
  }, [data, currentUser]);

  return (
    <div>
      {/* Componente */}
    </div>
  );
};
```

### Personalização por Usuário

```javascript
const MyTool = () => {
  const { currentUser } = useAuth();
  
  return (
    <div>
      <h1>
        {currentUser 
          ? `Olá, ${currentUser.displayName || 'Usuário'}!` 
          : 'Bem-vindo!'}
      </h1>
      
      {currentUser ? (
        <p>Seus dados estão sendo salvos na nuvem ☁️</p>
      ) : (
        <p>Faça login para salvar seus dados na nuvem</p>
      )}
    </div>
  );
};
```

### ✅ Boas Práticas

```javascript
// ✅ Sempre verificar loading antes de renderizar
if (loading) return <LoadingSpinner />;

// ✅ Tratar erros
try {
  await login(email, password);
} catch (error) {
  setError(error.message);
}

// ✅ Usar currentUser para personalização
{currentUser && <WelcomeMessage user={currentUser} />}

// ✅ Mostrar status de sincronização
{currentUser && <p>✅ Dados sincronizados com a nuvem</p>}

// ✅ Avisar sobre dados locais
{!currentUser && <p>⚠️ Dados salvos apenas localmente</p>}
```

### Estrutura Padrão de Ferramenta com Auth

```javascript
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MyTool = () => {
  // 1. Autenticação (SEMPRE primeiro)
  const { currentUser } = useAuth();
  
  // 2. Estado local com persistência
  // TODO: Sincronizar com Firebase quando usuário estiver logado
  const [data, setData] = useLocalStorage('myTool', initialData);
  
  // 3. Outros estados
  const [loading, setLoading] = useState(false);
  
  // 4. Effects
  useEffect(() => {
    // Lógica do componente
  }, []);
  
  // 5. Handlers
  const handleSave = () => {
    // ...
  };
  
  // 6. Render
  return (
    <div>
      {currentUser && (
        <p>Olá, {currentUser.displayName}! 👋</p>
      )}
      {/* Conteúdo */}
    </div>
  );
};

export default MyTool;
```

---

## 💾 Persistência de Dados

### Hook useLocalStorage

**Padrão oficial para persistência local:**

```javascript
import { useLocalStorage } from '../hooks/useLocalStorage';

const MyComponent = () => {
  // Substitui useState para dados que devem persistir
  const [data, setData] = useLocalStorage('uniqueKey', initialValue);
  
  // Usar como useState normal
  setData({ ...data, newField: 'value' });
};
```

### Convenção de Chaves

```javascript
// ✅ Padrão: nomeDoComponente_tipoDeDado
'billSplitter'              // Componente único
'mealOrganizer_recipes'     // Múltiplos estados
'mealOrganizer_peopleCount'
'mealOrganizer_days'
'recipeCreator'
```

### Quando Usar

```javascript
// ✅ Usar useLocalStorage para:
- Dados de formulários (evitar perda acidental)
- Preferências do usuário
- Estado de ferramentas
- Rascunhos

// ❌ NÃO usar para:
- Dados sensíveis (senhas, tokens)
- Dados temporários de UI (modals abertos, etc)
- Dados que devem ser sempre frescos (do servidor)
```

### Sincronização com Firebase (Futuro)

```javascript
// Padrão futuro: localStorage como fallback
const MyComponent = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useLocalStorage('myData', {});
  
  // Se logado, sincronizar com Firebase
  useEffect(() => {
    if (currentUser) {
      syncWithFirebase(data);
    }
  }, [data, currentUser]);
};
```

---

## 📋 Inputs e Formulários

### Componentes de Input Padrão

**Usar componentes customizados ao invés de inputs nativos:**

```javascript
// ✅ Para valores monetários
import { CurrencyInput } from '../components/CurrencyInput';

<CurrencyInput
  value={value}
  onChange={setValue}
  decimalSeparator=","
  thousandSeparator="."
  prefix="R$ "
  placeholder="Ex: 1.500,00"
/>

// ✅ Para listas de valores
import { CurrencyListInput } from '../components/CurrencyInput';

<CurrencyListInput
  values={values}
  onChange={setValues}
  listSeparator=";"
  showTotal={true}
  placeholder="Ex: 10,50; 20,00; 15,75"
/>
```

### Estilização de Inputs

```javascript
const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  background: var(--bg-color);
  color: var(--text-color);
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
```

### Validação

```javascript
const MyForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação
    if (!email.includes('@')) {
      setError('Email inválido');
      return;
    }
    
    // Processar
    // ...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <button type="submit">Enviar</button>
    </form>
  );
};
```

---

## ✨ Boas Práticas

### Imports

```javascript
// ✅ Ordem de imports
// 1. React e bibliotecas externas
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// 2. Contextos e hooks customizados
import { useAuth } from '../contexts/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

// 3. Componentes
import Button from '../components/Button';
import Card from '../components/Card';

// 4. Utilitários e configurações
import { TOOLS } from '../config/tools';
import { formatCurrency } from '../utils/currency';
```

### Componentização

```javascript
// ✅ Extrair componentes repetidos
const UserCard = ({ user }) => (
  <Card>
    <Avatar src={user.avatar} />
    <Name>{user.name}</Name>
  </Card>
);

// ✅ Usar no componente pai
const UserList = ({ users }) => (
  <Grid>
    {users.map(user => (
      <UserCard key={user.id} user={user} />
    ))}
  </Grid>
);
```

### Performance

```javascript
// ✅ Usar React.memo para componentes pesados
const ExpensiveComponent = React.memo(({ data }) => {
  // Renderização pesada
  return <div>{/* ... */}</div>;
});

// ✅ Usar useCallback para funções passadas como props
const Parent = () => {
  const handleClick = useCallback(() => {
    // ...
  }, []);
  
  return <Child onClick={handleClick} />;
};

// ✅ Usar useMemo para cálculos pesados
const result = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### Acessibilidade

```javascript
// ✅ Usar labels em inputs
<label htmlFor="email">Email:</label>
<input id="email" type="email" />

// ✅ Usar atributos ARIA quando necessário
<button aria-label="Fechar modal" onClick={onClose}>
  ✕
</button>

// ✅ Garantir contraste adequado
const Text = styled.p`
  color: var(--text-color); // Usa variáveis com bom contraste
`;
```

### Tratamento de Erros

```javascript
// ✅ Sempre usar try-catch em operações assíncronas
const fetchData = async () => {
  try {
    const response = await api.get('/data');
    setData(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    setError('Falha ao carregar dados');
  }
};

// ✅ Mostrar feedback ao usuário
{error && <ErrorMessage>{error}</ErrorMessage>}
{loading && <LoadingSpinner />}
```

---

## 🚀 Checklist para Novos Componentes

Antes de criar um novo componente, verifique:

- [ ] Usa `styled-components` para estilização
- [ ] Usa variáveis CSS do `global.css`
- [ ] Segue convenção de nomenclatura (PascalCase)
- [ ] Imports organizados corretamente
- [ ] Usa `useAuth` se precisa de autenticação
- [ ] Usa `useLocalStorage` se precisa persistir dados
- [ ] Componentes reutilizáveis extraídos
- [ ] Responsivo (media queries)
- [ ] Acessível (labels, ARIA)
- [ ] Tratamento de erros implementado

---

## 📚 Exemplos Completos

### Exemplo 1: Página Simples

```javascript
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: var(--card-bg);
  padding: 30px;
  border-radius: 12px;
  box-shadow: var(--shadow);
`;

const MyPage = () => {
  const { currentUser } = useAuth();
  
  return (
    <Container>
      <Title>Minha Página</Title>
      <Card>
        {currentUser ? (
          <p>Olá, {currentUser.displayName}!</p>
        ) : (
          <p>Faça login para continuar</p>
        )}
      </Card>
    </Container>
  );
};

export default MyPage;
```

### Exemplo 2: Componente com Estado Persistente

```javascript
import React from 'react';
import styled from 'styled-components';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CurrencyInput } from '../components/CurrencyInput';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 5px;
`;

const BudgetCalculator = () => {
  const [budget, setBudget] = useLocalStorage('budgetCalculator', {
    income: 0,
    expenses: 0,
  });
  
  const balance = budget.income - budget.expenses;
  
  return (
    <Form>
      <div>
        <Label>Renda:</Label>
        <CurrencyInput
          value={budget.income}
          onChange={(value) => setBudget({ ...budget, income: value })}
          prefix="R$ "
        />
      </div>
      
      <div>
        <Label>Despesas:</Label>
        <CurrencyInput
          value={budget.expenses}
          onChange={(value) => setBudget({ ...budget, expenses: value })}
          prefix="R$ "
        />
      </div>
      
      <p>Saldo: R$ {balance.toFixed(2)}</p>
    </Form>
  );
};

export default BudgetCalculator;
```

---

## 🔄 Migração de Código Legado

### Convertendo CSS para Styled Components

**Antes (CSS):**
```css
/* styles.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  color: #333;
}
```

**Depois (Styled Components):**
```javascript
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--text-color);
`;
```

### Checklist de Migração

- [ ] Identificar todas as classes CSS usadas
- [ ] Criar styled components equivalentes
- [ ] Substituir `className` por componentes styled
- [ ] Trocar cores hardcoded por variáveis CSS
- [ ] Remover import do arquivo CSS
- [ ] Testar funcionalidade
- [ ] Deletar arquivo CSS (se não usado em outro lugar)

---

## 📞 Dúvidas?

Se tiver dúvidas sobre qual padrão seguir:

1. Consulte este guia primeiro
2. Veja exemplos em componentes existentes:
   - [`Home.jsx`](src/pages/Home.jsx) - Exemplo completo
   - [`SectionCard.jsx`](src/components/SectionCard.jsx) - Componente reutilizável
   - [`useAuth`](src/contexts/AuthContext.jsx) - Hook customizado
3. Em caso de dúvida, priorize **consistência** com código existente

---

**Última atualização:** 25/12/2025  
**Mantido por:** Equipe Jeito de Casa
