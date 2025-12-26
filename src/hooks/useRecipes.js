import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  or,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

/**
 * Hook para gerenciar CRUD de receitas no Firestore
 * @param {Object} currentUser - Usuário autenticado do useAuth
 * @param {Object} options - Opções de busca { includePublic: boolean }
 * @returns {Object} - { recipes, addRecipe, updateRecipe, deleteRecipe, loading, error }
 */
export function useRecipes(currentUser, options = { includePublic: false }) {
  const { includePublic = false } = options;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar receitas do usuário em tempo real
  useEffect(() => {
    if (!currentUser) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para buscar receitas
    let q;
    if (currentUser) {
      if (includePublic) {
        // Usuário logado + Públicas
        q = query(
          collection(db, 'recipes'),
          or(
            where('userId', '==', currentUser.uid), 
            where('userId', '==', null),
            where('userId', '==', '')
          )
        );
      } else {
        // Apenas do usuário logado
        q = query(
          collection(db, 'recipes'),
          where('userId', '==', currentUser.uid)
        );
      }
    } else {
      // Apenas públicas (sempre incluídas se não houver usuário)
      q = query(
        collection(db, 'recipes'),
        or(
          where('userId', '==', null),
          where('userId', '==', '')
        )
      );
    }

    // Listener em tempo real
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const recipesData = [];
        querySnapshot.forEach((doc) => {
          recipesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Ordenar por data de criação (mais recente primeiro)
        recipesData.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(0);
          const dateB = b.createdAt?.toDate() || new Date(0);
          return dateB - dateA;
        });
        
        setRecipes(recipesData);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar receitas:', err);
        setError('Erro ao carregar receitas');
        setLoading(false);
      }
    );

    // Cleanup: cancelar listener quando componente desmontar
    return () => unsubscribe();
  }, [currentUser]);

  /**
   * Adicionar nova receita
   * @param {Object} recipeData - Dados da receita
   * @returns {Promise<string>} - ID da receita criada
   */
  const addRecipe = async (recipeData) => {
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const docRef = await addDoc(collection(db, 'recipes'), {
        ...recipeData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (err) {
      console.error('Erro ao adicionar receita:', err);
      throw new Error('Erro ao salvar receita');
    }
  };

  /**
   * Atualizar receita existente
   * @param {string} recipeId - ID da receita
   * @param {Object} recipeData - Novos dados da receita
   */
  const updateRecipe = async (recipeId, recipeData) => {
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, {
        ...recipeData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Erro ao atualizar receita:', err);
      throw new Error('Erro ao atualizar receita');
    }
  };

  /**
   * Deletar receita
   * @param {string} recipeId - ID da receita
   */
  const deleteRecipe = async (recipeId) => {
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await deleteDoc(recipeRef);
    } catch (err) {
      console.error('Erro ao deletar receita:', err);
      throw new Error('Erro ao deletar receita');
    }
  };

  return {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    loading,
    error
  };
}
