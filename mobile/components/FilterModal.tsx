import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category, Color, Season } from '../../src/models';
import { getAllCategoryOptions, getAllColorOptions } from '../utils/labels';

export type SortOption = 'name-asc' | 'name-desc' | 'date-new' | 'date-old' | 'price-high' | 'price-low' | 'worn-most' | 'worn-least';

export interface FilterOptions {
  categories: Category[];
  colors: Color[];
  seasons: Season[];
  onlyFavorites: boolean;
  priceMin?: number;
  priceMax?: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function FilterModal({
  visible,
  onClose,
  filters,
  onApplyFilters,
  sortBy,
  onSortChange
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleCategory = (category: Category) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleColor = (color: Color) => {
    setLocalFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const toggleSeason = (season: Season) => {
    setLocalFilters(prev => ({
      ...prev,
      seasons: prev.seasons.includes(season)
        ? prev.seasons.filter(s => s !== season)
        : [...prev.seasons, season]
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: FilterOptions = {
      categories: [],
      colors: [],
      seasons: [],
      onlyFavorites: false
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const sortOptions: Array<{ value: SortOption; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { value: 'name-asc', label: 'Nome (A-Z)', icon: 'text-outline' },
    { value: 'name-desc', label: 'Nome (Z-A)', icon: 'text-outline' },
    { value: 'date-new', label: 'Mais Recentes', icon: 'time-outline' },
    { value: 'date-old', label: 'Mais Antigos', icon: 'time-outline' },
    { value: 'price-high', label: 'Maior Preço', icon: 'cash-outline' },
    { value: 'price-low', label: 'Menor Preço', icon: 'cash-outline' },
    { value: 'worn-most', label: 'Mais Usados', icon: 'star-outline' },
    { value: 'worn-least', label: 'Menos Usados', icon: 'star-outline' }
  ];

  const categoryOptions = getAllCategoryOptions();
  const colorOptions = getAllColorOptions();

  const seasons: Array<{ value: Season; label: string }> = [
    { value: Season.SPRING, label: 'Primavera' },
    { value: Season.SUMMER, label: 'Verão' },
    { value: Season.FALL, label: 'Outono' },
    { value: Season.WINTER, label: 'Inverno' },
    { value: Season.ALL_SEASONS, label: 'Todas as Estações' }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filtros e Ordenação</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearButton}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Ordenação */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordenar Por</Text>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  sortBy === option.value && styles.optionSelected
                ]}
                onPress={() => onSortChange(option.value)}
              >
                <View style={styles.optionLeft}>
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={sortBy === option.value ? '#007AFF' : '#666'}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      sortBy === option.value && styles.optionTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {sortBy === option.value && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Favoritos */}
          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View style={styles.optionLeft}>
                <Ionicons name="heart" size={20} color="#ff4444" />
                <Text style={styles.sectionTitle}>Apenas Favoritos</Text>
              </View>
              <Switch
                value={localFilters.onlyFavorites}
                onValueChange={value =>
                  setLocalFilters(prev => ({ ...prev, onlyFavorites: value }))
                }
                trackColor={{ false: '#ddd', true: '#007AFF' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Categorias */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <View style={styles.chipContainer}>
              {categoryOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.chip,
                    localFilters.categories.includes(option.value) && styles.chipSelected
                  ]}
                  onPress={() => toggleCategory(option.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localFilters.categories.includes(option.value) && styles.chipTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cores */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cores</Text>
            <View style={styles.chipContainer}>
              {colorOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.chip,
                    localFilters.colors.includes(option.value) && styles.chipSelected
                  ]}
                  onPress={() => toggleColor(option.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localFilters.colors.includes(option.value) && styles.chipTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Estações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estações</Text>
            <View style={styles.chipContainer}>
              {seasons.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.chip,
                    localFilters.seasons.includes(option.value) && styles.chipSelected
                  ]}
                  onPress={() => toggleSeason(option.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localFilters.seasons.includes(option.value) && styles.chipTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  clearButton: {
    fontSize: 16,
    color: '#007AFF'
  },
  content: {
    flex: 1
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  optionSelected: {
    backgroundColor: '#f0f8ff'
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  optionText: {
    fontSize: 16,
    color: '#666'
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '600'
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },
  chipText: {
    fontSize: 14,
    color: '#666'
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600'
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center'
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});
