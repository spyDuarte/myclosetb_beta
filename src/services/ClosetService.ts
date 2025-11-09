import {
  ClosetItem,
  CreateClosetItemInput,
  UpdateClosetItemInput,
  ClosetItemFilters,
  Season
} from '../models';
import { generateId } from '../utils/idGenerator';

/**
 * Serviço para gerenciar itens do closet virtual
 */
export class ClosetService {
  private items: Map<string, ClosetItem>;

  constructor() {
    this.items = new Map();
  }

  /**
   * Adiciona um novo item ao closet
   */
  addItem(input: CreateClosetItemInput): ClosetItem {
    const now = new Date();
    const item: ClosetItem = {
      id: generateId(),
      name: input.name,
      category: input.category,
      color: input.color,
      brand: input.brand,
      size: input.size,
      price: input.price,
      purchaseDate: input.purchaseDate,
      season: input.season || [Season.ALL_SEASONS],
      tags: input.tags || [],
      imageUrl: input.imageUrl,
      favorite: false,
      timesWorn: 0,
      notes: input.notes,
      createdAt: now,
      updatedAt: now
    };

    this.items.set(item.id, item);
    return item;
  }

  /**
   * Busca um item por ID
   */
  getItemById(id: string): ClosetItem | undefined {
    return this.items.get(id);
  }

  /**
   * Retorna todos os itens do closet
   */
  getAllItems(): ClosetItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Atualiza um item existente
   */
  updateItem(id: string, updates: UpdateClosetItemInput): ClosetItem | null {
    const item = this.items.get(id);
    if (!item) {
      return null;
    }

    const updatedItem: ClosetItem = {
      ...item,
      ...updates,
      updatedAt: new Date()
    };

    this.items.set(id, updatedItem);
    return updatedItem;
  }

  /**
   * Remove um item do closet
   */
  deleteItem(id: string): boolean {
    return this.items.delete(id);
  }

  /**
   * Marca um item como usado
   */
  markAsWorn(id: string): ClosetItem | null {
    const item = this.items.get(id);
    if (!item) {
      return null;
    }

    const updatedItem: ClosetItem = {
      ...item,
      timesWorn: item.timesWorn + 1,
      lastWornDate: new Date(),
      updatedAt: new Date()
    };

    this.items.set(id, updatedItem);
    return updatedItem;
  }

  /**
   * Alterna o status de favorito de um item
   */
  toggleFavorite(id: string): ClosetItem | null {
    const item = this.items.get(id);
    if (!item) {
      return null;
    }

    const updatedItem: ClosetItem = {
      ...item,
      favorite: !item.favorite,
      updatedAt: new Date()
    };

    this.items.set(id, updatedItem);
    return updatedItem;
  }

  /**
   * Busca itens com base em filtros
   */
  searchItems(filters: ClosetItemFilters): ClosetItem[] {
    let results = this.getAllItems();

    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }

    if (filters.color) {
      results = results.filter(item => item.color === filters.color);
    }

    if (filters.season) {
      results = results.filter(item => item.season.includes(filters.season!));
    }

    if (filters.favorite !== undefined) {
      results = results.filter(item => item.favorite === filters.favorite);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(item =>
        filters.tags!.some(tag => item.tags.includes(tag))
      );
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(item => item.price && item.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(item => item.price && item.price <= filters.maxPrice!);
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.brand?.toLowerCase().includes(term) ||
        item.notes?.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return results;
  }

  /**
   * Obtém estatísticas do closet
   */
  getStatistics() {
    const items = this.getAllItems();
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
    const favoriteItems = items.filter(item => item.favorite).length;
    const mostWornItem = items.reduce((prev, current) =>
      current.timesWorn > prev.timesWorn ? current : prev,
      items[0] || { timesWorn: 0 }
    );

    const categoryCounts = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalItems,
      totalValue,
      favoriteItems,
      mostWornItem: mostWornItem.timesWorn > 0 ? mostWornItem : null,
      categoryCounts,
      averageTimesWorn: totalItems > 0
        ? items.reduce((sum, item) => sum + item.timesWorn, 0) / totalItems
        : 0
    };
  }

  /**
   * Limpa todos os itens do closet
   */
  clear(): void {
    this.items.clear();
  }

  /**
   * Retorna a contagem total de itens
   */
  count(): number {
    return this.items.size;
  }
}
