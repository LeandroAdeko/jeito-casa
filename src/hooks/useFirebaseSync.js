import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

/**
 * Hook para sincronizar estado com Firebase Firestore
 * Combina localStorage (offline) com Firebase (online/multi-device)
 * 
 * @param {string} collectionName - Nome da coleção no Firestore
 * @param {string} localStorageKey - Chave do localStorage
 * @param {any} initialValue - Valor inicial
 * @param {Object} currentUser - Usuário atual do useAuth
 * @returns {[any, Function, Object]} - [valor, setter, status]
 */
export function useFirebaseSync(collectionName, localStorageKey, initialValue, currentUser) {
  // Estado local
  const [value, setValue] = useState(() => {
    // Tentar carregar do localStorage primeiro
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(localStorageKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao carregar ${localStorageKey} do localStorage:`, error);
      return initialValue;
    }
  });

  // Status da sincronização
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSyncTime: null,
    error: null,
    isOnline: currentUser ? true : false,
  });

  // Carregar dados do Firebase quando usuário logar
  useEffect(() => {
    if (!currentUser) {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      return;
    }

    setSyncStatus(prev => ({ ...prev, isOnline: true, isSyncing: true }));

    const loadFromFirebase = async () => {
      try {
        const docRef = doc(db, collectionName, currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const firebaseData = docSnap.data();
          setValue(firebaseData);
          
          // Atualizar localStorage também
          window.localStorage.setItem(localStorageKey, JSON.stringify(firebaseData));
          
          setSyncStatus(prev => ({
            ...prev,
            isSyncing: false,
            lastSyncTime: new Date(),
            error: null,
          }));
        } else {
          // Documento não existe no Firebase, usar dados locais
          setSyncStatus(prev => ({
            ...prev,
            isSyncing: false,
            lastSyncTime: new Date(),
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar do Firebase:', error);
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          error: 'Erro ao carregar dados da nuvem',
        }));
      }
    };

    loadFromFirebase();

    // Listener em tempo real (opcional - descomente se quiser sync em tempo real)
    // const docRef = doc(db, collectionName, currentUser.uid);
    // const unsubscribe = onSnapshot(docRef, (doc) => {
    //   if (doc.exists()) {
    //     setValue(doc.data());
    //     window.localStorage.setItem(localStorageKey, JSON.stringify(doc.data()));
    //   }
    // });
    // return unsubscribe;
  }, [currentUser, collectionName, localStorageKey]);

  // Salvar no Firebase quando dados mudarem
  useEffect(() => {
    if (!currentUser || !value) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    const saveToFirebase = async () => {
      try {
        const docRef = doc(db, collectionName, currentUser.uid);
        await setDoc(docRef, value);
        
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          lastSyncTime: new Date(),
          error: null,
        }));
      } catch (error) {
        console.error('Erro ao salvar no Firebase:', error);
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          error: 'Erro ao salvar na nuvem',
        }));
      }
    };

    // Debounce: aguardar 1 segundo após última mudança
    const timeoutId = setTimeout(saveToFirebase, 1000);
    return () => clearTimeout(timeoutId);
  }, [value, currentUser, collectionName]);

  // Função setter que também atualiza localStorage
  const setValueAndSync = (newValue) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    
    // Salvar no localStorage imediatamente
    try {
      window.localStorage.setItem(localStorageKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  return [value, setValueAndSync, syncStatus];
}

