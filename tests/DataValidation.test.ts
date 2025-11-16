import { ClosetService } from '../src/services/ClosetService';
import { Category, Color, Season } from '../src/models';

describe('Validação de Dados e Edge Cases', () => {
  let closetService: ClosetService;

  beforeEach(() => {
    closetService = new ClosetService();
  });

  describe('Validação de Campos Obrigatórios', () => {
    it('deve criar item com apenas campos obrigatórios', () => {
      const item = closetService.addItem({
        name: 'Item Mínimo',
        category: Category.TOPS,
        color: Color.WHITE
      });

      expect(item).toBeDefined();
      expect(item.id).toBeDefined();
      expect(item.name).toBe('Item Mínimo');
      expect(item.category).toBe(Category.TOPS);
      expect(item.color).toBe(Color.WHITE);
      expect(item.season).toEqual([Season.ALL_SEASONS]);
      expect(item.tags).toEqual([]);
      expect(item.favorite).toBe(false);
      expect(item.timesWorn).toBe(0);
      expect(item.createdAt).toBeInstanceOf(Date);
      expect(item.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Validação de Strings', () => {
    it('deve aceitar nome com caracteres especiais', () => {
      const item = closetService.addItem({
        name: 'Camiseta "Premium" - Edição Limitada!',
        category: Category.TOPS,
        color: Color.WHITE
      });

      expect(item.name).toBe('Camiseta "Premium" - Edição Limitada!');
    });

    it('deve aceitar nome com emojis', () => {
      const item = closetService.addItem({
        name: '👕 Camiseta Cool ⭐',
        category: Category.TOPS,
        color: Color.WHITE
      });

      expect(item.name).toBe('👕 Camiseta Cool ⭐');
    });

    it('deve aceitar nome muito longo', () => {
      const longName = 'A'.repeat(1000);
      const item = closetService.addItem({
        name: longName,
        category: Category.TOPS,
        color: Color.WHITE
      });

      expect(item.name).toBe(longName);
      expect(item.name.length).toBe(1000);
    });

    it('deve aceitar notas muito longas', () => {
      const longNotes = 'Lorem ipsum '.repeat(500);
      const item = closetService.addItem({
        name: 'Item com notas longas',
        category: Category.TOPS,
        color: Color.WHITE,
        notes: longNotes
      });

      expect(item.notes).toBe(longNotes);
    });
  });

  describe('Validação de Arrays', () => {
    it('deve aceitar múltiplas estações', () => {
      const item = closetService.addItem({
        name: 'Jaqueta Versátil',
        category: Category.OUTERWEAR,
        color: Color.BLACK,
        season: [Season.SPRING, Season.FALL, Season.WINTER]
      });

      expect(item.season).toHaveLength(3);
      expect(item.season).toContain(Season.SPRING);
      expect(item.season).toContain(Season.FALL);
      expect(item.season).toContain(Season.WINTER);
    });

    it('deve aceitar todas as estações', () => {
      const item = closetService.addItem({
        name: 'Camiseta Básica',
        category: Category.TOPS,
        color: Color.WHITE,
        season: [Season.SPRING, Season.SUMMER, Season.FALL, Season.WINTER, Season.ALL_SEASONS]
      });

      expect(item.season).toHaveLength(5);
    });

    it('deve aceitar muitas tags', () => {
      const manyTags = Array.from({ length: 100 }, (_, i) => `tag${i}`);
      const item = closetService.addItem({
        name: 'Item com muitas tags',
        category: Category.TOPS,
        color: Color.WHITE,
        tags: manyTags
      });

      expect(item.tags).toHaveLength(100);
    });

    it('deve aceitar tags com caracteres especiais', () => {
      const item = closetService.addItem({
        name: 'Item',
        category: Category.TOPS,
        color: Color.WHITE,
        tags: ['tag#1', 'tag@2', 'tag$3', 'tag&4', 'português', '中文', '🎉']
      });

      expect(item.tags).toHaveLength(7);
      expect(item.tags).toContain('português');
      expect(item.tags).toContain('中文');
      expect(item.tags).toContain('🎉');
    });
  });

  describe('Validação de Números', () => {
    it('deve aceitar preço zero', () => {
      const item = closetService.addItem({
        name: 'Item Grátis',
        category: Category.TOPS,
        color: Color.WHITE,
        price: 0
      });

      expect(item.price).toBe(0);
    });

    it('deve aceitar preços decimais precisos', () => {
      const item = closetService.addItem({
        name: 'Item Caro',
        category: Category.TOPS,
        color: Color.WHITE,
        price: 999.99
      });

      expect(item.price).toBe(999.99);
    });

    it('deve aceitar preços muito altos', () => {
      const item = closetService.addItem({
        name: 'Item Luxo',
        category: Category.DRESSES,
        color: Color.WHITE,
        price: 999999.99
      });

      expect(item.price).toBe(999999.99);
    });

    it('deve permitir incrementar timesWorn até números muito altos', () => {
      const item = closetService.addItem({
        name: 'Item Muito Usado',
        category: Category.TOPS,
        color: Color.WHITE
      });

      for (let i = 0; i < 1000; i++) {
        closetService.markAsWorn(item.id);
      }

      const updated = closetService.getItemById(item.id);
      expect(updated?.timesWorn).toBe(1000);
    });
  });

  describe('Validação de Datas', () => {
    it('deve aceitar data de compra no passado', () => {
      const pastDate = new Date('2020-01-01');
      const item = closetService.addItem({
        name: 'Item Antigo',
        category: Category.TOPS,
        color: Color.WHITE,
        purchaseDate: pastDate
      });

      expect(item.purchaseDate).toEqual(pastDate);
    });

    it('deve aceitar data de compra no futuro', () => {
      const futureDate = new Date('2030-01-01');
      const item = closetService.addItem({
        name: 'Item Pré-venda',
        category: Category.TOPS,
        color: Color.WHITE,
        purchaseDate: futureDate
      });

      expect(item.purchaseDate).toEqual(futureDate);
    });

    it('deve atualizar lastWornDate corretamente', () => {
      const item = closetService.addItem({
        name: 'Camiseta',
        category: Category.TOPS,
        color: Color.WHITE
      });

      const beforeMark = new Date();
      closetService.markAsWorn(item.id);
      const afterMark = new Date();

      const updated = closetService.getItemById(item.id);
      expect(updated?.lastWornDate).toBeDefined();
      expect(updated?.lastWornDate!.getTime()).toBeGreaterThanOrEqual(beforeMark.getTime());
      expect(updated?.lastWornDate!.getTime()).toBeLessThanOrEqual(afterMark.getTime());
    });

    it('deve atualizar updatedAt em cada modificação', (done) => {
      const item = closetService.addItem({
        name: 'Item',
        category: Category.TOPS,
        color: Color.WHITE
      });

      const originalUpdatedAt = item.updatedAt;

      // Aguardar um pouco para garantir diferença de timestamp
      setTimeout(() => {
        closetService.updateItem(item.id, { name: 'Item Atualizado' });
        const updated = closetService.getItemById(item.id);

        expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
        done();
      }, 10);
    });
  });

  describe('Operações com Closet Vazio', () => {
    it('deve retornar undefined ao buscar item em closet vazio', () => {
      const item = closetService.getItemById('qualquer-id');
      expect(item).toBeUndefined();
    });

    it('deve retornar array vazio ao listar itens de closet vazio', () => {
      const items = closetService.getAllItems();
      expect(items).toEqual([]);
      expect(items).toHaveLength(0);
    });

    it('deve retornar false ao tentar deletar de closet vazio', () => {
      const result = closetService.deleteItem('qualquer-id');
      expect(result).toBe(false);
    });

    it('deve retornar null ao tentar atualizar item em closet vazio', () => {
      const result = closetService.updateItem('qualquer-id', { name: 'Novo nome' });
      expect(result).toBeNull();
    });

    it('deve retornar estatísticas zeradas para closet vazio', () => {
      const stats = closetService.getStatistics();
      expect(stats.totalItems).toBe(0);
      expect(stats.totalValue).toBe(0);
      expect(stats.favoriteItems).toBe(0);
      expect(stats.mostWornItem).toBeNull();
      expect(stats.averageTimesWorn).toBe(0);
      expect(stats.categoryCounts).toEqual({});
    });

    it('deve retornar array vazio ao buscar itens não usados em closet vazio', () => {
      const items = closetService.getUnwornItems();
      expect(items).toEqual([]);
    });
  });

  describe('Operações com Closet Grande', () => {
    it('deve lidar com adição de muitos itens', () => {
      const itemCount = 1000;
      for (let i = 0; i < itemCount; i++) {
        closetService.addItem({
          name: `Item ${i}`,
          category: Category.TOPS,
          color: Color.WHITE
        });
      }

      expect(closetService.count()).toBe(itemCount);
      expect(closetService.getAllItems()).toHaveLength(itemCount);
    });

    it('deve buscar eficientemente em closet grande', () => {
      // Adicionar 1000 itens
      for (let i = 0; i < 1000; i++) {
        closetService.addItem({
          name: `Item ${i}`,
          category: i % 2 === 0 ? Category.TOPS : Category.BOTTOMS,
          color: Color.WHITE,
          tags: i % 3 === 0 ? ['especial'] : []
        });
      }

      const startTime = Date.now();
      const results = closetService.searchItems({ category: Category.TOPS });
      const endTime = Date.now();

      expect(results).toHaveLength(500);
      expect(endTime - startTime).toBeLessThan(100); // Deve completar em menos de 100ms
    });

    it('deve calcular estatísticas corretamente para closet grande', () => {
      for (let i = 0; i < 100; i++) {
        closetService.addItem({
          name: `Item ${i}`,
          category: Category.TOPS,
          color: Color.WHITE,
          price: i + 1
        });
      }

      const stats = closetService.getStatistics();
      expect(stats.totalItems).toBe(100);
      expect(stats.totalValue).toBe(5050); // Soma de 1 a 100
    });

    it('deve limpar closet grande eficientemente', () => {
      for (let i = 0; i < 1000; i++) {
        closetService.addItem({
          name: `Item ${i}`,
          category: Category.TOPS,
          color: Color.WHITE
        });
      }

      expect(closetService.count()).toBe(1000);

      closetService.clear();

      expect(closetService.count()).toBe(0);
      expect(closetService.getAllItems()).toEqual([]);
    });
  });

  describe('Busca Avançada com Múltiplos Filtros', () => {
    beforeEach(() => {
      const item1 = closetService.addItem({
        name: 'Camiseta Branca Casual',
        category: Category.TOPS,
        color: Color.WHITE,
        season: [Season.SUMMER],
        tags: ['casual', 'básico'],
        price: 50
      });
      closetService.toggleFavorite(item1.id);

      closetService.addItem({
        name: 'Jeans Azul Premium',
        category: Category.BOTTOMS,
        color: Color.BLUE,
        season: [Season.ALL_SEASONS],
        tags: ['jeans', 'premium'],
        price: 200
      });

      const item3 = closetService.addItem({
        name: 'Vestido Preto Formal',
        category: Category.DRESSES,
        color: Color.BLACK,
        season: [Season.WINTER],
        tags: ['formal', 'elegante'],
        price: 300
      });
      closetService.toggleFavorite(item3.id);
    });

    it('deve combinar filtros de categoria e cor', () => {
      const results = closetService.searchItems({
        category: Category.TOPS,
        color: Color.WHITE
      });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Camiseta Branca Casual');
    });

    it('deve combinar filtros de favorito e faixa de preço', () => {
      const results = closetService.searchItems({
        favorite: true,
        minPrice: 100,
        maxPrice: 350
      });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Vestido Preto Formal');
    });

    it('deve combinar busca por termo com outros filtros', () => {
      const results = closetService.searchItems({
        searchTerm: 'premium',
        category: Category.BOTTOMS
      });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Jeans Azul Premium');
    });

    it('deve retornar vazio quando filtros não correspondem', () => {
      const results = closetService.searchItems({
        category: Category.TOPS,
        color: Color.BLACK
      });

      expect(results).toHaveLength(0);
    });

    it('deve buscar por múltiplas tags', () => {
      const results = closetService.searchItems({
        tags: ['casual', 'premium']
      });

      expect(results).toHaveLength(2); // Itens com 'casual' OU 'premium'
    });
  });

  describe('Integridade de Dados', () => {
    it('deve manter IDs únicos ao adicionar múltiplos itens', () => {
      const items = [];
      for (let i = 0; i < 100; i++) {
        items.push(closetService.addItem({
          name: `Item ${i}`,
          category: Category.TOPS,
          color: Color.WHITE
        }));
      }

      const ids = items.map(item => item.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(100);
    });

    it('não deve modificar objeto original ao atualizar item', () => {
      const item = closetService.addItem({
        name: 'Original',
        category: Category.TOPS,
        color: Color.WHITE
      });

      const originalName = item.name;

      closetService.updateItem(item.id, { name: 'Atualizado' });

      expect(item.name).toBe(originalName); // Objeto original não foi modificado
    });

    it('deve preservar dados não atualizados em update parcial', () => {
      const item = closetService.addItem({
        name: 'Item Completo',
        category: Category.TOPS,
        color: Color.WHITE,
        brand: 'Nike',
        size: 'M',
        price: 100,
        tags: ['esporte']
      });

      closetService.updateItem(item.id, { name: 'Item Atualizado' });

      const updated = closetService.getItemById(item.id);
      expect(updated?.name).toBe('Item Atualizado');
      expect(updated?.brand).toBe('Nike');
      expect(updated?.size).toBe('M');
      expect(updated?.price).toBe(100);
      expect(updated?.tags).toEqual(['esporte']);
    });
  });

  describe('Ordenação e Ranking', () => {
    it('deve ordenar itens menos usados corretamente', () => {
      const item1 = closetService.addItem({
        name: 'Muito usado',
        category: Category.TOPS,
        color: Color.WHITE
      });

      const item2 = closetService.addItem({
        name: 'Pouco usado',
        category: Category.TOPS,
        color: Color.WHITE
      });

      const item3 = closetService.addItem({
        name: 'Nunca usado',
        category: Category.TOPS,
        color: Color.WHITE
      });

      closetService.markAsWorn(item1.id);
      closetService.markAsWorn(item1.id);
      closetService.markAsWorn(item1.id);
      closetService.markAsWorn(item1.id);
      closetService.markAsWorn(item1.id);

      closetService.markAsWorn(item2.id);
      closetService.markAsWorn(item2.id);

      const leastWorn = closetService.getLeastWornItems();

      expect(leastWorn[0].id).toBe(item3.id);
      expect(leastWorn[1].id).toBe(item2.id);
      expect(leastWorn[2].id).toBe(item1.id);
    });

    it('deve ordenar itens mais usados corretamente', () => {
      const item1 = closetService.addItem({
        name: 'Muito usado',
        category: Category.TOPS,
        color: Color.WHITE
      });

      const item2 = closetService.addItem({
        name: 'Pouco usado',
        category: Category.TOPS,
        color: Color.WHITE
      });

      closetService.markAsWorn(item1.id);
      closetService.markAsWorn(item1.id);
      closetService.markAsWorn(item1.id);

      closetService.markAsWorn(item2.id);

      const mostWorn = closetService.getMostWornItems();

      expect(mostWorn[0].id).toBe(item1.id);
      expect(mostWorn[1].id).toBe(item2.id);
    });
  });
});
