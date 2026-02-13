import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Button';
import { TextInput, Select } from '../components/Input';
import LoginPrompt from '../components/LoginPrompt';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import unitsData from '../data/units.json';
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
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const AddProductRow = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  align-items: flex-end;
  flex-wrap: wrap;

  .item-name { flex: 2; min-width: 150px; }
  .item-amount { width: 80px; }
  .item-unit { width: 120px; }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    .item-amount, .item-unit { width: 100%; }
  }
`;

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-sm);
  }
`;

const ProductTextContent = styled.div`
  flex: 1;
  font-weight: 500;
  display: flex;
  gap: 8px;
  align-items: baseline;
  color: var(--text-color);
`;

const AmountLabel = styled.span`
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.95rem;
`;

const UnitLabel = styled.span`
  color: var(--text-secondary);
  font-size: 0.85rem;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  background: var(--bg-hover);
`;

const PreferredProducts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const initialData = {
    products: []
  };
  
  const [data, setData, syncStatus] = useFirebaseSync('preferred_products', 'preferred_products_data', initialData, currentUser);
  const [newProduct, setNewProduct] = useState({ name: '', unit: '' });

  if (!currentUser) return <LoginPrompt />;

  const addProduct = (e) => {
    if (e) e.preventDefault();
    if (!newProduct.name.trim()) return;

    const product = {
      id: `pref-${Date.now()}`,
      name: newProduct.name.trim(),
      unit: newProduct.unit
    };

    setData(prev => ({
      ...prev,
      products: [product, ...(prev.products || [])]
    }));
    setNewProduct({ name: '', unit: '' });
  };

  const removeProduct = (productId) => {
    setData(prev => ({
      ...prev,
      products: (prev.products || []).filter(p => p.id !== productId)
    }));
  };

  return (
    <PageContainer>
      <Header>
        <Title>⭐ Produtos Preferidos</Title>
        <HeaderActions>
          <Button onClick={() => navigate('/')} variant="secondary" leftIcon="⬅️">Voltar</Button>
          <SyncStatusIndicator status={syncStatus} />
        </HeaderActions>
      </Header>

      <SectionCard title="Meus Favoritos">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>
          Cadastre os itens que você compra com frequência para importá-los rapidamente em suas listas de compras.
        </p>

        <AddProductRow onSubmit={addProduct}>
          <div className="item-name">
            <TextInput 
              placeholder="Nome do produto (ex: Leite)"
              value={newProduct.name}
              onChange={val => setNewProduct({ ...newProduct, name: val })}
            />
          </div>
          <div className="item-unit">
            <Select 
              placeholder="Unidade"
              value={newProduct.unit}
              onChange={val => setNewProduct({ ...newProduct, unit: val })}
              options={unitsData.map(u => ({ value: u.nome, label: u.sigla }))}
            />
          </div>
          <Button type="submit" variant="primary">Adicionar</Button>
        </AddProductRow>

        <ProductsContainer>
          {(data.products && data.products.length > 0) ? (
            data.products.map(product => (
              <ProductRow key={product.id}>
                <ProductTextContent>
                  <span style={{ flex: 1 }}>{product.name}</span>
                  {product.unit && (
                    <UnitLabel style={{ marginLeft: '4px' }}>{product.unit}</UnitLabel>
                  )}
                </ProductTextContent>
                <Button 
                  variant="ghost" 
                  size="small" 
                  onClick={() => removeProduct(product.id)}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  🗑️
                </Button>
              </ProductRow>
            ))
          ) : (
            <EmptyStateContainer>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>⭐</span>
              Nenhum produto preferido cadastrado ainda.
            </EmptyStateContainer>
          )}
        </ProductsContainer>
      </SectionCard>
    </PageContainer>
  );
};

export default PreferredProducts;
