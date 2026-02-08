import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import SectionCard from '../components/SectionCard';
import LoginPrompt from '../components/LoginPrompt';
import { Button, CopyButton, DownloadJsonButton, FileUpload } from '../components/Button';
import { TextInput, TextArea, NumberInput } from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import { useRecipes } from '../hooks/useRecipes';
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
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const RecipeCard = styled.div`
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    border-color: var(--primary-color);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: var(--text-color);
  }

  p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const RecipeCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
`;

const PortionsBadge = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;


const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;

const ModeToggle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const IngredientRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;

  input {
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  .qtd { width: 60px; text-align: center; }
  .unit { width: 80px; }
  .name { flex: 1; }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    background: var(--bg-hover);
    padding: 10px;
    border-radius: 8px;
    
    .qtd, .unit { width: 100%; text-align: left; }
  }
`;

const StepRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: flex-start;

  .step-number {
    font-weight: bold;
    min-width: 20px;
    padding-top: 10px;
    color: var(--text-color);
  }

  textarea {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: inherit;
    resize: vertical;
    min-height: 60px;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const FormItem = styled.div`
  margin-bottom: 15px;
`;

const MarkdownPreviewContainer = styled.div`
  line-height: 1.6;
  color: var(--text-color);

  h1, h2, h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: var(--primary-color);
  }

  ul, ol {
    padding-left: 20px;
    margin-bottom: 15px;
  }

  li {
    margin-bottom: 5px;
  }
`;

const RecipeCreator = () => {
  const { currentUser } = useAuth();
  const { recipes, addRecipe, updateRecipe, deleteRecipe, loading } = useRecipes(currentUser);
  
  const [mode, setMode] = useState('list'); // 'list', 'create', 'edit'
  const [editingId, setEditingId] = useState(null);
  
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    portions: '',
    ingredients: [{ amount: '', unit: '', name: '' }],
    steps: ['']
  });

  // Handlers
  const updateField = (field, value) => {
    setRecipe({ ...recipe, [field]: value });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { amount: '', unit: '', name: '' }] });
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const updateStep = (index, value) => {
    const newSteps = [...recipe.steps];
    newSteps[index] = value;
    setRecipe({ ...recipe, steps: newSteps });
  };

  const addStep = () => {
    setRecipe({ ...recipe, steps: [...recipe.steps, ''] });
  };

  const removeStep = (index) => {
    const newSteps = recipe.steps.filter((_, i) => i !== index);
    setRecipe({ ...recipe, steps: newSteps });
  };

  const handleSave = async () => {
    if (!recipe.title.trim()) {
      alert('Por favor, adicione um título para a receita');
      return;
    }

    try {
      if (mode === 'edit' && editingId) {
        await updateRecipe(editingId, recipe);
        alert('Receita atualizada com sucesso! ✅');
      } else {
        await addRecipe(recipe);
        alert('Receita salva com sucesso! ✅');
      }
      
      handleCancel();
    } catch (error) {
      alert('Erro ao salvar receita: ' + error.message);
    }
  };

  const handleEdit = (recipeToEdit) => {
    setRecipe({
      title: recipeToEdit.title,
      description: recipeToEdit.description,
      portions: recipeToEdit.portions,
      ingredients: recipeToEdit.ingredients,
      steps: recipeToEdit.steps
    });
    setEditingId(recipeToEdit.id);
    setMode('edit');
  };

  const handleDelete = async (recipeId, recipeTitle) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${recipeTitle}"?`)) {
      return;
    }

    try {
      await deleteRecipe(recipeId);
      alert('Receita excluída com sucesso! 🗑️');
    } catch (error) {
      alert('Erro ao excluir receita: ' + error.message);
    }
  };

  const handleCancel = () => {
    setRecipe({
      title: '',
      description: '',
      portions: '',
      ingredients: [{ amount: '', unit: '', name: '' }],
      steps: ['']
    });
    setEditingId(null);
    setMode('list');
  };

  const handleLoadJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.ingredients && typeof json.ingredients[0] === 'string') {
          json.ingredients = json.ingredients.map(ing => ({ amount: '', unit: '', name: ing }));
        }
        setRecipe(json);
      } catch (error) {
        alert('Erro ao ler arquivo JSON');
      }
    };
    reader.readAsText(file);
  };

  const generateMarkdown = () => {
    return `
# ${recipe.title || 'Título da Receita'}

**Descrição:** ${recipe.description || 'Sem descrição.'}
**Porções:** ${recipe.portions || 'N/A'}

## Ingredientes
${recipe.ingredients.map(ing => `- ${ing.amount} ${ing.unit} ${ing.name}`.trim()).join('\n')}

## Modo de Preparo
${recipe.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}
    `.trim();
  };

  if (!currentUser) {
    return <LoginPrompt />;
  }

  return (
    <PageContainer>
      <Header>
        <Title>🍳 Criador de Receitas</Title>
        <HeaderActions>
          <ModeToggle>
            <Button 
              variant={mode === 'list' ? 'primary' : 'outline'} 
              onClick={() => setMode('list')}
              fullWidth
            >
              📚 Minhas Receitas ({recipes.length})
            </Button>
            <Button 
              variant={mode === 'create' ? 'primary' : 'outline'} 
              onClick={() => {
                handleCancel();
                setMode('create');
              }}
              fullWidth
            >
              ➕ Nova Receita
            </Button>
          </ModeToggle>

          {mode !== 'list' && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <FileUpload 
                accept=".json" 
                onChange={handleLoadJSON} 
                label="Carregar JSON" 
              />
              <DownloadJsonButton 
                data={recipe} 
                fileName="receita.json" 
                label="💾 Baixar JSON"
              />
            </div>
          )}
        </HeaderActions>
      </Header>

        {mode === 'list' && (
          <>
            {loading ? (
              <EmptyState>
                <h3>Carregando receitas...</h3>
              </EmptyState>
            ) : recipes.length === 0 ? (
              <EmptyState>
                <h3>📖 Nenhuma receita ainda</h3>
                <p>Clique em "Nova Receita" para criar sua primeira receita!</p>
              </EmptyState>
            ) : (
              <RecipeList>
                {recipes.map((r) => (
                  <RecipeCard key={r.id} onClick={() => handleEdit(r)}>
                    <h3>{r.title}</h3>
                    <p>{r.description || 'Sem descrição'}</p>
                    <RecipeCardFooter>
                      <PortionsBadge>🍽️ {r.portions || 'N/A'} porções</PortionsBadge>
                      <CardActions onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost"
                          onClick={() => handleEdit(r)}
                          title="Editar"
                          size="small"
                        >
                          ✏️
                        </Button>
                        <Button 
                          variant="danger"
                          onClick={() => handleDelete(r.id, r.title)}
                          title="Excluir"
                          size="small"
                        >
                          🗑️
                        </Button>
                      </CardActions>
                    </RecipeCardFooter>
                  </RecipeCard>
                ))}
              </RecipeList>
            )}
          </>
        )}

        {(mode === 'create' || mode === 'edit') && (
          <>
            <SectionCard title="Informações Básicas" titleLevel={2}>
              <FormItem>
                <TextInput
                  label="Título da Receita"
                  value={recipe.title}
                  onChange={(value) => updateField('title', value)}
                  placeholder="Ex: Bolo de Chocolate"
                  required
                />
              </FormItem>

              <FormItem>
                <TextArea
                  label="Descrição"
                  value={recipe.description}
                  onChange={(value) => updateField('description', value)}
                  placeholder="Descreva sua receita..."
                  rows={3}
                  maxLength={500}
                  showCharCount
                />
              </FormItem>

              <FormItem>
                <NumberInput
                  label="Porções"
                  value={recipe.portions}
                  onChange={(value) => updateField('portions', value)}
                  min={1}
                  max={100}
                  showButtons
                  placeholder="Ex: 4"
                />
              </FormItem>
            </SectionCard>

            <SectionCard title="Ingredientes" titleLevel={2}>
              {recipe.ingredients.map((ing, index) => (
                <IngredientRow key={index}>
                  <input
                    type="text"
                    className="qtd"
                    placeholder="Qtd"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  />
                  <input
                    type="text"
                    className="unit"
                    placeholder="Unidade"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  />
                  <input
                    type="text"
                    className="name"
                    placeholder="Ingrediente"
                    value={ing.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  />
                  <Button onClick={() => removeIngredient(index)} variant="danger" size="small">
                    Remover
                  </Button>
                </IngredientRow>
              ))}
              <Button onClick={addIngredient} variant="outline" fullWidth leftIcon="+">
                Adicionar Ingrediente
              </Button>
            </SectionCard>

            <SectionCard title="Modo de Preparo" titleLevel={2}>
              {recipe.steps.map((step, index) => (
                <StepRow key={index}>
                  <span className="step-number">{index + 1}.</span>
                  <textarea
                    placeholder={`Passo ${index + 1}`}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    rows={2}
                  />
                  <Button onClick={() => removeStep(index)} variant="danger" size="small">
                    Remover
                  </Button>
                </StepRow>
              ))}
              <Button onClick={addStep} variant="outline" fullWidth leftIcon="+">
                Adicionar Passo
              </Button>
            </SectionCard>

            <FormActions>
              <Button onClick={handleSave} variant="primary" leftIcon="💾">
                {mode === 'edit' ? 'Atualizar Receita' : 'Salvar Receita'}
              </Button>
              <Button onClick={handleCancel} variant="secondary" leftIcon="❌">
                Cancelar
              </Button>
            </FormActions>

            <SectionCard title="Preview Markdown" titleLevel={2}>
              <MarkdownPreviewContainer>
                <ReactMarkdown>{generateMarkdown()}</ReactMarkdown>
              </MarkdownPreviewContainer>
              <CopyButton text={generateMarkdown()} label="Copiar Markdown" />
            </SectionCard>
          </>
        )}
    </PageContainer>
  );
};

export default RecipeCreator;
