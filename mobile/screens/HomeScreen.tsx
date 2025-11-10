import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCloset } from '../contexts/ClosetContext';
import { ClosetItemCard } from '../components/ClosetItemCard';
import { Loading } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { Category, ClosetItem } from '../../src/models';

type SortOption = 'name' | 'recent' | 'mostUsed' | 'price';
type FilterOption = 'all' | 'favorites' | Category;

export function HomeScreen({ navigation }: any) {
  const { items, loading, toggleFavorite, searchItems } = useCloset();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar e ordenar itens
  const filteredAndSortedItems = useMemo(() => {
    let result: ClosetItem[] = [];

    // Aplicar filtros
    if (searchTerm) {
      result = searchItems({ searchTerm });
    } else if (filterBy === 'favorites') {
      result = searchItems({ favorite: true });
    } else if (filterBy !== 'all') {
      result = searchItems({ category: filterBy as Category });
    } else {
      result = items;
    }

    // Aplicar ordenação
    const sorted = [...result];
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'mostUsed':
        sorted.sort((a, b) => b.timesWorn - a.timesWorn);
        break;
      case 'price':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'recent':
      default:
        sorted.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return sorted;
  }, [items, searchTerm, sortBy, filterBy, searchItems]);

  const handleToggleFavorite = useCallback(async (id: string) => {
    await toggleFavorite(id);
  }, [toggleFavorite]);

  const handleItemPress = useCallback((itemId: string) => {
    navigation.navigate('ItemDetails', { itemId });
  }, [navigation]);

  if (loading) {
    return <Loading message="Carregando closet..." />;
  }

  const stats = {
    total: items.length,
    favorites: items.filter(i => i.favorite).length,
    totalValue: items.reduce((sum, i) => sum + (i.price || 0), 0)
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meu Closet</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons
              name={showFilters ? "options" : "options-outline"}
              size={28}
              color="#007AFF"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddItem')}
          >
            <Ionicons name="add-circle" size={32} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar itens..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          clearButtonMode="while-editing"
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filters and Sort */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterTitle}>Ordenar por:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <FilterChip
              label="Mais recentes"
              selected={sortBy === 'recent'}
              onPress={() => setSortBy('recent')}
            />
            <FilterChip
              label="Nome A-Z"
              selected={sortBy === 'name'}
              onPress={() => setSortBy('name')}
            />
            <FilterChip
              label="Mais usados"
              selected={sortBy === 'mostUsed'}
              onPress={() => setSortBy('mostUsed')}
            />
            <FilterChip
              label="Preço"
              selected={sortBy === 'price'}
              onPress={() => setSortBy('price')}
            />
          </ScrollView>

          <Text style={styles.filterTitle}>Filtrar por:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <FilterChip
              label="Todos"
              selected={filterBy === 'all'}
              onPress={() => setFilterBy('all')}
            />
            <FilterChip
              label="Favoritos"
              icon="heart"
              selected={filterBy === 'favorites'}
              onPress={() => setFilterBy('favorites')}
            />
            <FilterChip
              label="Blusas"
              selected={filterBy === Category.TOPS}
              onPress={() => setFilterBy(Category.TOPS)}
            />
            <FilterChip
              label="Calças"
              selected={filterBy === Category.BOTTOMS}
              onPress={() => setFilterBy(Category.BOTTOMS)}
            />
            <FilterChip
              label="Vestidos"
              selected={filterBy === Category.DRESSES}
              onPress={() => setFilterBy(Category.DRESSES)}
            />
            <FilterChip
              label="Calçados"
              selected={filterBy === Category.SHOES}
              onPress={() => setFilterBy(Category.SHOES)}
            />
          </ScrollView>
        </View>
      )}

      {/* Stats Bar */}
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
          <Text style={styles.statNumber}>{stats.totalValue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>R$ Total</Text>
        </View>
      </View>

      {/* Items List */}
      {filteredAndSortedItems.length === 0 ? (
        <EmptyState
          icon="shirt-outline"
          title={searchTerm ? 'Nenhum item encontrado' : 'Seu closet está vazio'}
          message={searchTerm ? 'Tente outro termo de busca' : 'Toque no + para adicionar seu primeiro item'}
        />
      ) : (
        <FlatList
          data={filteredAndSortedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClosetItemCard
              item={item}
              onPress={() => handleItemPress(item.id)}
              onFavoritePress={() => handleToggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

const FilterChip = React.memo(({ label, selected, onPress, icon }: FilterChipProps) => (
  <TouchableOpacity
    style={[styles.filterChip, selected && styles.filterChipSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon && (
      <Ionicons
        name={icon}
        size={16}
        color={selected ? '#fff' : '#666'}
        style={styles.chipIcon}
      />
    )}
    <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
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
    gap: 8
  },
  iconButton: {
    padding: 4
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
  filtersContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 4
  },
  filterScroll: {
    marginBottom: 8
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8
  },
  filterChipSelected: {
    backgroundColor: '#007AFF'
  },
  chipIcon: {
    marginRight: 4
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  filterChipTextSelected: {
    color: '#fff'
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
  listContent: {
    paddingBottom: 20
  }
});
