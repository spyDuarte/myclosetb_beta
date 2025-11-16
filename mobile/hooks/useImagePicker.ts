import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * Hook customizado para gerenciar seleção de imagens
 * Suporta câmera e galeria com tratamento de permissões
 */
export function useImagePicker() {
  const [imageUri, setImageUri] = useState<string | undefined>();

  /**
   * Solicita permissão para acessar a câmera
   */
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Negada',
        'Precisamos de permissão para acessar a câmera.'
      );
      return false;
    }
    return true;
  };

  /**
   * Solicita permissão para acessar a galeria
   */
  const requestGalleryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Negada',
        'Precisamos de permissão para acessar suas fotos.'
      );
      return false;
    }
    return true;
  };

  /**
   * Abre a câmera para tirar uma foto
   */
  const takePhoto = async (): Promise<string | undefined> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return undefined;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        return uri;
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
      console.error('Erro ao tirar foto:', error);
    }

    return undefined;
  };

  /**
   * Abre a galeria para selecionar uma foto
   */
  const pickFromGallery = async (): Promise<string | undefined> => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return undefined;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        return uri;
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto.');
      console.error('Erro ao selecionar foto:', error);
    }

    return undefined;
  };

  /**
   * Mostra um menu para escolher entre câmera ou galeria
   */
  const showImagePickerOptions = (): Promise<void> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Adicionar Foto',
        'Escolha de onde deseja adicionar a foto',
        [
          {
            text: 'Tirar Foto',
            onPress: async () => {
              await takePhoto();
              resolve();
            }
          },
          {
            text: 'Escolher da Galeria',
            onPress: async () => {
              await pickFromGallery();
              resolve();
            }
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve()
          }
        ]
      );
    });
  };

  /**
   * Remove a imagem selecionada
   */
  const removeImage = () => {
    setImageUri(undefined);
  };

  /**
   * Define manualmente a URI da imagem (útil ao editar)
   */
  const setImage = (uri: string | undefined) => {
    setImageUri(uri);
  };

  return {
    imageUri,
    takePhoto,
    pickFromGallery,
    showImagePickerOptions,
    removeImage,
    setImage
  };
}
