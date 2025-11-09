import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCloset } from '../contexts/ClosetContext';
import { ClosetItemCard } from '../components/ClosetItemCard';
import { Category } from '../../src/models';

export function HomeScreen({ navigation }: any) {
  const { items, loading, toggleFavorite, searchItems } = useCloset();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | undefined>();

  const filteredItems = searchTerm || filterCategory
    ? searchItems({ searchTerm, category: filterCategory })
    : items;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando closet...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Closet</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Ionicons name="add-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
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
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>Itens</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {items.filter(i => i.favorite).length}
          </Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {items.reduce((sum, i) => sum + (i.price || 0), 0).toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>R$ Total</Text>
        </View>
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="shirt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchTerm
              ? 'Nenhum item encontrado'
              : 'Seu closet está vazio'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchTerm
              ? 'Tente outro termo de busca'
              : 'Toque no + para adicionar seu primeiro item'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClosetItemCard
              item={item}
              onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
              onFavoritePress={() => toggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333'
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
