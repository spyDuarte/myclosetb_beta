import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCloset } from '../contexts/ClosetContext';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function ItemDetailsScreen({ route, navigation }: any) {
  const { itemId } = route.params;
  const { getItemById, toggleFavorite, markAsWorn, deleteItem } = useCloset();
  const item = getItemById(itemId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showWornDialog, setShowWornDialog] = useState(false);

  if (!item) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Item não encontrado</Text>
      </View>
    );
  }

  const handleMarkAsWorn = async () => {
    await markAsWorn(itemId);
    setShowWornDialog(false);
  };

  const handleDelete = async () => {
    await deleteItem(itemId);
    setShowDeleteDialog(false);
    navigation.goBack();
  };

  // Calcular custo por uso
  const costPerWear = item.price && item.timesWorn > 0
    ? item.price / item.timesWorn
    : null;

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={[styles.placeholderImage, { backgroundColor: item.color }]}>
            <Ionicons name="shirt-outline" size={80} color="#fff" />
          </View>
          {item.favorite && (
            <View style={styles.favoriteBadge}>
              <Ionicons name="heart" size={24} color="#ff4444" />
            </View>
          )}
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

          {/* Informações Básicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
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
            {item.purchaseDate && (
              <InfoRow
                icon="calendar-outline"
                label="Comprado em"
                value={new Date(item.purchaseDate).toLocaleDateString('pt-BR')}
              />
            )}
          </View>

          {/* Estatísticas de Uso */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estatísticas de Uso</Text>
            <InfoRow
              icon="repeat-outline"
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
            {costPerWear && (
              <InfoRow
                icon="calculator-outline"
                label="Custo por uso"
                value={`R$ ${costPerWear.toFixed(2)}`}
                highlight
              />
            )}
          </View>

          {/* Estações */}
          {item.season && item.season.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estações</Text>
              <View style={styles.tags}>
                {item.season.map((s, index) => (
                  <View key={index} style={styles.tag}>
                    <Ionicons name="sunny-outline" size={14} color="#666" />
                    <Text style={styles.tagText}>{translateSeason(s)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tags}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={[styles.tag, styles.tagColored]}>
                    <Text style={styles.tagTextColored}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Notas */}
          {item.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notas</Text>
              <Text style={styles.notes}>{item.notes}</Text>
            </View>
          )}

          {/* Botões de Ação */}
          <TouchableOpacity
            style={styles.wornButton}
            onPress={() => setShowWornDialog(true)}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
            <Text style={styles.wornButtonText}>Marcar como Usado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteDialog(true)}
          >
            <Ionicons name="trash-outline" size={24} color="#fff" />
            <Text style={styles.deleteButtonText}>Excluir Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Diálogos de Confirmação */}
      <ConfirmDialog
        visible={showWornDialog}
        title="Marcar como Usado"
        message={`Deseja registrar o uso de "${item.name}"? O contador será incrementado.`}
        confirmText="Registrar"
        onConfirm={handleMarkAsWorn}
        onCancel={() => setShowWornDialog(false)}
      />

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir "${item.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  highlight?: boolean;
}

function InfoRow({ icon, label, value, highlight }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={20} color={highlight ? '#4CAF50' : '#666'} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>
        {value}
      </Text>
    </View>
  );
}

function translateSeason(season: string): string {
  const translations: Record<string, string> = {
    spring: 'Primavera',
    summer: 'Verão',
    fall: 'Outono',
    winter: 'Inverno',
    all_seasons: 'Todas'
  };
  return translations[season] || season;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoriteBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
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
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
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
  infoValueHighlight: {
    color: '#4CAF50',
    fontSize: 18
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8
  },
  tagColored: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  tagTextColored: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
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
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  wornButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  }
});
