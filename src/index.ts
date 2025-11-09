import { ClosetService } from './services';
import { Category, Color, Season } from './models';

/**
 * Função principal que demonstra o uso do sistema de closet virtual
 */
function main() {
  console.log('🎨 Bem-vindo ao MyCloset Beta - Sistema de Gerenciamento de Closet Virtual\n');

  // Criar uma nova instância do serviço de closet
  const closetService = new ClosetService();

  // Adicionar alguns itens de exemplo
  console.log('📦 Adicionando itens ao closet...\n');

  const item1 = closetService.addItem({
    name: 'Camiseta Básica Branca',
    category: Category.TOPS,
    color: Color.WHITE,
    brand: 'Zara',
    size: 'M',
    price: 49.90,
    season: [Season.SPRING, Season.SUMMER, Season.FALL],
    tags: ['casual', 'básico', 'versátil']
  });
  console.log(`✅ Adicionado: ${item1.name} (ID: ${item1.id})`);

  const item2 = closetService.addItem({
    name: 'Jeans Skinny Azul',
    category: Category.BOTTOMS,
    color: Color.BLUE,
    brand: 'Levi\'s',
    size: '38',
    price: 299.90,
    season: [Season.ALL_SEASONS],
    tags: ['casual', 'jeans', 'favorito']
  });
  console.log(`✅ Adicionado: ${item2.name} (ID: ${item2.id})`);

  const item3 = closetService.addItem({
    name: 'Vestido Floral',
    category: Category.DRESSES,
    color: Color.MULTICOLOR,
    brand: 'Farm',
    size: 'P',
    price: 189.90,
    season: [Season.SPRING, Season.SUMMER],
    tags: ['casual', 'festa', 'floral']
  });
  console.log(`✅ Adicionado: ${item3.name} (ID: ${item3.id})`);

  const item4 = closetService.addItem({
    name: 'Jaqueta de Couro Preta',
    category: Category.OUTERWEAR,
    color: Color.BLACK,
    brand: 'Zara',
    size: 'M',
    price: 599.90,
    season: [Season.FALL, Season.WINTER],
    tags: ['formal', 'rock', 'inverno']
  });
  console.log(`✅ Adicionado: ${item4.name} (ID: ${item4.id})\n`);

  // Marcar alguns itens como favoritos
  console.log('⭐ Marcando itens favoritos...\n');
  closetService.toggleFavorite(item2.id);
  closetService.toggleFavorite(item4.id);
  console.log(`⭐ ${item2.name} marcado como favorito`);
  console.log(`⭐ ${item4.name} marcado como favorito\n`);

  // Marcar alguns itens como usados
  console.log('👕 Registrando uso de itens...\n');
  closetService.markAsWorn(item1.id);
  closetService.markAsWorn(item1.id);
  closetService.markAsWorn(item1.id);
  closetService.markAsWorn(item2.id);
  closetService.markAsWorn(item2.id);
  console.log(`👕 ${item1.name} usado 3 vezes`);
  console.log(`👕 ${item2.name} usado 2 vezes\n`);

  // Buscar itens por categoria
  console.log('🔍 Buscando itens da categoria TOPS...\n');
  const tops = closetService.searchItems({ category: Category.TOPS });
  tops.forEach(item => {
    console.log(`  - ${item.name} (${item.brand})`);
  });
  console.log('');

  // Buscar itens favoritos
  console.log('⭐ Buscando itens favoritos...\n');
  const favorites = closetService.searchItems({ favorite: true });
  favorites.forEach(item => {
    console.log(`  - ${item.name} (${item.brand})`);
  });
  console.log('');

  // Buscar itens por estação
  console.log('☀️ Buscando itens para verão...\n');
  const summerItems = closetService.searchItems({ season: Season.SUMMER });
  summerItems.forEach(item => {
    console.log(`  - ${item.name}`);
  });
  console.log('');

  // Buscar itens por termo
  console.log('🔎 Buscando itens com o termo "casual"...\n');
  const casualItems = closetService.searchItems({ searchTerm: 'casual' });
  casualItems.forEach(item => {
    console.log(`  - ${item.name} (${item.tags.join(', ')})`);
  });
  console.log('');

  // Obter estatísticas do closet
  console.log('📊 Estatísticas do closet:\n');
  const stats = closetService.getStatistics();
  console.log(`  Total de itens: ${stats.totalItems}`);
  console.log(`  Valor total: R$ ${stats.totalValue.toFixed(2)}`);
  console.log(`  Itens favoritos: ${stats.favoriteItems}`);
  console.log(`  Média de uso por item: ${stats.averageTimesWorn.toFixed(1)} vezes`);
  if (stats.mostWornItem) {
    console.log(`  Item mais usado: ${stats.mostWornItem.name} (${stats.mostWornItem.timesWorn} vezes)`);
  }
  console.log('\n  Itens por categoria:');
  Object.entries(stats.categoryCounts).forEach(([category, count]) => {
    console.log(`    - ${category}: ${count}`);
  });

  console.log('\n✨ Demonstração concluída!');
}

// Executar a função principal
if (require.main === module) {
  main();
}

export { main };
