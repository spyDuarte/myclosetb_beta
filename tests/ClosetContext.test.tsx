import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClosetProvider, useCloset } from '../mobile/contexts/ClosetContext';
import { Category, Color, Season } from '../src/models';

// Mock do AsyncStorage já está configurado em setup.ts

describe('ClosetContext - Camada de Persistência', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ClosetProvider>{children}</ClosetProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('Inicialização e Carregamento', () => {
    it('deve inicializar com estado vazio quando não há dados no AsyncStorage', async () => {
      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@mycloset:items');
    });

    it('deve carregar itens existentes do AsyncStorage na inicialização', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Camiseta Teste',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: ['casual'],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-01').toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe('Camiseta Teste');
    });

    it('deve converter strings de data para objetos Date ao carregar', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Camiseta',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: false,
          timesWorn: 2,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
          purchaseDate: '2023-12-15T00:00:00.000Z',
          lastWornDate: '2024-01-05T00:00:00.000Z',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const item = result.current.items[0];
      expect(item.createdAt).toBeInstanceOf(Date);
      expect(item.updatedAt).toBeInstanceOf(Date);
      expect(item.purchaseDate).toBeInstanceOf(Date);
      expect(item.lastWornDate).toBeInstanceOf(Date);
    });

    it('deve tratar erro ao carregar dados corrompidos do AsyncStorage', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dados-invalidos-nao-json');

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('deve tratar erro ao carregar dados do AsyncStorage', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Operações CRUD com Persistência', () => {
    it('deve adicionar um item e persistir no AsyncStorage', async () => {
      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let newItem;
      await act(async () => {
        newItem = await result.current.addItem({
          name: 'Novo Item',
          category: Category.TOPS,
          color: Color.BLUE,
          season: [Season.WINTER],
          tags: ['casual'],
        });
      });

      expect(newItem).toBeDefined();
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe('Novo Item');
      expect(AsyncStorage.setItem).toHaveBeenCalled();

      // Verificar que o JSON foi salvo corretamente
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      expect(() => JSON.parse(savedData)).not.toThrow();
    });

    it('deve manter dados existentes ao adicionar novo item', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item Existente',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addItem({
          name: 'Novo Item',
          category: Category.BOTTOMS,
          color: Color.BLACK,
        });
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items.find(i => i.name === 'Item Existente')).toBeDefined();
      expect(result.current.items.find(i => i.name === 'Novo Item')).toBeDefined();
    });

    it('deve atualizar um item e persistir no AsyncStorage', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item Original',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.updateItem('1', {
          name: 'Item Atualizado',
          brand: 'Nike',
        });
      });

      const updatedItem = result.current.items.find(i => i.id === '1');
      expect(updatedItem?.name).toBe('Item Atualizado');
      expect(updatedItem?.brand).toBe('Nike');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('deve deletar um item e persistir no AsyncStorage', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item para deletar',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toHaveLength(1);

      await act(async () => {
        await result.current.deleteItem('1');
      });

      expect(result.current.items).toHaveLength(0);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Operações de Uso e Favoritos', () => {
    it('deve marcar item como usado e persistir', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Camiseta',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.markAsWorn('1');
      });

      const item = result.current.items.find(i => i.id === '1');
      expect(item?.timesWorn).toBe(1);
      expect(item?.lastWornDate).toBeInstanceOf(Date);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('deve permitir múltiplas marcações de uso', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Camiseta',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.markAsWorn('1');
        await result.current.markAsWorn('1');
        await result.current.markAsWorn('1');
      });

      const item = result.current.items.find(i => i.id === '1');
      expect(item?.timesWorn).toBe(3);
    });

    it('deve alternar status de favorito e persistir', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Camiseta',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.toggleFavorite('1');
      });

      let item = result.current.items.find(i => i.id === '1');
      expect(item?.favorite).toBe(true);

      await act(async () => {
        await result.current.toggleFavorite('1');
      });

      item = result.current.items.find(i => i.id === '1');
      expect(item?.favorite).toBe(false);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Busca e Estatísticas', () => {
    it('deve buscar itens usando o serviço subjacente', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Camiseta Branca',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: ['casual'],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jeans Azul',
          category: Category.BOTTOMS,
          color: Color.BLUE,
          season: [Season.ALL_SEASONS],
          tags: ['casual'],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const results = result.current.searchItems({ category: Category.TOPS });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Camiseta Branca');
    });

    it('deve retornar estatísticas corretas', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item 1',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: true,
          timesWorn: 5,
          price: 50,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Item 2',
          category: Category.BOTTOMS,
          color: Color.BLUE,
          season: [Season.WINTER],
          tags: [],
          favorite: false,
          timesWorn: 2,
          price: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const stats = result.current.getStatistics();
      expect(stats.totalItems).toBe(2);
      expect(stats.totalValue).toBe(150);
      expect(stats.favoriteItems).toBe(1);
      expect(stats.averageTimesWorn).toBe(3.5);
    });
  });

  describe('RefreshItems', () => {
    it('deve recarregar itens do AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.items).toHaveLength(0);

      // Simular que novos dados foram salvos no storage
      const newMockItems = [
        {
          id: '1',
          name: 'Novo Item',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(newMockItems));

      await act(async () => {
        await result.current.refreshItems();
      });

      await waitFor(() => {
        expect(result.current.items).toHaveLength(1);
      });

      expect(result.current.items[0].name).toBe('Novo Item');
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erro ao salvar no AsyncStorage', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage full'));

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addItem({
          name: 'Item Teste',
          category: Category.TOPS,
          color: Color.WHITE,
        });
      });

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('deve lançar erro ao usar useCloset fora do Provider', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useCloset());
      }).toThrow('useCloset must be used within a ClosetProvider');

      consoleErrorSpy.mockRestore();
    });

    it('deve retornar null ao tentar atualizar item inexistente', async () => {
      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let updatedItem;
      await act(async () => {
        updatedItem = await result.current.updateItem('id-inexistente', {
          name: 'Teste',
        });
      });

      expect(updatedItem).toBeNull();
    });

    it('deve retornar false ao tentar deletar item inexistente', async () => {
      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.deleteItem('id-inexistente');
      });

      expect(deleteResult).toBe(false);
    });
  });

  describe('Integridade dos Dados Persistidos', () => {
    it('deve serializar e deserializar datas corretamente', async () => {
      const purchaseDate = new Date('2023-12-15');

      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let addedItem;
      await act(async () => {
        addedItem = await result.current.addItem({
          name: 'Item com Data',
          category: Category.TOPS,
          color: Color.WHITE,
          purchaseDate: purchaseDate,
        });
      });

      // Verificar que a data foi salva como string no AsyncStorage
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsedData = JSON.parse(savedData);
      expect(typeof parsedData[0].purchaseDate).toBe('string');
      expect(typeof parsedData[0].createdAt).toBe('string');
      expect(typeof parsedData[0].updatedAt).toBe('string');

      // Simular recarregamento do AsyncStorage
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(savedData);

      await act(async () => {
        await result.current.refreshItems();
      });

      await waitFor(() => {
        const item = result.current.items[0];
        expect(item.purchaseDate).toBeInstanceOf(Date);
        expect(item.createdAt).toBeInstanceOf(Date);
        expect(item.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('deve preservar todos os campos ao persistir', async () => {
      const { result } = renderHook(() => useCloset(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const complexItem = {
        name: 'Item Complexo',
        category: Category.DRESSES,
        color: Color.MULTICOLOR,
        brand: 'Gucci',
        size: 'M',
        price: 599.99,
        purchaseDate: new Date('2024-01-15'),
        season: [Season.SPRING, Season.SUMMER],
        tags: ['formal', 'elegante', 'festa'],
        notes: 'Item especial para ocasiões importantes',
      };

      await act(async () => {
        await result.current.addItem(complexItem);
      });

      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const parsedData = JSON.parse(savedData);
      const savedItem = parsedData[0];

      expect(savedItem.name).toBe(complexItem.name);
      expect(savedItem.category).toBe(complexItem.category);
      expect(savedItem.color).toBe(complexItem.color);
      expect(savedItem.brand).toBe(complexItem.brand);
      expect(savedItem.size).toBe(complexItem.size);
      expect(savedItem.price).toBe(complexItem.price);
      expect(savedItem.season).toEqual(complexItem.season);
      expect(savedItem.tags).toEqual(complexItem.tags);
      expect(savedItem.notes).toBe(complexItem.notes);
    });
  });
});
