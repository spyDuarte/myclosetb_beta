import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCloset } from '../contexts/ClosetContext';

export function StatsScreen() {
  const { getStatistics } = useCloset();
  const stats = getStatistics();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="stats-chart" size={40} color="#007AFF" />
        <Text style={styles.title}>Estatísticas do Closet</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.statCard}>
          <Ionicons name="shirt-outline" size={32} color="#007AFF" />
          <Text style={styles.statValue}>{stats.totalItems}</Text>
          <Text style={styles.statLabel}>Total de Itens</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="cash-outline" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>R$ {stats.totalValue.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Valor Total</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="heart" size={32} color="#ff4444" />
          <Text style={styles.statValue}>{stats.favoriteItems}</Text>
          <Text style={styles.statLabel}>Itens Favoritos</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="repeat-outline" size={32} color="#9C27B0" />
          <Text style={styles.statValue}>
            {stats.averageTimesWorn.toFixed(1)}x
          </Text>
          <Text style={styles.statLabel}>Média de Uso</Text>
        </View>
      </View>

      {stats.mostWornItem && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Mais Usado</Text>
          <View style={styles.highlightCard}>
            <View style={styles.highlightHeader}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.highlightTitle}>{stats.mostWornItem.name}</Text>
            </View>
            <Text style={styles.highlightSubtitle}>
              {stats.mostWornItem.brand || 'Sem marca'}
            </Text>
            <Text style={styles.highlightStat}>
              Usado {stats.mostWornItem.timesWorn} vezes
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itens por Categoria</Text>
        {Object.entries(stats.categoryCounts).map(([category, count]) => (
          <View key={category} style={styles.categoryRow}>
            <View style={styles.categoryLeft}>
              <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
              <Text style={styles.categoryLabel}>{getCategoryLabel(category)}</Text>
            </View>
            <View style={styles.categoryRight}>
              <Text style={styles.categoryCount}>{count}</Text>
              <View style={styles.categoryBar}>
                <View
                  style={[
                    styles.categoryBarFill,
                    {
                      width: `${(count / stats.totalItems) * 100}%`,
                      backgroundColor: getCategoryColor(category)
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {stats.totalItems === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="stats-chart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma estatística disponível</Text>
          <Text style={styles.emptySubtext}>
            Adicione itens ao seu closet para ver suas estatísticas
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    tops: 'Blusas/Camisetas',
    bottoms: 'Calças/Shorts',
    dresses: 'Vestidos',
    outerwear: 'Jaquetas/Casacos',
    shoes: 'Calçados',
    accessories: 'Acessórios',
    bags: 'Bolsas',
    jewelry: 'Joias',
    underwear: 'Roupa Íntima',
    activewear: 'Roupas Esportivas',
    sleepwear: 'Pijamas',
    other: 'Outro'
  };
  return labels[category] || category;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    tops: '#007AFF',
    bottoms: '#5856D6',
    dresses: '#FF2D55',
    outerwear: '#AF52DE',
    shoes: '#FF9500',
    accessories: '#FFCC00',
    bags: '#FF3B30',
    jewelry: '#FFD700',
    underwear: '#34C759',
    activewear: '#00C7BE',
    sleepwear: '#5AC8FA',
    other: '#8E8E93'
  };
  return colors[category] || '#999';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingTop: 60,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8
  },
  section: {
    padding: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  highlightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  highlightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1
  },
  highlightSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8
  },
  highlightStat: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF'
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  categoryLabel: {
    fontSize: 14,
    color: '#333'
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    width: 30,
    textAlign: 'right'
  },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 4
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40
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
  }
});
