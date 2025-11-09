import { Category, Color, Season } from './Category';

/**
 * Interface para um item do closet
 */
export interface ClosetItem {
  id: string;
  name: string;
  category: Category;
  color: Color;
  brand?: string;
  size?: string;
  price?: number;
  purchaseDate?: Date;
  season: Season[];
  tags: string[];
  imageUrl?: string;
  favorite: boolean;
  timesWorn: number;
  lastWornDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface para criação de um novo item (sem campos gerados automaticamente)
 */
export interface CreateClosetItemInput {
  name: string;
  category: Category;
  color: Color;
  brand?: string;
  size?: string;
  price?: number;
  purchaseDate?: Date;
  season?: Season[];
  tags?: string[];
  imageUrl?: string;
  notes?: string;
}

/**
 * Interface para atualização de um item (todos os campos opcionais)
 */
export interface UpdateClosetItemInput {
  name?: string;
  category?: Category;
  color?: Color;
  brand?: string;
  size?: string;
  price?: number;
  purchaseDate?: Date;
  season?: Season[];
  tags?: string[];
  imageUrl?: string;
  favorite?: boolean;
  notes?: string;
}

/**
 * Interface para filtros de busca
 */
export interface ClosetItemFilters {
  category?: Category;
  color?: Color;
  season?: Season;
  favorite?: boolean;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}
