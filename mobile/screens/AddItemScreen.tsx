import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCloset } from '../contexts/ClosetContext';
import { Category, Color, Season } from '../../src/models';

export function AddItemScreen({ navigation }: any) {
  const { addItem } = useCloset();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(Category.TOPS);
  const [color, setColor] = useState<Color>(Color.WHITE);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([Season.ALL_SEASONS]);

  const handleSubmit = async () => {
    // Validação de nome
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, digite um nome para o item');
      return;
    }

    if (name.trim().length > 100) {
      Alert.alert('Erro', 'Nome muito longo (máximo 100 caracteres)');
      return;
    }

    // Validação de marca
    if (brand && brand.length > 50) {
      Alert.alert('Erro', 'Marca muito longa (máximo 50 caracteres)');
      return;
    }

    // Validação de preço
    let parsedPrice: number | undefined;
    if (price) {
      parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        Alert.alert('Erro', 'Preço inválido. Digite apenas números.');
        return;
      }
      if (parsedPrice < 0) {
        Alert.alert('Erro', 'Preço não pode ser negativo.');
        return;
      }
      if (parsedPrice > 999999.99) {
        Alert.alert('Erro', 'Preço muito alto (máximo R$ 999.999,99)');
        return;
      }
    }

    // Validação de notas
    if (notes && notes.length > 500) {
      Alert.alert('Erro', 'Notas muito longas (máximo 500 caracteres)');
      return;
    }

    try {
      await addItem({
        name: name.trim(),
        category,
        color,
        brand: brand.trim() || undefined,
        size: size.trim() || undefined,
        price: parsedPrice,
        season: selectedSeasons,
        notes: notes.trim() || undefined
      });

      Alert.alert('Sucesso', 'Item adicionado ao closet!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível adicionar o item';
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome do Item *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Camiseta Básica Branca"
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            <Picker.Item label="Blusas/Camisetas" value={Category.TOPS} />
            <Picker.Item label="Calças/Shorts" value={Category.BOTTOMS} />
            <Picker.Item label="Vestidos" value={Category.DRESSES} />
            <Picker.Item label="Jaquetas/Casacos" value={Category.OUTERWEAR} />
            <Picker.Item label="Calçados" value={Category.SHOES} />
            <Picker.Item label="Acessórios" value={Category.ACCESSORIES} />
            <Picker.Item label="Bolsas" value={Category.BAGS} />
            <Picker.Item label="Joias" value={Category.JEWELRY} />
            <Picker.Item label="Roupa Íntima" value={Category.UNDERWEAR} />
            <Picker.Item label="Roupas Esportivas" value={Category.ACTIVEWEAR} />
            <Picker.Item label="Pijamas" value={Category.SLEEPWEAR} />
            <Picker.Item label="Outro" value={Category.OTHER} />
          </Picker>
        </View>

        <Text style={styles.label}>Cor</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={color}
            onValueChange={setColor}
            style={styles.picker}
          >
            <Picker.Item label="Preto" value={Color.BLACK} />
            <Picker.Item label="Branco" value={Color.WHITE} />
            <Picker.Item label="Cinza" value={Color.GRAY} />
            <Picker.Item label="Vermelho" value={Color.RED} />
            <Picker.Item label="Azul" value={Color.BLUE} />
            <Picker.Item label="Verde" value={Color.GREEN} />
            <Picker.Item label="Amarelo" value={Color.YELLOW} />
            <Picker.Item label="Laranja" value={Color.ORANGE} />
            <Picker.Item label="Roxo" value={Color.PURPLE} />
            <Picker.Item label="Rosa" value={Color.PINK} />
            <Picker.Item label="Marrom" value={Color.BROWN} />
            <Picker.Item label="Bege" value={Color.BEIGE} />
            <Picker.Item label="Multicolorido" value={Color.MULTICOLOR} />
            <Picker.Item label="Outra" value={Color.OTHER} />
          </Picker>
        </View>

        <Text style={styles.label}>Marca</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
          placeholder="Ex: Zara, Nike, etc"
        />

        <Text style={styles.label}>Tamanho</Text>
        <TextInput
          style={styles.input}
          value={size}
          onChangeText={setSize}
          placeholder="Ex: M, 38, 42, etc"
        />

        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Ex: 49.90"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Notas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Observações sobre o item"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Adicionar Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  form: {
    padding: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden'
  },
  picker: {
    height: 50
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#999',
    marginTop: 12,
    marginBottom: 32
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600'
  }
});
