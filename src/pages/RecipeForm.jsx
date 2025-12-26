import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import SectionCard from '../components/SectionCard';
import LoginPrompt from '../components/LoginPrompt';
import { Button, CopyButton } from '../components/Button';
import { TextInput, TextArea, NumberInput, Select } from '../components/Input';
import MarkdownPreview from '../components/MarkdownPreview';
import { useAuth } from '../contexts/AuthContext';
import { useRecipes } from '../hooks/useRecipes';
import unitsData from '../data/units.json';
import '../styles/global.css';
import '../styles/recipe-creator.css';

const StepRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;

  .step-input {
    flex: 1;
  }
`;

const RecipeForm = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { recipes, addRecipe, updateRecipe } = useRecipes(currentUser);
  
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    portions: '',
    ingredients: [{ amount: '', unit: '', name: '' }],
    steps: ['']
  });

  const [loading, setLoading] = useState(false);

  // Carregar receita para edição
  useEffect(() => {
    if (recipeId && recipes.length > 0) {
      const recipeToEdit = recipes.find(r => r.id === recipeId);
      if (recipeToEdit) {
        setRecipe({
          title: recipeToEdit.title,
          description: recipeToEdit.description,
          portions: recipeToEdit.portions,
          ingredients: recipeToEdit.ingredients,
          steps: recipeToEdit.steps
        });
      }
    }
  }, [recipeId, recipes]);

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

    setLoading(true);
    try {
      if (recipeId) {
        await updateRecipe(recipeId, recipe);
        alert('Receita atualizada com sucesso! ✅');
      } else {
        await addRecipe(recipe);
        alert('Receita salva com sucesso! ✅');
      }
      
      navigate('/recipes');
    } catch (error) {
      alert('Erro ao salvar receita: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/recipes');
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
    <div className="recipe-creator">
      {/* Header com título e ações */}
      <SectionCard 
        title={recipeId ? "Editar Receita" : "Nova Receita"}
        titleLevel={1}
        className="header-actions"
        actions={
          <>
            <Button 
              onClick={handleCancel} 
              variant="secondary"
              leftIcon="❌"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              variant="primary"
              loading={loading}
              leftIcon="💾"
            >
              {recipeId ? 'Atualizar Receita' : 'Salvar Receita'}
            </Button>
          </>
        }
      />

      {/* Informações Básicas */}
      <SectionCard title="Informações Básicas" titleLevel={2}>
        <div className="form-group">
          <TextInput
            label="Título da Receita"
            value={recipe.title}
            onChange={(value) => updateField('title', value)}
            placeholder="Ex: Bolo de Chocolate"
            required
          />
        </div>

        <div className="form-group">
          <TextArea
            label="Descrição"
            value={recipe.description}
            onChange={(value) => updateField('description', value)}
            placeholder="Descreva sua receita..."
            rows={3}
            maxLength={500}
            showCharCount
          />
        </div>

        <div className="form-group">
          <NumberInput
            label="Porções"
            value={recipe.portions}
            onChange={(value) => updateField('portions', value)}
            min={1}
            max={100}
            showButtons
            placeholder="Ex: 4"
          />
        </div>
      </SectionCard>

      {/* Ingredientes */}
      <SectionCard title="Ingredientes" titleLevel={2}>
        {recipe.ingredients.map((ing, index) => (
          <div key={index} className="ingredient-row" style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'flex-end' }}>
            <div style={{ width: '80px' }}>
              <TextInput
                label={index === 0 ? "Qtd" : ""}
                placeholder="Qtd"
                value={ing.amount}
                onChange={(value) => updateIngredient(index, 'amount', value)}
              />
            </div>
            <div style={{ width: '150px' }}>
              <Select
                label={index === 0 ? "Unidade" : ""}
                placeholder="Unidade"
                value={ing.unit}
                onChange={(value) => updateIngredient(index, 'unit', value)}
                options={unitsData.map(u => ({ value: u.nome, label: u.sigla }))}
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextInput
                label={index === 0 ? "Ingrediente" : ""}
                placeholder="Ingrediente"
                value={ing.name}
                onChange={(value) => updateIngredient(index, 'name', value)}
              />
            </div>
            <Button 
              onClick={() => removeIngredient(index)} 
              variant="danger" 
              size="small"
              style={{ marginBottom: '4px' }}
            >
              Remover
            </Button>
          </div>
        ))}
        <Button onClick={addIngredient} variant="outline" fullWidth leftIcon="+">
          Adicionar Ingrediente
        </Button>
      </SectionCard>

      {/* Modo de Preparo */}
      <SectionCard title="Modo de Preparo" titleLevel={2}>
        {recipe.steps.map((step, index) => (
          <StepRow key={index}>
            <div className="step-input">
              <TextArea
                label={`Passo ${index + 1}`}
                placeholder={`Descreva o passo ${index + 1}...`}
                value={step}
                onChange={(value) => updateStep(index, value)}
                rows={2}
              />
            </div>
            <Button onClick={() => removeStep(index)} variant="danger" size="small">
              Remover
            </Button>
          </StepRow>
        ))}
        <Button onClick={addStep} variant="outline" fullWidth leftIcon="+">
          Adicionar Passo
        </Button>
      </SectionCard>

      {/* Preview Markdown */}
      <SectionCard 
        title="Preview Markdown" 
        titleLevel={2}
        actions={
          <CopyButton 
            text={generateMarkdown()} 
            leftIcon="📋"
            label="Copiar Markdown" 
          />
        }
      >
        <MarkdownPreview content={generateMarkdown()} />
      </SectionCard>
    </div>
  );
};

export default RecipeForm;
