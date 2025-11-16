import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCloset } from '../contexts/ClosetContext';
import { ClosetItemCard } from '../components/ClosetItemCard';
import { FilterModal, FilterOptions, SortOption } from '../components/FilterModal';
import { ClosetItem } from '../../src/models';
import { HomeScreenProps } from '../types/navigation';

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { items, loading, toggleFavorite } = useCloset();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    colors: [],
    seasons: [],
    onlyFavorites: false
  });
  const [sortBy, setSortBy] = useState<SortOption>('date-new');

  // Aplicar filtros e busca
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Aplicar busca por texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.brand?.toLowerCase().includes(term) ||
        item.notes?.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Aplicar filtro de favoritos
    if (filters.onlyFavorites) {
      result = result.filter(item => item.favorite);
    }

    // Aplicar filtro de categorias
    if (filters.categories.length > 0) {
      result = result.filter(item => filters.categories.includes(item.category));
    }

    // Aplicar filtro de cores
    if (filters.colors.length > 0) {
      result = result.filter(item => filters.colors.includes(item.color));
    }

    // Aplicar filtro de estações
    if (filters.seasons.length > 0) {
      result = result.filter(item =>
        item.season.some(s => filters.seasons.includes(s))
      );
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
        break;
      case 'date-new':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'date-old':
        result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'worn-most':
        result.sort((a, b) => b.timesWorn - a.timesWorn);
        break;
      case 'worn-least':
        result.sort((a, b) => a.timesWorn - b.timesWorn);
        break;
    }

    return result;
  }, [items, searchTerm, filters, sortBy]);

  // Contar filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.onlyFavorites) count++;
    count += filters.categories.length;
    count += filters.colors.length;
    count += filters.seasons.length;
    return count;
  }, [filters]);

  // Memoizar estatísticas para evitar recálculo a cada render
  const stats = useMemo(() => ({
    total: items.length,
    favorites: items.filter(i => i.favorite).length,
    totalValue: items.reduce((sum, i) => sum + (i.price || 0), 0)
  }), [items]);

  // Memoizar callbacks para evitar re-renders desnecessários
  const keyExtractor = useCallback((item: ClosetItem) => item.id, []);

  const renderItem = useCallback(({ item }: { item: ClosetItem }) => (
    <ClosetItemCard
      item={item}
      onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
      onFavoritePress={() => toggleFavorite(item.id)}
    />
  ), [navigation, toggleFavorite]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando closet...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Closet</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="funnel" size={24} color="#007AFF" />
            {activeFiltersCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddItem')}
          >
            <Ionicons name="add-circle" size={32} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar itens..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Itens</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{stats.favorites}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {stats.totalValue.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>R$ Total</Text>
        </View>
      </View>

      {filteredAndSortedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shirt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchTerm || activeFiltersCount > 0
              ? 'Nenhum item encontrado'
              : 'Seu closet está vazio'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchTerm || activeFiltersCount > 0
              ? 'Tente ajustar os filtros ou a busca'
              : 'Toque no + para adicionar seu primeiro item'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApplyFilters={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333'
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  filterButton: {
    padding: 4,
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  addButton: {
    padding: 4
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  stat: {
    flex: 1,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginTop: 16
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center'
  },
  listContent: {
    paddingBottom: 20
  }
});
