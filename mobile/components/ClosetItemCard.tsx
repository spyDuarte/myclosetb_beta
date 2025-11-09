import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClosetItem } from '../../src/models';

interface ClosetItemCardProps {
  item: ClosetItem;
  onPress: () => void;
  onFavoritePress: () => void;
}

export function ClosetItemCard({ item, onPress, onFavoritePress }: ClosetItemCardProps) {
  const getCategoryIcon = () => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      tops: 'shirt-outline',
      bottoms: 'body-outline',
      dresses: 'woman-outline',
      outerwear: 'shield-outline',
      shoes: 'footsteps-outline',
      accessories: 'watch-outline',
      bags: 'bag-outline',
      jewelry: 'diamond-outline',
      underwear: 'body-outline',
      activewear: 'fitness-outline',
      sleepwear: 'bed-outline'
    };
    return iconMap[item.category] || 'shirt-outline';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: item.color }]}>
            <Ionicons name={getCategoryIcon()} size={40} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={onFavoritePress}>
            <Ionicons
              name={item.favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={item.favorite ? '#ff4444' : '#999'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.brand} numberOfLines={1}>
          {item.brand || 'Sem marca'}
        </Text>

        <View style={styles.tags}>
          <View style={styles.tag}>
            <Ionicons name="pricetag-outline" size={14} color="#666" />
            <Text style={styles.tagText}>{item.category}</Text>
          </View>

          <View style={styles.tag}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={styles.tagText}>{item.color}</Text>
          </View>

          {item.size && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Tam. {item.size}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.wornText}>
            <Ionicons name="calendar-outline" size={12} /> Usado {item.timesWorn}x
          </Text>
          {item.price && (
            <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  imageContainer: {
    width: 100,
    height: 120
  },
  image: {
    width: '100%',
    height: '100%'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1,
    padding: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  wornText: {
    fontSize: 12,
    color: '#999'
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50'
  }
});
