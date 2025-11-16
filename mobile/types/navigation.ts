import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

/**
 * Tipos de navegação do aplicativo
 */

// Parâmetros do Stack de Home
export type HomeStackParamList = {
  HomeMain: undefined;
  AddItem: undefined;
  ItemDetails: { itemId: string };
};

// Parâmetros das Tabs principais
export type RootTabParamList = {
  Home: undefined;
  Stats: undefined;
};

// Props para telas do HomeStack
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;
export type AddItemScreenProps = NativeStackScreenProps<HomeStackParamList, 'AddItem'>;
export type ItemDetailsScreenProps = NativeStackScreenProps<HomeStackParamList, 'ItemDetails'>;

// Props para telas das Tabs
export type StatsScreenProps = BottomTabScreenProps<RootTabParamList, 'Stats'>;

// Props compostas (quando tela está em Stack dentro de Tab)
export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;
