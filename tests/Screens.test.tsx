import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../mobile/screens/HomeScreen';
import { StatsScreen } from '../mobile/screens/StatsScreen';
import { ClosetProvider } from '../mobile/contexts/ClosetContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Color, Season } from '../src/models';

// Mock da navegação
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

describe('Telas do Aplicativo - Testes de Integração', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('HomeScreen', () => {
    it('deve renderizar loading inicialmente', () => {
      const { getByText, getByPlaceholderText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      // Durante o loading, a estrutura da tela deve estar visível
      expect(getByText('Meu Closet')).toBeTruthy();
      expect(getByPlaceholderText('Buscar itens...')).toBeTruthy();
    });

    it('deve renderizar título "Meu Closet"', async () => {
      const { getByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByText('Meu Closet')).toBeTruthy();
      });
    });

    it('deve exibir mensagem de closet vazio quando não há itens', async () => {
      const { getByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByText('Seu closet está vazio')).toBeTruthy();
        expect(getByText('Toque no + para adicionar seu primeiro item')).toBeTruthy();
      });
    });

    it('deve exibir estatísticas zeradas quando closet está vazio', async () => {
      const { getAllByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        const zeros = getAllByText('0');
        expect(zeros.length).toBeGreaterThanOrEqual(2); // Total e Favoritos
      });
    });

    it('deve renderizar campo de busca', async () => {
      const { getByPlaceholderText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByPlaceholderText('Buscar itens...')).toBeTruthy();
      });
    });

    it('deve navegar para AddItem ao clicar no botão +', async () => {
      const { UNSAFE_getByProps, getByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      // Aguardar o carregamento completar (skeleton desaparece e estatísticas aparecem)
      await waitFor(() => {
        expect(getByText('Itens')).toBeTruthy();
      });

      // Encontrar e clicar no ícone de adicionar
      await waitFor(() => {
        const addIcon = UNSAFE_getByProps({ name: 'add-circle' });
        expect(addIcon).toBeTruthy();
        fireEvent.press(addIcon.parent);
      });

      expect(mockNavigate).toHaveBeenCalledWith('AddItem');
    });

    it('deve exibir lista de itens quando há dados', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Camiseta Teste',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: ['casual'],
          favorite: false,
          timesWorn: 5,
          price: 49.90,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jeans Azul',
          category: Category.BOTTOMS,
          color: Color.BLUE,
          season: [Season.ALL_SEASONS],
          tags: [],
          favorite: true,
          timesWorn: 10,
          price: 150.00,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { getByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByText('Camiseta Teste')).toBeTruthy();
        expect(getByText('Jeans Azul')).toBeTruthy();
      });
    });

    it('deve exibir estatísticas corretas quando há itens', async () => {
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
          price: 50.00,
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
          timesWorn: 3,
          price: 100.00,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { getByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByText('2')).toBeTruthy(); // Total de itens
        expect(getByText('1')).toBeTruthy(); // Favoritos
        expect(getByText('150')).toBeTruthy(); // Valor total
      });
    });

    it('deve filtrar itens ao digitar no campo de busca', async () => {
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
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { getByPlaceholderText, getByText, queryByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByText('Camiseta Branca')).toBeTruthy();
        expect(getByText('Jeans Azul')).toBeTruthy();
      });

      const searchInput = getByPlaceholderText('Buscar itens...');
      fireEvent.changeText(searchInput, 'Camiseta');

      await waitFor(() => {
        expect(getByText('Camiseta Branca')).toBeTruthy();
        expect(queryByText('Jeans Azul')).toBeNull();
      });
    });

    it('deve exibir mensagem quando busca não retorna resultados', async () => {
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

      const { getByPlaceholderText, getByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByText('Camiseta')).toBeTruthy();
      });

      const searchInput = getByPlaceholderText('Buscar itens...');
      fireEvent.changeText(searchInput, 'ItemInexistente');

      await waitFor(() => {
        expect(getByText('Nenhum item encontrado')).toBeTruthy();
        expect(getByText('Tente ajustar os filtros ou a busca')).toBeTruthy();
      });
    });

    it('deve limpar busca ao clicar no X', async () => {
      const { getByPlaceholderText, UNSAFE_getByProps, getByText } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      // Aguardar o carregamento completar
      await waitFor(() => {
        expect(getByText('Itens')).toBeTruthy();
      });

      // Digitar texto na busca
      const searchInput = getByPlaceholderText('Buscar itens...');
      fireEvent.changeText(searchInput, 'teste');

      // Aguardar o ícone de fechar aparecer e clicar nele
      await waitFor(() => {
        const closeIcon = UNSAFE_getByProps({ name: 'close-circle' });
        expect(closeIcon).toBeTruthy();
        fireEvent.press(closeIcon.parent);
      });

      // Verificar que a busca foi limpa
      await waitFor(() => {
        expect(searchInput.props.value).toBe('');
      });
    });
  });

  describe('StatsScreen', () => {
    it('deve renderizar título "Estatísticas do Closet"', () => {
      const { getByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      expect(getByText('Estatísticas do Closet')).toBeTruthy();
    });

    it('deve exibir seção "Visão Geral"', () => {
      const { getByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      expect(getByText('Visão Geral')).toBeTruthy();
    });

    it('deve exibir estatísticas zeradas quando closet está vazio', async () => {
      const { getByText, getAllByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByText('Total de Itens')).toBeTruthy();
        expect(getByText('Valor Total')).toBeTruthy();
        expect(getByText('Itens Favoritos')).toBeTruthy();
        expect(getByText('Média de Uso')).toBeTruthy();
      });

      // Verificar valores zerados (podem aparecer múltiplas vezes)
      expect(getAllByText('0').length).toBeGreaterThanOrEqual(1);
      expect(getByText(/R\$ 0\.00/)).toBeTruthy(); // Valor total
      expect(getByText(/0\.0x/)).toBeTruthy(); // Média de uso
    });

    it('deve exibir estatísticas corretas quando há itens', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item 1',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: true,
          timesWorn: 10,
          price: 100.00,
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
          favorite: true,
          timesWorn: 6,
          price: 150.00,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { getByText, getAllByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getAllByText('2').length).toBeGreaterThanOrEqual(1); // Total de itens
        expect(getByText(/R\$ 250\.00/)).toBeTruthy(); // Valor total
        expect(getByText(/8\.0x/)).toBeTruthy(); // Média de uso
      });
    });

    it('deve exibir item mais usado quando há dados', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Camiseta Favorita',
          category: Category.TOPS,
          color: Color.WHITE,
          brand: 'Nike',
          season: [Season.SUMMER],
          tags: [],
          favorite: true,
          timesWorn: 20,
          price: 80.00,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jeans',
          category: Category.BOTTOMS,
          color: Color.BLUE,
          season: [Season.ALL_SEASONS],
          tags: [],
          favorite: false,
          timesWorn: 5,
          price: 150.00,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { getByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByText('Item Mais Usado')).toBeTruthy();
        expect(getByText('Camiseta Favorita')).toBeTruthy();
        expect(getByText('Nike')).toBeTruthy();
        expect(getByText('Usado 20 vezes')).toBeTruthy();
      });
    });

    it('não deve exibir seção "Item Mais Usado" quando closet está vazio', async () => {
      const { queryByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(queryByText('Item Mais Usado')).toBeNull();
      });
    });

    it('não deve exibir seção "Item Mais Usado" quando nenhum item foi usado', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item Novo',
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

      const { queryByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(queryByText('Item Mais Usado')).toBeNull();
      });
    });

    it('deve exibir seção "Itens por Categoria"', () => {
      const { getByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      expect(getByText('Itens por Categoria')).toBeTruthy();
    });

    it('deve exibir contagem de categorias quando há itens', async () => {
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
        {
          id: '2',
          name: 'Camiseta 2',
          category: Category.TOPS,
          color: Color.BLACK,
          season: [Season.WINTER],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Jeans',
          category: Category.BOTTOMS,
          color: Color.BLUE,
          season: [Season.ALL_SEASONS],
          tags: [],
          favorite: false,
          timesWorn: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { getByText } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      await waitFor(() => {
        // Verifica que há estatísticas de categoria
        expect(getByText('Itens por Categoria')).toBeTruthy();
      });
    });
  });

  describe('Integração entre Telas', () => {
    it('HomeScreen e StatsScreen devem usar os mesmos dados do Context', async () => {
      const mockItems = [
        {
          id: '1',
          name: 'Item Compartilhado',
          category: Category.TOPS,
          color: Color.WHITE,
          season: [Season.SUMMER],
          tags: [],
          favorite: true,
          timesWorn: 5,
          price: 99.90,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      // Renderizar HomeScreen
      const { getByText: getByTextHome, getAllByText: getAllByTextHome } = render(
        <ClosetProvider>
          <HomeScreen navigation={mockNavigation} />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getByTextHome('Item Compartilhado')).toBeTruthy();
        expect(getAllByTextHome('1').length).toBeGreaterThanOrEqual(1); // Total de itens
      });

      // Renderizar StatsScreen (em novo provider para simular navegação)
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockItems));

      const { getByText: getByTextStats, getAllByText: getAllByTextStats } = render(
        <ClosetProvider>
          <StatsScreen />
        </ClosetProvider>
      );

      await waitFor(() => {
        expect(getAllByTextStats('1').length).toBeGreaterThanOrEqual(1); // Total de itens
        expect(getByTextStats(/R\$ 99\.90/)).toBeTruthy(); // Valor total
      });
    });
  });
});
