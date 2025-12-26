import React, { useState, useEffect } from 'react';
import {DownloadJsonButton, FileUpload } from '../components/Button';
import SectionCard from '../components/SectionCard';
import LoginPrompt from '../components/LoginPrompt';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import { CurrencyInput, CurrencyListInput } from '../components/CurrencyInput';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { useAuth } from '../contexts/AuthContext';
import '../styles/global.css';
import '../styles/bill-splitter.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const ResultCard = ({ result, data }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="card result-card">
      <div className="result-header">
        <h3>{result.nome}</h3>
        <div className="result-summary">
          <span className="summary-label">A Transferir:</span>
          <span className="summary-value">{formatCurrency(result.aTransferir)}</span>
        </div>
        <button 
          className="btn-details" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Ocultar Detalhes ▲' : 'Ver Detalhes ▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="result-details">
          <div className="result-row">
            <span>Renda Total:</span>
            <span>{formatCurrency(result.rendaBruta)} ({result.porcentagemRenda.toFixed(1)}%)</span>
          </div>
          <hr />
          <div className="result-row">
            <span>Custo Casa:</span>
            <span>+ {formatCurrency(result.contribuicaoCasa)}</span>
          </div>
          <div className="result-row">
            <span>Fatura Compartilhada:</span>
            <span>+ {formatCurrency(result.contribuicaoFaturaCompartilhada)}</span>
          </div>
          <div className="result-row">
            <span>Fatura Individual:</span>
            <span>+ {formatCurrency(result.faturaIndividual)}</span>
          </div>
          <div className="result-row highlight">
            <span>Total Contas:</span>
            <span>= {formatCurrency(result.contribuicaoFaturaTotal + result.contribuicaoCasa)}</span>
          </div>
          <hr />
          <div className="result-row">
            <span>Investimento:</span>
            <span>+ {formatCurrency(data.investimento_mes)}</span>
          </div>
          <div className="result-row">
            <span>Abate Benefícios:</span>
            <span className="negative">- {formatCurrency(data.contribuintes.find(c => c.nome === result.nome)?.beneficio || 0)}</span>
          </div>
          <div className="result-row">
            <span>Abate Adiantamentos:</span>
            <span className="negative">- {formatCurrency(data.contribuintes.find(c => c.nome === result.nome)?.adianto_fatura.reduce((a,b)=>a+b,0) || 0)}</span>
          </div>
          <div className="result-row final">
            <span>A TRANSFERIR:</span>
            <span>{formatCurrency(result.aTransferir)}</span>
          </div>
        </div>
      )}
    </div>
  );
};


const BillSplitter = () => {
  // Autenticação
  const { currentUser } = useAuth();
  
  // Sincronização Firebase + localStorage
  // Dados salvos localmente E na nuvem quando usuário está logado
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
        // Basic validation could go here
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
    <div className="bill-splitter">
      <SectionCard 
        title="Calculadora de Contas" 
        titleLevel={1}
        className="header-actions"
        actions={
          <>
            <SyncStatusIndicator syncStatus={syncStatus} />
            <FileUpload 
              accept=".json" 
              onChange={handleLoadJSON} 
              label="Carregar Conta" 
            />
            <DownloadJsonButton 
              data={data} 
              fileName="calculo_casa.json" 
              label="💾 Baixar Conta"
            />
          </>
        }
      />

      <LoginPrompt />

      <SectionCard title="Configurações da Casa" className="config-section">
        <div className="config-row">
          <div className="form-group">
            <label>Custo Fixo da Casa</label>
            <CurrencyInput
              value={data.custo_casa}
              onChange={(value) => updateGlobal('custo_casa', value)}
              decimalSeparator=","
              thousandSeparator="."
              prefix="R$ "
              placeholder="Ex: 1.500,00"
            />
          </div>
          <div className="form-group">
            <label>Fatura Total</label>
            <CurrencyInput
              value={data.fatura_total}
              onChange={(value) => updateGlobal('fatura_total', value)}
              decimalSeparator=","
              thousandSeparator="."
              prefix="R$ "
              placeholder="Ex: 800,00"
            />
          </div>
          <div className="form-group">
            <label>Investimento (p/ pessoa)</label>
            <CurrencyInput
              value={data.investimento_mes}
              onChange={(value) => updateGlobal('investimento_mes', value)}
              decimalSeparator=","
              thousandSeparator="."
              prefix="R$ "
              placeholder="Ex: 500,00"
            />
          </div>
          <div className="form-group">
            <label>Divisão Custo Casa</label>
            <select
              value={data.divisao_custo_casa}
              onChange={(e) => updateGlobal('divisao_custo_casa', e.target.value)}
            >
              <option value="IGUAL">Igual</option>
              <option value="PROPORCIONAL">Proporcional</option>
            </select>
          </div>
          <div className="form-group">
            <label>Divisão Fatura</label>
            <select
              value={data.divisao_fatura}
              onChange={(e) => updateGlobal('divisao_fatura', e.target.value)}
            >
              <option value="IGUAL">Igual</option>
              <option value="PROPORCIONAL">Proporcional</option>
            </select>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <ContributorsSection 
            data={data} 
            updateContribuinte={updateContribuinte} 
            removeContribuinte={removeContribuinte} 
            addContribuinte={addContribuinte} 
        />
      </SectionCard>

      <SectionCard title="Resultados" className="results-section">
        <div className="results-grid">
          {results.map((r, index) => (
            <ResultCard key={index} result={r} data={data} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
};



const ContributorsSection = ({ data, updateContribuinte, removeContribuinte, addContribuinte }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="contributors-section-wrapper">
      <div className="section-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <h2>Contribuintes</h2>
        <button className="btn-collapse">{isCollapsed ? '▼' : '▲'}</button>
      </div>
      
      {!isCollapsed && (
        <div className="contributors-grid">
          {data.contribuintes.map((c, index) => (
            <div key={index} className="card contributor-card">
              <div className="card-header">
                <input
                  type="text"
                  value={c.nome}
                  onChange={(e) => updateContribuinte(index, 'nome', e.target.value)}
                  className="input-name"
                />
                <button onClick={() => removeContribuinte(index)} className="btn-remove">🗑️</button>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Salário Líquido</label>
                  <CurrencyInput
                    value={c.salario}
                    onChange={(value) => updateContribuinte(index, 'salario', value)}
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    placeholder="Ex: 5.000,00"
                  />
                </div>
                <div className="form-group">
                  <label>Benefícios (VA/VR)</label>
                  <CurrencyInput
                    value={c.beneficio}
                    onChange={(value) => updateContribuinte(index, 'beneficio', value)}
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    placeholder="Ex: 800,00"
                  />
                </div>
              </div>

              <div className="form-group">
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
              </div>

              <div className="form-group">
                <label>Adiantamentos (separar por ponto e vírgula)</label>
                <CurrencyListInput
                  values={c.adianto_fatura}
                  onChange={(values) => updateContribuinte(index, 'adianto_fatura', values)}
                  decimalSeparator=","
                  thousandSeparator="."
                  listSeparator=";"
                  placeholder="Ex: 50,00; 100,00"
                />
              </div>
            </div>
          ))}
          <button onClick={addContribuinte} className="btn-add">+ Adicionar Pessoa</button>
        </div>
      )}
    </div>
  );
};

export default BillSplitter;
