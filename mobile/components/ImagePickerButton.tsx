import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface ImagePickerButtonProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  onImageRemoved?: () => void;
}

export function ImagePickerButton({
  imageUri,
  onImageSelected,
  onImageRemoved
}: ImagePickerButtonProps) {
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permissões Necessárias',
          'Precisamos de permissão para acessar sua câmera e galeria de fotos.'
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      setLoading(true);
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8
          });

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Adicionar Foto',
      'Escolha uma opção:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tirar Foto', onPress: () => pickImage(true) },
        { text: 'Escolher da Galeria', onPress: () => pickImage(false) }
      ]
    );
  };

  const showRemoveOption = () => {
    Alert.alert(
      'Remover Foto',
      'Deseja remover a foto atual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: onImageRemoved
        }
      ]
    );
  };

  if (imageUri) {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.imageActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={showImageOptions}
          >
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </TouchableOpacity>
          {onImageRemoved && (
            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={showRemoveOption}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.placeholder}
      onPress={showImageOptions}
      disabled={loading}
    >
      <Ionicons name="camera-outline" size={40} color="#999" />
      <Text style={styles.placeholderText}>
        {loading ? 'Carregando...' : 'Adicionar Foto'}
      </Text>
      <Text style={styles.placeholderSubtext}>
        Toque para tirar uma foto ou escolher da galeria
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#f0f0f0'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  imageActions: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    borderRadius: 20,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)'
  },
  placeholder: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center'
  }
});
