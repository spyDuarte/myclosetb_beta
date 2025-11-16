/**
 * Configurações centralizadas do aplicativo MyCloset Beta
 *
 * Este arquivo contém todas as configurações necessárias para o aplicativo
 * funcionar corretamente em iOS e Android.
 */

import { Platform } from 'react-native';

/**
 * Informações básicas do aplicativo
 */
export const APP_INFO = {
  name: 'MyCloset',
  displayName: 'MyCloset - Seu Closet Virtual',
  version: '1.0.0',
  buildNumber: 1,
  bundleId: 'com.spyduarte.mycloset',
  description: 'Aplicativo para gerenciar seu guarda-roupa digitalmente',
  author: 'spyDuarte',
  website: 'https://github.com/spyDuarte/myclosetb_beta',
} as const;

/**
 * Configurações de armazenamento
 */
export const STORAGE = {
  KEYS: {
    ITEMS: '@mycloset:items',
    USER_PREFERENCES: '@mycloset:preferences',
    ONBOARDING_COMPLETED: '@mycloset:onboarding',
    THEME: '@mycloset:theme',
  },
  MAX_ITEMS: 10000, // Limite máximo de itens no closet
  AUTO_SAVE_DELAY: 500, // ms - Delay para auto-save após edição
} as const;

/**
 * Configurações de tema e cores
 */
export const THEME = {
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#4CAF50',
    WARNING: '#FF9500',
    DANGER: '#FF3B30',
    INFO: '#5AC8FA',

    // Cores de texto
    TEXT_PRIMARY: '#000000',
    TEXT_SECONDARY: '#8E8E93',
    TEXT_TERTIARY: '#C7C7CC',

    // Cores de fundo
    BACKGROUND: '#FFFFFF',
    BACKGROUND_SECONDARY: '#F2F2F7',
    CARD_BACKGROUND: '#FFFFFF',

    // Cores de borda e separadores
    BORDER: '#C6C6C8',
    SEPARATOR: '#E5E5EA',

    // Cores específicas
    FAVORITE: '#FF4444',
    PRICE: '#4CAF50',
    LOADING: '#007AFF',
  },

  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },

  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    ROUND: 999,
  },

  FONT_SIZES: {
    XS: 11,
    SM: 13,
    MD: 15,
    LG: 17,
    XL: 20,
    XXL: 28,
    XXXL: 34,
  },

  SHADOWS: {
    SMALL: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    MEDIUM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    LARGE: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
} as const;

/**
 * Configurações de imagem e mídia
 */
export const MEDIA = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    QUALITY: 0.8, // Qualidade de compressão (0-1)
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    THUMBNAIL_SIZE: 200, // pixels
  },

  CAMERA: {
    QUALITY: 0.8,
    ALLOW_EDITING: true,
    ASPECT_RATIO: [4, 3] as [number, number],
  },
} as const;

/**
 * Configurações de busca e filtros
 */
export const SEARCH = {
  DEBOUNCE_DELAY: 300, // ms - Delay para busca enquanto digita
  MIN_SEARCH_LENGTH: 2, // Caracteres mínimos para iniciar busca
  MAX_RESULTS: 100, // Número máximo de resultados exibidos
  HIGHLIGHT_COLOR: '#FFEB3B', // Cor para destacar termos de busca
} as const;

/**
 * Configurações de performance
 */
export const PERFORMANCE = {
  LIST: {
    INITIAL_NUM_TO_RENDER: 10, // Itens iniciais renderizados
    MAX_TO_RENDER_PER_BATCH: 10, // Itens renderizados por vez
    WINDOW_SIZE: 5, // Tamanho da janela de renderização
  },

  ANIMATION: {
    DURATION_SHORT: 200, // ms
    DURATION_MEDIUM: 300, // ms
    DURATION_LONG: 500, // ms
  },
} as const;

/**
 * Configurações de validação
 */
export const VALIDATION = {
  ITEM_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },

  BRAND: {
    MAX_LENGTH: 50,
  },

  NOTES: {
    MAX_LENGTH: 500,
  },

  TAGS: {
    MAX_COUNT: 20,
    MAX_LENGTH_PER_TAG: 30,
  },

  PRICE: {
    MIN: 0,
    MAX: 999999.99,
  },
} as const;

/**
 * Configurações específicas de plataforma
 */
export const PLATFORM_CONFIG = {
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
  IS_WEB: Platform.OS === 'web',

  // Configurações específicas do iOS
  IOS: {
    STATUSBAR_STYLE: 'dark-content' as const,
    SAFE_AREA_EDGES: ['top', 'bottom'] as const,
    HAPTIC_FEEDBACK: true,
  },

  // Configurações específicas do Android
  ANDROID: {
    STATUSBAR_TRANSLUCENT: false,
    STATUSBAR_BACKGROUND_COLOR: '#007AFF',
    NAVIGATION_BAR_COLOR: '#FFFFFF',
    RIPPLE_COLOR: 'rgba(0, 122, 255, 0.2)',
  },
} as const;

/**
 * Configurações de navegação
 */
export const NAVIGATION = {
  HEADER_HEIGHT: Platform.OS === 'ios' ? 44 : 56,
  TAB_BAR_HEIGHT: Platform.OS === 'ios' ? 50 : 56,

  ANIMATION_ENABLED: true,
  GESTURE_ENABLED: true,

  SCREENS: {
    HOME: 'HomeMain',
    ADD_ITEM: 'AddItem',
    ITEM_DETAILS: 'ItemDetails',
    STATS: 'Stats',
  } as const,
} as const;

/**
 * Configurações de notificações e feedback
 */
export const FEEDBACK = {
  TOAST_DURATION: 3000, // ms

  MESSAGES: {
    SUCCESS: {
      ITEM_ADDED: 'Item adicionado com sucesso!',
      ITEM_UPDATED: 'Item atualizado com sucesso!',
      ITEM_DELETED: 'Item removido com sucesso!',
      FAVORITE_ADDED: 'Adicionado aos favoritos!',
      FAVORITE_REMOVED: 'Removido dos favoritos!',
    },
    ERROR: {
      GENERIC: 'Algo deu errado. Tente novamente.',
      STORAGE: 'Erro ao salvar dados. Verifique o espaço disponível.',
      CAMERA: 'Não foi possível acessar a câmera.',
      GALLERY: 'Não foi possível acessar a galeria.',
      IMAGE_TOO_LARGE: 'A imagem é muito grande. Máximo: 5MB',
      INVALID_DATA: 'Dados inválidos. Verifique as informações.',
    },
    WARNING: {
      DELETE_CONFIRMATION: 'Tem certeza que deseja remover este item?',
      CLEAR_SEARCH: 'Limpar busca?',
    },
  },
} as const;

/**
 * Configurações de analytics e logs
 */
export const ANALYTICS = {
  ENABLED: false, // Ativar quando integrar analytics
  DEBUG_MODE: __DEV__, // Logs detalhados em desenvolvimento

  EVENTS: {
    ITEM_ADDED: 'item_added',
    ITEM_UPDATED: 'item_updated',
    ITEM_DELETED: 'item_deleted',
    ITEM_VIEWED: 'item_viewed',
    SEARCH_PERFORMED: 'search_performed',
    FILTER_APPLIED: 'filter_applied',
    FAVORITE_TOGGLED: 'favorite_toggled',
    STATS_VIEWED: 'stats_viewed',
  } as const,
} as const;

/**
 * Configurações de desenvolvimento
 */
export const DEV_CONFIG = {
  ENABLE_LOGS: __DEV__,
  ENABLE_WARNINGS: __DEV__,
  ENABLE_PERFORMANCE_MONITOR: __DEV__,
  ENABLE_MOCK_DATA: false, // Ativar para popular com dados de teste

  // Configurações de debug
  DEBUG: {
    SHOW_BOUNDARIES: false, // Mostrar limites de componentes
    SHOW_FPS: false, // Mostrar FPS
    SLOW_ANIMATIONS: false, // Desacelerar animações para debug
  },
} as const;

/**
 * URLs e endpoints (para futuras integrações)
 */
export const URLS = {
  API_BASE: '', // Será preenchido quando houver backend
  PRIVACY_POLICY: '',
  TERMS_OF_SERVICE: '',
  SUPPORT_EMAIL: 'support@mycloset.app',
  GITHUB: 'https://github.com/spyDuarte/myclosetb_beta',
} as const;

/**
 * Configurações de acessibilidade
 */
export const ACCESSIBILITY = {
  ENABLE_SCREEN_READER: true,
  MINIMUM_TOUCH_TARGET: 44, // pixels - Tamanho mínimo recomendado
  REDUCE_MOTION: false, // Respeitar preferências do sistema

  LABELS: {
    ADD_ITEM: 'Adicionar novo item ao closet',
    DELETE_ITEM: 'Remover item do closet',
    FAVORITE_ITEM: 'Marcar como favorito',
    UNFAVORITE_ITEM: 'Remover dos favoritos',
    SEARCH_INPUT: 'Campo de busca de itens',
    FILTER_BUTTON: 'Abrir filtros de busca',
  },
} as const;

/**
 * Exportação de configuração consolidada
 */
export const CONFIG = {
  APP_INFO,
  STORAGE,
  THEME,
  MEDIA,
  SEARCH,
  PERFORMANCE,
  VALIDATION,
  PLATFORM_CONFIG,
  NAVIGATION,
  FEEDBACK,
  ANALYTICS,
  DEV_CONFIG,
  URLS,
  ACCESSIBILITY,
} as const;

// Tipo para TypeScript
export type AppConfig = typeof CONFIG;

// Export default para facilitar importação
export default CONFIG;
