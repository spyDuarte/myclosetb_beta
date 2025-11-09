import { ClosetService } from '../src/services/ClosetService';
import { Category, Color, Season } from '../src/models';

describe('ClosetService', () => {
  let closetService: ClosetService;

  beforeEach(() => {
    closetService = new ClosetService();
  });

  describe('addItem', () => {
    it('deve adicionar um novo item ao closet', () => {
      const item = closetService.addItem({
        name: 'Camiseta Branca',
        category: Category.TOPS,
        color: Color.WHITE,
        brand: 'Zara',
        size: 'M',
        price: 49.90
      });

      expect(item).toBeDefined();
      expect(item.id).toBeDefined();
      expect(item.name).toBe('Camiseta Branca');
      expect(item.category).toBe(Category.TOPS);
      expect(item.favorite).toBe(false);
      expect(item.timesWorn).toBe(0);
      expect(closetService.count()).toBe(1);
    });

    it('deve criar um item com valores padrão quando campos opcionais não são fornecidos', () => {
      const item = closetService.addItem({
        name: 'Jeans',
        category: Category.BOTTOMS,
        color: Color.BLUE
      });

      expect(item.season).toEqual([Season.ALL_SEASONS]);
      expect(item.tags).toEqual([]);
      expect(item.favorite).toBe(false);
      expect(item.timesWorn).toBe(0);
    });
  });

  describe('getItemById', () => {
    it('deve retornar um item pelo ID', () => {
      const addedItem = closetService.addItem({
        name: 'Vestido Floral',
        category: Category.DRESSES,
        color: Color.MULTICOLOR
      });

      const foundItem = closetService.getItemById(addedItem.id);

      expect(foundItem).toBeDefined();
      expect(foundItem?.id).toBe(addedItem.id);
      expect(foundItem?.name).toBe('Vestido Floral');
    });

    it('deve retornar undefined para ID inexistente', () => {
      const item = closetService.getItemById('id-inexistente');
      expect(item).toBeUndefined();
    });
  });

  describe('getAllItems', () => {
    it('deve retornar todos os itens do closet', () => {
      closetService.addItem({
        name: 'Item 1',
        category: Category.TOPS,
        color: Color.WHITE
      });
      closetService.addItem({
        name: 'Item 2',
        category: Category.BOTTOMS,
        color: Color.BLUE
      });

      const items = closetService.getAllItems();

      expect(items).toHaveLength(2);
      expect(items[0].name).toBe('Item 1');
      expect(items[1].name).toBe('Item 2');
    });

    it('deve retornar array vazio quando não há itens', () => {
      const items = closetService.getAllItems();
      expect(items).toEqual([]);
    });
  });

  describe('updateItem', () => {
    it('deve atualizar um item existente', () => {
      const item = closetService.addItem({
        name: 'Camiseta Original',
        category: Category.TOPS,
        color: Color.WHITE
      });

      const updatedItem = closetService.updateItem(item.id, {
        name: 'Camiseta Atualizada',
        brand: 'Nike'
      });

      expect(updatedItem).toBeDefined();
      expect(updatedItem?.name).toBe('Camiseta Atualizada');
      expect(updatedItem?.brand).toBe('Nike');
      expect(updatedItem?.category).toBe(Category.TOPS);
    });

    it('deve retornar null para ID inexistente', () => {
      const result = closetService.updateItem('id-inexistente', {
        name: 'Teste'
      });

      expect(result).toBeNull();
    });
  });

  describe('deleteItem', () => {
    it('deve remover um item do closet', () => {
      const item = closetService.addItem({
        name: 'Item para deletar',
        category: Category.TOPS,
        color: Color.WHITE
      });

      expect(closetService.count()).toBe(1);

      const result = closetService.deleteItem(item.id);

      expect(result).toBe(true);
      expect(closetService.count()).toBe(0);
    });

    it('deve retornar false ao tentar deletar item inexistente', () => {
      const result = closetService.deleteItem('id-inexistente');
      expect(result).toBe(false);
    });
  });

  describe('markAsWorn', () => {
    it('deve incrementar o contador de uso', () => {
      const item = closetService.addItem({
        name: 'Camiseta',
        category: Category.TOPS,
        color: Color.WHITE
      });

      expect(item.timesWorn).toBe(0);

      const updated1 = closetService.markAsWorn(item.id);
      expect(updated1?.timesWorn).toBe(1);

      const updated2 = closetService.markAsWorn(item.id);
      expect(updated2?.timesWorn).toBe(2);
    });

    it('deve atualizar a data de último uso', () => {
      const item = closetService.addItem({
        name: 'Camiseta',
        category: Category.TOPS,
        color: Color.WHITE
      });

      const updated = closetService.markAsWorn(item.id);

      expect(updated?.lastWornDate).toBeDefined();
      expect(updated?.lastWornDate).toBeInstanceOf(Date);
    });

    it('deve retornar null para ID inexistente', () => {
      const result = closetService.markAsWorn('id-inexistente');
      expect(result).toBeNull();
    });
  });

  describe('toggleFavorite', () => {
    it('deve alternar o status de favorito', () => {
      const item = closetService.addItem({
        name: 'Camiseta',
        category: Category.TOPS,
        color: Color.WHITE
      });

      expect(item.favorite).toBe(false);

      const toggled1 = closetService.toggleFavorite(item.id);
      expect(toggled1?.favorite).toBe(true);

      const toggled2 = closetService.toggleFavorite(item.id);
      expect(toggled2?.favorite).toBe(false);
    });

    it('deve retornar null para ID inexistente', () => {
      const result = closetService.toggleFavorite('id-inexistente');
      expect(result).toBeNull();
    });
  });

  describe('searchItems', () => {
    beforeEach(() => {
      closetService.addItem({
        name: 'Camiseta Branca',
        category: Category.TOPS,
        color: Color.WHITE,
        season: [Season.SUMMER],
        tags: ['casual']
      });

      closetService.addItem({
        name: 'Jeans Azul',
        category: Category.BOTTOMS,
        color: Color.BLUE,
        season: [Season.ALL_SEASONS],
        tags: ['casual', 'jeans']
      });

      const item = closetService.addItem({
        name: 'Vestido Formal',
        category: Category.DRESSES,
        color: Color.BLACK,
        season: [Season.WINTER],
        tags: ['formal'],
        price: 299.90
      });
      closetService.toggleFavorite(item.id);
    });

    it('deve buscar itens por categoria', () => {
      const results = closetService.searchItems({ category: Category.TOPS });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Camiseta Branca');
    });

    it('deve buscar itens por cor', () => {
      const results = closetService.searchItems({ color: Color.BLUE });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Jeans Azul');
    });

    it('deve buscar itens por estação', () => {
      const results = closetService.searchItems({ season: Season.SUMMER });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Camiseta Branca');
    });

    it('deve buscar itens favoritos', () => {
      const results = closetService.searchItems({ favorite: true });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Vestido Formal');
    });

    it('deve buscar itens por tags', () => {
      const results = closetService.searchItems({ tags: ['casual'] });
      expect(results).toHaveLength(2);
    });

    it('deve buscar itens por termo de busca', () => {
      const results = closetService.searchItems({ searchTerm: 'formal' });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Vestido Formal');
    });

    it('deve buscar itens por faixa de preço', () => {
      const results = closetService.searchItems({
        minPrice: 200,
        maxPrice: 400
      });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Vestido Formal');
    });

    it('deve retornar array vazio quando nenhum item corresponde aos filtros', () => {
      const results = closetService.searchItems({
        category: Category.SHOES
      });
      expect(results).toEqual([]);
    });
  });

  describe('getStatistics', () => {
    it('deve retornar estatísticas corretas do closet', () => {
      const item1 = closetService.addItem({
        name: 'Item 1',
        category: Category.TOPS,
        color: Color.WHITE,
        price: 50
      });

      const item2 = closetService.addItem({
        name: 'Item 2',
        category: Category.TOPS,
        color: Color.BLACK,
        price: 100
      });

      closetService.toggleFavorite(item1.id);
      closetService.markAsWorn(item1.id);
      closetService.markAsWorn(item1.id);
      closetService.markAsWorn(item1.id);

      const stats = closetService.getStatistics();

      expect(stats.totalItems).toBe(2);
      expect(stats.totalValue).toBe(150);
      expect(stats.favoriteItems).toBe(1);
      expect(stats.mostWornItem?.id).toBe(item1.id);
      expect(stats.averageTimesWorn).toBe(1.5);
      expect(stats.categoryCounts[Category.TOPS]).toBe(2);
    });

    it('deve retornar estatísticas vazias para closet vazio', () => {
      const stats = closetService.getStatistics();

      expect(stats.totalItems).toBe(0);
      expect(stats.totalValue).toBe(0);
      expect(stats.favoriteItems).toBe(0);
      expect(stats.mostWornItem).toBeNull();
    });
  });

  describe('clear', () => {
    it('deve limpar todos os itens do closet', () => {
      closetService.addItem({
        name: 'Item 1',
        category: Category.TOPS,
        color: Color.WHITE
      });

      closetService.addItem({
        name: 'Item 2',
        category: Category.BOTTOMS,
        color: Color.BLUE
      });

      expect(closetService.count()).toBe(2);

      closetService.clear();

      expect(closetService.count()).toBe(0);
      expect(closetService.getAllItems()).toEqual([]);
    });
  });
});
