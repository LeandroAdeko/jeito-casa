import React from 'react';
import Modal from './Modal';
import MarkdownPreview from './MarkdownPreview';
import { Button } from './Button';

const RecipeModal = ({ isOpen, onClose, recipe }) => {
  if (!recipe) return null;

  const generateMarkdown = () => {
    return `
# ${recipe.title}

**Descrição:** ${recipe.description || 'Sem descrição.'}
**Porções:** ${recipe.portions || 'N/A'}

## Ingredientes
${recipe.ingredients?.map(ing => `- ${ing.amount} ${ing.unit} ${ing.name}`.trim()).join('\n') || 'Nenhum ingrediente listado.'}

## Modo de Preparo
${recipe.steps?.map((step, index) => `${index + 1}. ${step}`).join('\n') || 'Nenhum passo listado.'}
    `.trim();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={recipe.title}
      footer={
        <Button onClick={onClose} variant="secondary">
          Fechar
        </Button>
      }
    >
      <MarkdownPreview content={generateMarkdown()} />
    </Modal>
  );
};

export default RecipeModal;
