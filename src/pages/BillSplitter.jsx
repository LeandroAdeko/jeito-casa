import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {DownloadJsonButton, FileUpload } from '../components/Button';
import SectionCard from '../components/SectionCard';
import LoginPrompt from '../components/LoginPrompt';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import { CurrencyInput, CurrencyListInput } from '../components/CurrencyInput';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { useAuth } from '../contexts/AuthContext';
import '../styles/global.css';

const PageContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;

const Card = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  margin-bottom: 20px;
`;

const ResultCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ResultHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;

  h3 { margin: 0; font-size: 1.2rem; }
`;

const ResultSummary = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  
  .label { color: var(--text-secondary); font-size: 0.8rem; }
  .value { font-weight: bold; color: var(--primary-color); font-size: 1rem; }
`;

const DetailsButton = styled.button`
  background: none;
  border: 1px solid var(--border-color);
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-secondary);
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: var(--hover-bg);
    color: var(--text-color);
  }
`;

const ResultDetails = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;

  hr { border: none; border-top: 1px solid var(--border-color); margin: 5px 0; }
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;

  &.highlight { font-weight: 600; color: var(--text-color); }
  &.final { 
    margin-top: 10px;
    font-weight: bold; 
    font-size: 1rem; 
    color: var(--primary-color);
    // padding: 10px;
    background: var(--bg-hover);
    border-radius: 6px;
  }
  
  .negative { color: #d32f2f; }
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label { font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); }

  select {
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-color);
    color: var(--text-color);
    font-family: inherit;
  }
`;

const ContributorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 20px;
`;

const ContributorCard = styled(Card)`
  border-top: 4px solid var(--primary-color);
`;

const ContributorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--text-color);
    padding-bottom: 5px;
    width: 80%;
    
    &:focus { outline: none; border-color: var(--primary-color); }
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
    opacity: 0.5;
    transition: opacity 0.2s;
    &:hover { opacity: 1; }
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 20px;
  background: transparent;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 20px;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: var(--bg-hover);
  }
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;

  h2 { margin: 0; font-size: 1.5rem; }
  
  .collapse-btn {
    background: var(--bg-hover);
    border: 1px solid var(--border-color);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const ResultCard = ({ result, data }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <ResultCardContainer>
      <ResultHeader>
        <h3>{result.nome}</h3>
        <ResultSummary>
          <span className="label">A Transferir:</span>
          <span className="value">{formatCurrency(result.aTransferir)}</span>
        </ResultSummary>
        <DetailsButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Ocultar Detalhes ▲' : 'Ver Detalhes ▼'}
        </DetailsButton>
      </ResultHeader>

      {isExpanded && (
        <ResultDetails>
          <ResultRow>
            <span>Renda Total:</span>
            <span>{formatCurrency(result.rendaBruta)} ({result.porcentagemRenda.toFixed(1)}%)</span>
          </ResultRow>
          <hr />
          <ResultRow>
            <span>Custo Casa:</span>
            <span>+ {formatCurrency(result.contribuicaoCasa)}</span>
          </ResultRow>
          <ResultRow>
            <span>Fatura Compartilhada:</span>
            <span>+ {formatCurrency(result.contribuicaoFaturaCompartilhada)}</span>
          </ResultRow>
          <ResultRow>
            <span>Fatura Individual:</span>
            <span>+ {formatCurrency(result.faturaIndividual)}</span>
          </ResultRow>
          <ResultRow className="highlight">
            <span>Total Contas:</span>
            <span>= {formatCurrency(result.contribuicaoFaturaTotal + result.contribuicaoCasa)}</span>
          </ResultRow>
          <hr />
          <ResultRow>
            <span>Investimento:</span>
            <span>+ {formatCurrency(data.investimento_mes)}</span>
          </ResultRow>
          <ResultRow>
            <span>Abate Benefícios:</span>
            <span className="negative">- {formatCurrency(data.contribuintes.find(c => c.nome === result.nome)?.beneficio || 0)}</span>
          </ResultRow>
          <ResultRow>
            <span>Abate Adiantamentos:</span>
            <span className="negative">- {formatCurrency(data.contribuintes.find(c => c.nome === result.nome)?.adianto_fatura.reduce((a,b)=>a+b,0) || 0)}</span>
          </ResultRow>
          <ResultRow className="final">
            <span>A TRANSFERIR:</span>
            <span>{formatCurrency(result.aTransferir)}</span>
          </ResultRow>
        </ResultDetails>
      )}
    </ResultCardContainer>
  );
};

const BillSplitter = () => {
  // Autenticação
  const { currentUser } = useAuth();
  
  // Sincronização Firebase + localStorage
  const [data, setData, syncStatus] = useFirebaseSync(
    'billSplitter',           // Coleção no Firestore
    'billSplitter',           // Chave localStorage
    {                         // Valor inicial
      custo_casa: 0,
      fatura_total: 0,
      investimento_mes: 0,
      divisao_custo_casa: 'IGUAL',
      divisao_fatura: 'IGUAL',
      contribuintes: [
        {
          nome: 'Pessoa 1',
          salario: 0,
          parte_fatura: [],
          beneficio: 0,
          adianto_fatura: [],
        },
      ],
    },
    currentUser               // Usuário atual
  );

  const [results, setResults] = useState([]);

  // Calculation Logic
  useEffect(() => {
    if (!data.contribuintes.length) return;

    const totalRenda = data.contribuintes.reduce(
      (acc, c) => acc + c.salario + c.beneficio,
      0
    );

    const faturasIndividuaisTotal = data.contribuintes.reduce(
      (acc, c) => acc + c.parte_fatura.reduce((a, b) => a + b, 0),
      0
    );

    const faturaCompartilhada = data.fatura_total - faturasIndividuaisTotal;

    const calculatedResults = data.contribuintes.map((c) => {
      const rendaBruta = c.salario + c.beneficio;
      const faturaIndividual = c.parte_fatura.reduce((a, b) => a + b, 0);
      const adianto = c.adianto_fatura.reduce((a, b) => a + b, 0);

      // Fator Custo Casa
      let fatorCasa = 0;
      if (data.divisao_custo_casa === 'IGUAL') {
        fatorCasa = 1 / data.contribuintes.length;
      } else {
        fatorCasa = totalRenda ? rendaBruta / totalRenda : 0;
      }

      // Fator Fatura
      let fatorFatura = 0;
      if (data.divisao_fatura === 'IGUAL') {
        fatorFatura = 1 / data.contribuintes.length;
      } else {
        fatorFatura = totalRenda ? rendaBruta / totalRenda : 0;
      }

      const contribuicaoCasa = data.custo_casa * fatorCasa;
      const contribuicaoFaturaCompartilhada = faturaCompartilhada * fatorFatura;
      const contribuicaoFaturaTotal =
        contribuicaoFaturaCompartilhada + faturaIndividual;

      const totalSemInvestimento = contribuicaoCasa + contribuicaoFaturaTotal;
      const totalComInvestimento = totalSemInvestimento + data.investimento_mes;
      
      // Valor a transferir = Total - Beneficios (já pagos via VR/VA) - Adiantamentos
      const aTransferir = totalComInvestimento - c.beneficio - adianto;

      return {
        nome: c.nome,
        rendaBruta,
        porcentagemRenda: totalRenda ? (rendaBruta / totalRenda) * 100 : 0,
        contribuicaoCasa,
        contribuicaoFaturaCompartilhada,
        faturaIndividual,
        contribuicaoFaturaTotal,
        totalComInvestimento,
        aTransferir,
      };
    });

    setResults(calculatedResults);
  }, [data]);

  // Handlers
  const handleLoadJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setData(json);
      } catch (error) {
        alert('Erro ao ler arquivo JSON');
      }
    };
    reader.readAsText(file);
  };

  const updateGlobal = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const updateContribuinte = (index, field, value) => {
    const newContribuintes = [...data.contribuintes];
    newContribuintes[index][field] = value;
    setData({ ...data, contribuintes: newContribuintes });
  };


  const addContribuinte = () => {
    setData({
      ...data,
      contribuintes: [
        ...data.contribuintes,
        {
          nome: 'Novo',
          salario: 0,
          parte_fatura: [],
          beneficio: 0,
          adianto_fatura: [],
        },
      ],
    });
  };

  const removeContribuinte = (index) => {
    const newContribuintes = data.contribuintes.filter((_, i) => i !== index);
    setData({ ...data, contribuintes: newContribuintes });
  };

  return (
    <PageContainer>
      <Header>
        <Title>💸 Calculadora de Contas</Title>
        <HeaderActions>
        </HeaderActions>
      </Header>

      <LoginPrompt />

      <SectionCard title="Configurações da Casa">
        <ConfigGrid>
          <FormGroup>
            <label>Custo Fixo da Casa</label>
            <CurrencyInput
              value={data.custo_casa}
              onChange={(value) => updateGlobal('custo_casa', value)}
              decimalSeparator=","
              thousandSeparator="."
              prefix="R$ "
              placeholder="Ex: 1.500,00"
            />
          </FormGroup>
          <FormGroup>
            <label>Fatura Total</label>
            <CurrencyInput
              value={data.fatura_total}
              onChange={(value) => updateGlobal('fatura_total', value)}
              decimalSeparator=","
              thousandSeparator="."
              prefix="R$ "
              placeholder="Ex: 800,00"
            />
          </FormGroup>
          <FormGroup>
            <label>Investimento (p/ pessoa)</label>
            <CurrencyInput
              value={data.investimento_mes}
              onChange={(value) => updateGlobal('investimento_mes', value)}
              decimalSeparator=","
              thousandSeparator="."
              prefix="R$ "
              placeholder="Ex: 500,00"
            />
          </FormGroup>
          <FormGroup>
            <label>Divisão Custo Casa</label>
            <select
              value={data.divisao_custo_casa}
              onChange={(e) => updateGlobal('divisao_custo_casa', e.target.value)}
            >
              <option value="IGUAL">Igual</option>
              <option value="PROPORCIONAL">Proporcional</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Divisão Fatura</label>
            <select
              value={data.divisao_fatura}
              onChange={(e) => updateGlobal('divisao_fatura', e.target.value)}
            >
              <option value="IGUAL">Igual</option>
              <option value="PROPORCIONAL">Proporcional</option>
            </select>
          </FormGroup>
        </ConfigGrid>
      </SectionCard>

      <SectionCard>
        <ContributorsSection 
            data={data} 
            updateContribuinte={updateContribuinte} 
            removeContribuinte={removeContribuinte} 
            addContribuinte={addContribuinte} 
        />
      </SectionCard>

      <SectionCard title="Resultados">
        <ResultsGrid>
          {results.map((r, index) => (
            <ResultCard key={index} result={r} data={data} />
          ))}
        </ResultsGrid>
      </SectionCard>
    </PageContainer>
  );
};



const ContributorsSection = ({ data, updateContribuinte, removeContribuinte, addContribuinte }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div>
      <SectionHeader onClick={() => setIsCollapsed(!isCollapsed)}>
        <h2>Contribuintes</h2>
        <div className="collapse-btn">{isCollapsed ? '▼' : '▲'}</div>
      </SectionHeader>
      
      {!isCollapsed && (
        <>
          <ContributorsGrid>
            {data.contribuintes.map((c, index) => (
              <ContributorCard key={index}>
                <ContributorHeader>
                  <input
                    type="text"
                    value={c.nome}
                    onChange={(e) => updateContribuinte(index, 'nome', e.target.value)}
                  />
                  <button onClick={() => removeContribuinte(index)}>🗑️</button>
                </ContributorHeader>
                
                <ConfigGrid>
                  <FormGroup>
                    <label>Salário Líquido</label>
                    <CurrencyInput
                      value={c.salario}
                      onChange={(value) => updateContribuinte(index, 'salario', value)}
                      decimalSeparator=","
                      thousandSeparator="."
                      prefix="R$ "
                      placeholder="Ex: 5.000,00"
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Benefícios (VA/VR)</label>
                    <CurrencyInput
                      value={c.beneficio}
                      onChange={(value) => updateContribuinte(index, 'beneficio', value)}
                      decimalSeparator=","
                      thousandSeparator="."
                      prefix="R$ "
                      placeholder="Ex: 800,00"
                    />
                  </FormGroup>
                </ConfigGrid>

                <FormGroup style={{ marginTop: '15px' }}>
                  <label>Itens na Fatura (separar por ponto e vírgula)</label>
                  <CurrencyListInput
                    values={c.parte_fatura}
                    onChange={(values) => updateContribuinte(index, 'parte_fatura', values)}
                    decimalSeparator=","
                    thousandSeparator="."
                    listSeparator=";"
                    showTotal={true}
                    placeholder="Ex: 10,50; 20,00; 15,75"
                  />
                </FormGroup>

                <FormGroup style={{ marginTop: '15px' }}>
                  <label>Adiantamentos (separar por ponto e vírgula)</label>
                  <CurrencyListInput
                    values={c.adianto_fatura}
                    onChange={(values) => updateContribuinte(index, 'adianto_fatura', values)}
                    decimalSeparator=","
                    thousandSeparator="."
                    listSeparator=";"
                    placeholder="Ex: 50,00; 100,00"
                  />
                </FormGroup>
              </ContributorCard>
            ))}
          </ContributorsGrid>
          <AddButton onClick={addContribuinte}>+ Adicionar Pessoa</AddButton>
        </>
      )}
    </div>
  );
};

export default BillSplitter;
