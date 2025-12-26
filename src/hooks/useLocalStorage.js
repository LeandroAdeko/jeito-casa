import { useState, useEffect } from 'react';

/**
 * Hook customizado para persistir estado no localStorage
 * @param {string} key - Chave única para armazenar no localStorage
 * @param {any} initialValue - Valor inicial caso não exista no localStorage
 * @returns {[any, Function]} - [valor, função para atualizar]
 */
export function useLocalStorage(key, initialValue) {
  // Estado para armazenar o valor
  // Passa uma função de inicialização para useState para que a leitura do localStorage
  // aconteça apenas uma vez
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Tenta recuperar do localStorage
      const item = window.localStorage.getItem(key);
      
      // Se existir, parseia o JSON, senão retorna o valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor
  const setValue = (value) => {
    try {
      // Permite que value seja uma função (como setState do React)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salva no estado
      setStoredValue(valueToStore);
      
      // Salva no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook para limpar dados do localStorage
 * @param {string} key - Chave para remover
 */
export function useClearLocalStorage(key) {
  return () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Erro ao limpar ${key} do localStorage:`, error);
    }
  };
}
