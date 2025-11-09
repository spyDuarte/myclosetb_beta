import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // Carregar itens do AsyncStorage na inicialização
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedItems: ClosetItem[] = JSON.parse(storedData);
        // Restaurar itens no serviço
        closetService.clear();
        parsedItems.forEach(item => {
          // Recria o item com as datas corretas
          const itemWithDates = {
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
            lastWornDate: item.lastWornDate ? new Date(item.lastWornDate) : undefined
          };
          // Adiciona diretamente no Map interno (hack, mas funciona)
          (closetService as any).items.set(item.id, itemWithDates);
        });
        setItems(closetService.getAllItems());
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveItems = async (updatedItems: ClosetItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      setItems(updatedItems);
    } catch (error) {
      console.error('Erro ao salvar itens:', error);
    }
  };

  const addItem = async (input: CreateClosetItemInput): Promise<ClosetItem> => {
    const item = closetService.addItem(input);
    await saveItems(closetService.getAllItems());
    return item;
  };

  const updateItem = async (
    id: string,
    updates: UpdateClosetItemInput
  ): Promise<ClosetItem | null> => {
    const item = closetService.updateItem(id, updates);
    if (item) {
      await saveItems(closetService.getAllItems());
    }
    return item;
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    const result = closetService.deleteItem(id);
    if (result) {
      await saveItems(closetService.getAllItems());
    }
    return result;
  };

  const markAsWorn = async (id: string): Promise<ClosetItem | null> => {
    const item = closetService.markAsWorn(id);
    if (item) {
      await saveItems(closetService.getAllItems());
    }
    return item;
  };

  const toggleFavorite = async (id: string): Promise<ClosetItem | null> => {
    const item = closetService.toggleFavorite(id);
    if (item) {
      await saveItems(closetService.getAllItems());
    }
    return item;
  };

  const refreshItems = async () => {
    await loadItems();
  };

  const value: ClosetContextType = {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItemById: (id) => closetService.getItemById(id),
    markAsWorn,
    toggleFavorite,
    searchItems: (filters) => closetService.searchItems(filters),
    getStatistics: () => closetService.getStatistics(),
    refreshItems
  };

  return <ClosetContext.Provider value={value}>{children}</ClosetContext.Provider>;
}

export function useCloset() {
  const context = useContext(ClosetContext);
  if (!context) {
    throw new Error('useCloset must be used within a ClosetProvider');
  }
  return context;
}
