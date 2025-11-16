// Configuração do ambiente de testes para React Native Testing Library
// Os matchers estão embutidos no @testing-library/react-native 12.4+

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock do Expo Vector Icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const createMockIcon = (name: string) => {
    const Icon = (props: any) => {
      return React.createElement(Text, {
        ...props,
        testID: `icon-${props.name}`,
      }, props.name);
    };
    Icon.displayName = name;
    return Icon;
  };

  return {
    Ionicons: createMockIcon('Ionicons'),
    MaterialIcons: createMockIcon('MaterialIcons'),
    FontAwesome: createMockIcon('FontAwesome'),
    Feather: createMockIcon('Feather'),
    AntDesign: createMockIcon('AntDesign'),
    Entypo: createMockIcon('Entypo'),
  };
});

// Silencia warnings específicos do React Native durante os testes
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args: any[]) => {
    // Ignora warnings conhecidos do React Native em testes
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Animated:') ||
       args[0].includes('EventEmitter') ||
       args[0].includes('componentWillReceiveProps'))
    ) {
      return;
    }
    originalWarn(...args);
  };

  console.error = (...args: any[]) => {
    // Ignora erros conhecidos do React Native em testes
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Not implemented: HTMLFormElement'))
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
