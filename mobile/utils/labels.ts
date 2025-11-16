import { Category, Color, Season } from '../../src/models';

/**
 * Mapeia valores de Category para labels em português
 */
export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    [Category.TOPS]: 'Blusas/Camisetas',
    [Category.BOTTOMS]: 'Calças/Shorts',
    [Category.DRESSES]: 'Vestidos',
    [Category.OUTERWEAR]: 'Jaquetas/Casacos',
    [Category.SHOES]: 'Calçados',
    [Category.ACCESSORIES]: 'Acessórios',
    [Category.BAGS]: 'Bolsas',
    [Category.JEWELRY]: 'Joias',
    [Category.UNDERWEAR]: 'Roupa Íntima',
    [Category.ACTIVEWEAR]: 'Roupas Esportivas',
    [Category.SLEEPWEAR]: 'Pijamas',
    [Category.OTHER]: 'Outro'
  };
  return labels[category] || category;
}

/**
 * Mapeia valores de Color para labels em português
 */
export function getColorLabel(color: Color): string {
  const labels: Record<Color, string> = {
    [Color.BLACK]: 'Preto',
    [Color.WHITE]: 'Branco',
    [Color.GRAY]: 'Cinza',
    [Color.RED]: 'Vermelho',
    [Color.BLUE]: 'Azul',
    [Color.GREEN]: 'Verde',
    [Color.YELLOW]: 'Amarelo',
    [Color.ORANGE]: 'Laranja',
    [Color.PURPLE]: 'Roxo',
    [Color.PINK]: 'Rosa',
    [Color.BROWN]: 'Marrom',
    [Color.BEIGE]: 'Bege',
    [Color.MULTICOLOR]: 'Multicolorido',
    [Color.OTHER]: 'Outra'
  };
  return labels[color] || color;
}

/**
 * Mapeia valores de Season para labels em português
 */
export function getSeasonLabel(season: Season): string {
  const labels: Record<Season, string> = {
    [Season.SPRING]: 'Primavera',
    [Season.SUMMER]: 'Verão',
    [Season.FALL]: 'Outono',
    [Season.WINTER]: 'Inverno',
    [Season.ALL_SEASONS]: 'Todas as Estações'
  };
  return labels[season] || season;
}

/**
 * Mapeia Category para cores para visualização
 */
export function getCategoryColor(category: Category | string): string {
  const colors: Record<string, string> = {
    [Category.TOPS]: '#007AFF',
    [Category.BOTTOMS]: '#5856D6',
    [Category.DRESSES]: '#FF2D55',
    [Category.OUTERWEAR]: '#AF52DE',
    [Category.SHOES]: '#FF9500',
    [Category.ACCESSORIES]: '#FFCC00',
    [Category.BAGS]: '#FF3B30',
    [Category.JEWELRY]: '#FFD700',
    [Category.UNDERWEAR]: '#34C759',
    [Category.ACTIVEWEAR]: '#00C7BE',
    [Category.SLEEPWEAR]: '#5AC8FA',
    [Category.OTHER]: '#8E8E93'
  };
  return colors[category] || '#999';
}

/**
 * Retorna todas as categorias com labels em português para uso em Pickers
 */
export function getAllCategoryOptions(): Array<{ value: Category; label: string }> {
  return [
    { value: Category.TOPS, label: getCategoryLabel(Category.TOPS) },
    { value: Category.BOTTOMS, label: getCategoryLabel(Category.BOTTOMS) },
    { value: Category.DRESSES, label: getCategoryLabel(Category.DRESSES) },
    { value: Category.OUTERWEAR, label: getCategoryLabel(Category.OUTERWEAR) },
    { value: Category.SHOES, label: getCategoryLabel(Category.SHOES) },
    { value: Category.ACCESSORIES, label: getCategoryLabel(Category.ACCESSORIES) },
    { value: Category.BAGS, label: getCategoryLabel(Category.BAGS) },
    { value: Category.JEWELRY, label: getCategoryLabel(Category.JEWELRY) },
    { value: Category.UNDERWEAR, label: getCategoryLabel(Category.UNDERWEAR) },
    { value: Category.ACTIVEWEAR, label: getCategoryLabel(Category.ACTIVEWEAR) },
    { value: Category.SLEEPWEAR, label: getCategoryLabel(Category.SLEEPWEAR) },
    { value: Category.OTHER, label: getCategoryLabel(Category.OTHER) }
  ];
}

/**
 * Retorna todas as cores com labels em português para uso em Pickers
 */
export function getAllColorOptions(): Array<{ value: Color; label: string }> {
  return [
    { value: Color.BLACK, label: getColorLabel(Color.BLACK) },
    { value: Color.WHITE, label: getColorLabel(Color.WHITE) },
    { value: Color.GRAY, label: getColorLabel(Color.GRAY) },
    { value: Color.RED, label: getColorLabel(Color.RED) },
    { value: Color.BLUE, label: getColorLabel(Color.BLUE) },
    { value: Color.GREEN, label: getColorLabel(Color.GREEN) },
    { value: Color.YELLOW, label: getColorLabel(Color.YELLOW) },
    { value: Color.ORANGE, label: getColorLabel(Color.ORANGE) },
    { value: Color.PURPLE, label: getColorLabel(Color.PURPLE) },
    { value: Color.PINK, label: getColorLabel(Color.PINK) },
    { value: Color.BROWN, label: getColorLabel(Color.BROWN) },
    { value: Color.BEIGE, label: getColorLabel(Color.BEIGE) },
    { value: Color.MULTICOLOR, label: getColorLabel(Color.MULTICOLOR) },
    { value: Color.OTHER, label: getColorLabel(Color.OTHER) }
  ];
}
