import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ClosetItemCard } from '../mobile/components/ClosetItemCard';
import { Category, Color, Season } from '../src/models';
import { ClosetItem } from '../src/models';

describe('ClosetItemCard - Componente de Exibição', () => {
  const mockOnPress = jest.fn();
  const mockOnFavoritePress = jest.fn();

  const baseItem: ClosetItem = {
    id: '1',
    name: 'Camiseta Teste',
    category: Category.TOPS,
    color: Color.WHITE,
    season: [Season.SUMMER],
    tags: ['casual'],
    favorite: false,
    timesWorn: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização Básica', () => {
    it('deve renderizar o nome do item', () => {
      const { getByText } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText('Camiseta Teste')).toBeTruthy();
    });

    it('deve renderizar "Sem marca" quando não há marca', () => {
      const { getByText } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText('Sem marca')).toBeTruthy();
    });

    it('deve renderizar a marca quando fornecida', () => {
      const itemWithBrand = { ...baseItem, brand: 'Nike' };
      const { getByText } = render(
        <ClosetItemCard
          item={itemWithBrand}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText('Nike')).toBeTruthy();
    });

    it('deve renderizar a categoria', () => {
      const { getByText } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText(Category.TOPS)).toBeTruthy();
    });

    it('deve renderizar a cor', () => {
      const { getByText } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText(Color.WHITE)).toBeTruthy();
    });

    it('deve renderizar o tamanho quando fornecido', () => {
      const itemWithSize = { ...baseItem, size: 'M' };
      const { getByText } = render(
        <ClosetItemCard
          item={itemWithSize}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText('Tam. M')).toBeTruthy();
    });

    it('não deve renderizar o tamanho quando não fornecido', () => {
      const { queryByText } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(queryByText(/Tam\./)).toBeNull();
    });
  });

  describe('Contador de Uso', () => {
    it('deve renderizar contador de uso zerado', () => {
      const { getByText } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText(/Usado 0x/)).toBeTruthy();
    });

    it('deve renderizar contador de uso com valor correto', () => {
      const usedItem = { ...baseItem, timesWorn: 5 };
      const { getByText } = render(
        <ClosetItemCard
          item={usedItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText(/Usado 5x/)).toBeTruthy();
    });

    it('deve renderizar contador de uso para números grandes', () => {
      const veryUsedItem = { ...baseItem, timesWorn: 999 };
      const { getByText } = render(
        <ClosetItemCard
          item={veryUsedItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText(/Usado 999x/)).toBeTruthy();
    });
  });

  describe('Preço', () => {
    it('não deve renderizar preço quando não fornecido', () => {
      const { queryByText } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(queryByText(/R\$/)).toBeNull();
    });

    it('deve renderizar preço formatado corretamente', () => {
      const itemWithPrice = { ...baseItem, price: 49.99 };
      const { getByText } = render(
        <ClosetItemCard
          item={itemWithPrice}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText('R$ 49.99')).toBeTruthy();
    });

    it('deve formatar preços inteiros com duas casas decimais', () => {
      const itemWithPrice = { ...baseItem, price: 50 };
      const { getByText } = render(
        <ClosetItemCard
          item={itemWithPrice}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText('R$ 50.00')).toBeTruthy();
    });

    it('deve renderizar preços altos corretamente', () => {
      const expensiveItem = { ...baseItem, price: 1299.99 };
      const { getByText } = render(
        <ClosetItemCard
          item={expensiveItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText('R$ 1299.99')).toBeTruthy();
    });
  });

  describe('Status de Favorito', () => {
    it('deve renderizar ícone de favorito vazio quando não é favorito', () => {
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      // Procurar pelo ícone de coração vazio
      const favoriteIcon = UNSAFE_getByProps({ name: 'heart-outline' });
      expect(favoriteIcon).toBeTruthy();
    });

    it('deve renderizar ícone de favorito preenchido quando é favorito', () => {
      const favoriteItem = { ...baseItem, favorite: true };
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={favoriteItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      // Procurar pelo ícone de coração preenchido
      const favoriteIcon = UNSAFE_getByProps({ name: 'heart' });
      expect(favoriteIcon).toBeTruthy();
    });
  });

  describe('Interações do Usuário', () => {
    it('deve chamar onPress quando o card é pressionado', () => {
      const { getByText } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      const card = getByText('Camiseta Teste');
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onFavoritePress quando o botão de favorito é pressionado', () => {
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      // Encontrar o TouchableOpacity que contém o ícone de favorito
      const favoriteButton = UNSAFE_getByProps({ name: 'heart-outline' }).parent;
      fireEvent.press(favoriteButton);

      expect(mockOnFavoritePress).toHaveBeenCalledTimes(1);
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('não deve chamar onPress quando apenas o favorito é pressionado', () => {
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={baseItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      const favoriteButton = UNSAFE_getByProps({ name: 'heart-outline' }).parent;
      fireEvent.press(favoriteButton);

      expect(mockOnFavoritePress).toHaveBeenCalledTimes(1);
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Ícones de Categoria', () => {
    it('deve renderizar ícone correto para TOPS', () => {
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={{ ...baseItem, category: Category.TOPS }}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(UNSAFE_getByProps({ name: 'shirt-outline' })).toBeTruthy();
    });

    it('deve renderizar ícone correto para BOTTOMS', () => {
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={{ ...baseItem, category: Category.BOTTOMS }}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(UNSAFE_getByProps({ name: 'body-outline' })).toBeTruthy();
    });

    it('deve renderizar ícone correto para DRESSES', () => {
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={{ ...baseItem, category: Category.DRESSES }}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(UNSAFE_getByProps({ name: 'woman-outline' })).toBeTruthy();
    });

    it('deve renderizar ícone correto para SHOES', () => {
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={{ ...baseItem, category: Category.SHOES }}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(UNSAFE_getByProps({ name: 'footsteps-outline' })).toBeTruthy();
    });

    it('deve renderizar ícone correto para ACCESSORIES', () => {
      const { UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={{ ...baseItem, category: Category.ACCESSORIES }}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(UNSAFE_getByProps({ name: 'watch-outline' })).toBeTruthy();
    });
  });

  describe('Renderização com Dados Completos', () => {
    it('deve renderizar todas as informações quando item está completo', () => {
      const completeItem: ClosetItem = {
        id: '1',
        name: 'Vestido Elegante',
        category: Category.DRESSES,
        color: Color.BLACK,
        brand: 'Gucci',
        size: 'M',
        price: 599.99,
        purchaseDate: new Date('2024-01-15'),
        season: [Season.SPRING, Season.SUMMER],
        tags: ['formal', 'elegante'],
        favorite: true,
        timesWorn: 3,
        lastWornDate: new Date('2024-02-01'),
        notes: 'Para ocasiões especiais',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { getByText, UNSAFE_getByProps } = render(
        <ClosetItemCard
          item={completeItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText('Vestido Elegante')).toBeTruthy();
      expect(getByText('Gucci')).toBeTruthy();
      expect(getByText(Category.DRESSES)).toBeTruthy();
      expect(getByText(Color.BLACK)).toBeTruthy();
      expect(getByText('Tam. M')).toBeTruthy();
      expect(getByText('R$ 599.99')).toBeTruthy();
      expect(getByText(/Usado 3x/)).toBeTruthy();
      expect(UNSAFE_getByProps({ name: 'heart' })).toBeTruthy(); // Favorito
      expect(UNSAFE_getByProps({ name: 'woman-outline' })).toBeTruthy(); // Ícone de vestido
    });
  });

  describe('Edge Cases', () => {
    it('deve renderizar com nome muito longo', () => {
      const longNameItem = {
        ...baseItem,
        name: 'Nome Extremamente Longo Para Testar Truncamento do Texto no Card',
      };

      const { getByText } = render(
        <ClosetItemCard
          item={longNameItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(
        getByText('Nome Extremamente Longo Para Testar Truncamento do Texto no Card')
      ).toBeTruthy();
    });

    it('deve renderizar com marca muito longa', () => {
      const longBrandItem = {
        ...baseItem,
        brand: 'Marca Com Nome Extremamente Longo Para Testar Truncamento',
      };

      const { getByText } = render(
        <ClosetItemCard
          item={longBrandItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(
        getByText('Marca Com Nome Extremamente Longo Para Testar Truncamento')
      ).toBeTruthy();
    });

    it('não deve renderizar preço quando é zero (considerado falsy)', () => {
      const freeItem = { ...baseItem, price: 0 };
      const { queryByText } = render(
        <ClosetItemCard
          item={freeItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      // Preço 0 é considerado falsy em JavaScript, então não é exibido
      expect(queryByText(/R\$/)).toBeNull();
    });

    it('deve renderizar com timesWorn muito alto', () => {
      const veryUsedItem = { ...baseItem, timesWorn: 9999 };
      const { getByText } = render(
        <ClosetItemCard
          item={veryUsedItem}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText(/Usado 9999x/)).toBeTruthy();
    });
  });
});
