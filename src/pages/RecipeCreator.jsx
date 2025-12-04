import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CopyButton from '../components/CopyButton';
import SectionCard from '../components/SectionCard';
import DownloadJsonButton from '../components/DownloadJsonButton';
import LoginPrompt from '../components/LoginPrompt';
import FileUpload from '../components/FileUpload';
import '../styles/global.css';
import '../styles/recipe-creator.css';

const RecipeCreator = () => {
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

  const handleLoadJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        // Basic migration for old string-only ingredients if needed
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

  // Markdown Generation
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

  return (
    <div className="recipe-creator">
      <SectionCard 
        title="Criador de Receitas" 
        titleLevel={1}
        className="recipe-header-actions"
        actions={
          <>
            <FileUpload 
              accept=".json" 
              onChange={handleLoadJSON} 
              label="Carregar Receita"
            />
            <DownloadJsonButton 
              data={recipe} 
              fileName={recipe.title ? recipe.title.toLowerCase().replace(/\s+/g, '-') : 'receita'} 
            />
          </>
        }
      />

      <LoginPrompt />

      <SectionCard title="Informações Básicas">
        <div className="basic-info-grid">
          <div className="info-row-top">
            <input
              type="text"
              className="input-title"
              value={recipe.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Título da Receita"
            />
            <input
              type="number"
              className="input-portions"
              value={recipe.portions}
              onChange={(e) => updateField('portions', e.target.value)}
              placeholder="Porções"
            />
          </div>
          <textarea
            className="input-description"
            value={recipe.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Descrição"
          />
        </div>
      </SectionCard>

      <div className="recipe-form-grid">
        <SectionCard title="Ingredientes">
          <div className="ingredients-list">
            {recipe.ingredients.map((ing, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="number"
                  className="ing-amount"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  placeholder="Qtd"
                />
                <select
                  className="ing-unit"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                >
                  <option value="unidade">un</option>
                  <option value="grama">g</option>
                  <option value="quilograma">kg</option>
                  <option value="mililitro">ml</option>
                  <option value="litro">L</option>
                  <option value="caixa">cx</option>
                  <option value="pacote">pct</option>
                  <option value="lata">lata</option>
                  <option value="xicara">xic</option>
                  <option value="colher de sopa">csp</option>
                  <option value="colher de chá">cch</option>
                </select>
                <input
                  type="text"
                  className="ing-name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="Ingrediente"
                />
                <button onClick={() => removeIngredient(index)} className="btn-icon">🗑️</button>
              </div>
            ))}
          </div>
          <button onClick={addIngredient} className="btn-add-item">+ Adicionar Ingrediente</button>
        </SectionCard>

        <SectionCard title="Modo de Preparo">
          <div className="steps-list">
            {recipe.steps.map((step, index) => (
              <div key={index} className="step-row">
                <span className="step-number">{index + 1}.</span>
                <textarea
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Passo ${index + 1}`}
                />
                <button onClick={() => removeStep(index)} className="btn-icon">🗑️</button>
              </div>
            ))}
          </div>
          <button onClick={addStep} className="btn-add-item">+ Adicionar Passo</button>
        </SectionCard>
      </div>

      <SectionCard 
        title="Visualização" 
        className="output-section"
        actions={
          <CopyButton 
            text={generateMarkdown} 
            label="Copiar Markdown" 
            className="btn-copy"
          />
        }
      >
        <div className="output-content">
          <div className="markdown-preview">
            <ReactMarkdown>{generateMarkdown()}</ReactMarkdown>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default RecipeCreator;
