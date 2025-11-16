import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClosetService } from '../../src/services/ClosetService';
import {
  ClosetItem,
  CreateClosetItemInput,
  UpdateClosetItemInput,
  ClosetItemFilters
} from '../../src/models';

interface ClosetContextType {
  items: ClosetItem[];
  loading: boolean;
  addItem: (input: CreateClosetItemInput) => Promise<ClosetItem>;
  updateItem: (id: string, updates: UpdateClosetItemInput) => Promise<ClosetItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  getItemById: (id: string) => ClosetItem | undefined;
  markAsWorn: (id: string) => Promise<ClosetItem | null>;
  toggleFavorite: (id: string) => Promise<ClosetItem | null>;
  searchItems: (filters: ClosetItemFilters) => ClosetItem[];
  getStatistics: () => ReturnType<ClosetService['getStatistics']>;
  refreshItems: () => Promise<void>;
}

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

const STORAGE_KEY = '@mycloset:items';

export function ClosetProvider({ children }: { children: ReactNode }) {
  const [closetService] = useState(() => new ClosetService());
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar itens do AsyncStorage na inicialização
  useEffect(() => {
    let cancelled = false;

    const initializeItems = async () => {
      try {
        setLoading(true);
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;

        if (storedData) {
          const parsedItems: ClosetItem[] = JSON.parse(storedData);
          const itemsWithDates = parsedItems.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
            lastWornDate: item.lastWornDate ? new Date(item.lastWornDate) : undefined
          }));
          closetService.loadItems(itemsWithDates);
          if (!cancelled) setItems(closetService.getAllItems());
        }
      } catch (error) {
        if (!cancelled) console.error('Erro ao carregar itens:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initializeItems();

    return () => {
      cancelled = true;
      // Limpar timeout pendente ao desmontar
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedItems: ClosetItem[] = JSON.parse(storedData);
        // Restaurar itens no serviço com datas deserializadas
        const itemsWithDates = parsedItems.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
          lastWornDate: item.lastWornDate ? new Date(item.lastWornDate) : undefined
        }));
        closetService.loadItems(itemsWithDates);
        setItems(closetService.getAllItems());
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveItems = useCallback(async (updatedItems: ClosetItem[]) => {
    // Atualizar estado imediatamente
    setItems(updatedItems);

    // Debounce da escrita no AsyncStorage
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      } catch (error) {
        console.error('Erro ao salvar itens:', error);
      }
    }, 500); // Aguardar 500ms de inatividade antes de salvar
  }, []);

  const addItem = useCallback(async (input: CreateClosetItemInput): Promise<ClosetItem> => {
    const item = closetService.addItem(input);
    try {
      await saveItems(closetService.getAllItems());
      return item;
    } catch (error) {
      // Rollback: remover item se save falhou
      closetService.deleteItem(item.id);
      setItems(closetService.getAllItems());
      throw new Error('Não foi possível salvar o item. Verifique o espaço disponível.');
    }
  }, [closetService, saveItems]);

  const updateItem = useCallback(async (
    id: string,
    updates: UpdateClosetItemInput
  ): Promise<ClosetItem | null> => {
    const originalItem = closetService.getItemById(id);
    const updatedItem = closetService.updateItem(id, updates);
    if (updatedItem) {
      try {
        await saveItems(closetService.getAllItems());
        return updatedItem;
      } catch (error) {
        // Rollback: restaurar item original
        if (originalItem) {
          closetService.loadItems([...closetService.getAllItems().filter(i => i.id !== id), originalItem]);
          setItems(closetService.getAllItems());
        }
        throw new Error('Não foi possível atualizar o item.');
      }
    }
    return null;
  }, [closetService, saveItems]);

  const deleteItem = useCallback(async (id: string): Promise<boolean> => {
    const deletedItem = closetService.getItemById(id);
    const result = closetService.deleteItem(id);
    if (result) {
      try {
        await saveItems(closetService.getAllItems());
        return true;
      } catch (error) {
        // Rollback: restaurar item deletado
        if (deletedItem) {
          closetService.loadItems([...closetService.getAllItems(), deletedItem]);
          setItems(closetService.getAllItems());
        }
        throw new Error('Não foi possível remover o item.');
      }
    }
    return false;
  }, [closetService, saveItems]);

  const markAsWorn = useCallback(async (id: string): Promise<ClosetItem | null> => {
    const originalItem = closetService.getItemById(id);
    const item = closetService.markAsWorn(id);
    if (item) {
      try {
        await saveItems(closetService.getAllItems());
        return item;
      } catch (error) {
        // Rollback: restaurar item original
        if (originalItem) {
          closetService.loadItems([...closetService.getAllItems().filter(i => i.id !== id), originalItem]);
          setItems(closetService.getAllItems());
        }
        throw new Error('Não foi possível marcar o item como usado.');
      }
    }
    return null;
  }, [closetService, saveItems]);

  const toggleFavorite = useCallback(async (id: string): Promise<ClosetItem | null> => {
    const originalItem = closetService.getItemById(id);
    const item = closetService.toggleFavorite(id);
    if (item) {
      try {
        await saveItems(closetService.getAllItems());
        return item;
      } catch (error) {
        // Rollback: restaurar item original
        if (originalItem) {
          closetService.loadItems([...closetService.getAllItems().filter(i => i.id !== id), originalItem]);
          setItems(closetService.getAllItems());
        }
        throw new Error('Não foi possível atualizar favorito.');
      }
    }
    return null;
  }, [closetService, saveItems]);

  const refreshItems = useCallback(async () => {
    await loadItems();
  }, []);

  const getItemById = useCallback((id: string) => closetService.getItemById(id), [closetService]);
  const searchItems = useCallback((filters: ClosetItemFilters) => closetService.searchItems(filters), [closetService]);
  const getStatistics = useCallback(() => closetService.getStatistics(), [closetService]);

  const value: ClosetContextType = useMemo(() => ({
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    markAsWorn,
    toggleFavorite,
    searchItems,
    getStatistics,
    refreshItems
  }), [items, loading, addItem, updateItem, deleteItem, getItemById, markAsWorn, toggleFavorite, searchItems, getStatistics, refreshItems]);

  return <ClosetContext.Provider value={value}>{children}</ClosetContext.Provider>;
}

export function useCloset() {
  const context = useContext(ClosetContext);
  if (!context) {
    throw new Error('useCloset must be used within a ClosetProvider');
  }
  return context;
}
