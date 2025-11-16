import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

/**
 * Skeleton loading para ClosetItemCard
 * Corresponde exatamente ao layout do card real
 */
export function ItemCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Image placeholder */}
      <View style={styles.imageContainer}>
        <SkeletonLoader width="100%" height={120} borderRadius={0} />
      </View>

      {/* Content area */}
      <View style={styles.content}>
        {/* Header: Name + Favorite icon */}
        <View style={styles.header}>
          <SkeletonLoader width="70%" height={18} style={styles.name} />
          <SkeletonLoader width={24} height={24} borderRadius={12} />
        </View>

        {/* Brand */}
        <SkeletonLoader width="50%" height={14} style={styles.brand} />

        {/* Tags */}
        <View style={styles.tags}>
          <SkeletonLoader width={80} height={24} borderRadius={12} style={styles.tag} />
          <SkeletonLoader width={70} height={24} borderRadius={12} style={styles.tag} />
          <SkeletonLoader width={60} height={24} borderRadius={12} style={styles.tag} />
        </View>

        {/* Footer: Times worn + Price */}
        <View style={styles.footer}>
          <SkeletonLoader width={80} height={12} />
          <SkeletonLoader width={70} height={16} />
        </View>
      </View>
    </View>
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
    marginBottom: 0
  },
  brand: {
    marginBottom: 8
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  tag: {
    marginRight: 6,
    marginBottom: 4
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
