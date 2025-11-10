import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCloset } from '../contexts/ClosetContext';

export function ItemDetailsScreen({ route, navigation }: any) {
  const { itemId } = route.params;
  const { getItemById, toggleFavorite, markAsWorn, deleteItem } = useCloset();
  const item = getItemById(itemId);

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text>Item não encontrado</Text>
      </View>
    );
  }

  const handleMarkAsWorn = async () => {
    await markAsWorn(itemId);
    Alert.alert('Registrado!', `${item.name} foi marcado como usado`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteItem(itemId);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
        <View style={[styles.placeholderImage, { backgroundColor: item.color }]}>
          <Ionicons name="shirt-outline" size={80} color="#fff" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(itemId)}>
            <Ionicons
              name={item.favorite ? 'heart' : 'heart-outline'}
              size={32}
              color={item.favorite ? '#ff4444' : '#999'}
            />
          </TouchableOpacity>
        </View>

        {item.brand && (
          <Text style={styles.brand}>{item.brand}</Text>
        )}

        <View style={styles.section}>
          <InfoRow icon="pricetag-outline" label="Categoria" value={item.category} />
          <InfoRow icon="color-palette-outline" label="Cor" value={item.color} />
          {item.size && (
            <InfoRow icon="resize-outline" label="Tamanho" value={item.size} />
          )}
          {item.price && (
            <InfoRow
              icon="cash-outline"
              label="Preço"
              value={`R$ ${item.price.toFixed(2)}`}
            />
          )}
        </View>

        <View style={styles.section}>
          <InfoRow
            icon="calendar-outline"
            label="Vezes usado"
            value={`${item.timesWorn}x`}
          />
          {item.lastWornDate && (
            <InfoRow
              icon="time-outline"
              label="Último uso"
              value={new Date(item.lastWornDate).toLocaleDateString('pt-BR')}
            />
          )}
          <InfoRow
            icon="star-outline"
            label="Favorito"
            value={item.favorite ? 'Sim' : 'Não'}
          />
        </View>

        {item.season && item.season.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estações</Text>
            <View style={styles.tags}>
              {item.season.map((s, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {item.tags && item.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tags}>
              {item.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {item.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas</Text>
            <Text style={styles.notes}>{item.notes}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.wornButton} onPress={handleMarkAsWorn}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
          <Text style={styles.wornButtonText}>Marcar como Usado</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.deleteButtonText}>Excluir Item</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={20} color="#666" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  container: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: '100%',
    height: 300
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8
  },
  tagText: {
    fontSize: 14,
    color: '#666'
  },
  notes: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  wornButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8
  },
  wornButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 32
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  }
});
