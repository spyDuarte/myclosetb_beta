import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { ErrorBoundary } from './mobile/components/ErrorBoundary';
import { ClosetProvider } from './mobile/contexts/ClosetContext';
import { initErrorReporting, routingInstrumentation } from './mobile/utils/errorReporting';
import { HomeScreen } from './mobile/screens/HomeScreen';
import { AddItemScreen } from './mobile/screens/AddItemScreen';
import { EditItemScreen } from './mobile/screens/EditItemScreen';
import { ItemDetailsScreen } from './mobile/screens/ItemDetailsScreen';
import { StatsScreen } from './mobile/screens/StatsScreen';

import * as Sentry from '@sentry/react-native';

initErrorReporting();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{
          title: 'Adicionar Item',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{
          title: 'Editar Item',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetailsScreen}
        options={{
          title: 'Detalhes do Item',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Closet' }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ tabBarLabel: 'Estatísticas' }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const navigation = React.useRef(null);

  return (
    <ErrorBoundary>
      <ClosetProvider>
        <NavigationContainer
          ref={navigation}
          onReady={() => {
            // Register the navigation container with the instrumentation
            routingInstrumentation.registerNavigationContainer(navigation);
          }}
        >
          <MainTabs />
          <StatusBar style="auto" />
        </NavigationContainer>
      </ClosetProvider>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(App);
