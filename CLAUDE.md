# CLAUDE.md - AI Assistant Guide for MyCloset Beta

## Project Overview

**MyCloset Beta** is a virtual closet management system built with TypeScript. It helps users organize their wardrobe digitally, track clothing usage, create outfits, and manage their closet efficiently.

**Primary Language**: Portuguese (Brazilian)
**Main Tech Stack**: React Native (Expo), TypeScript, Node.js
**Target Platforms**: iOS, Android, CLI

### Key Features
- Add, edit, and remove closet items
- Categorization by type (tops, bottoms, dresses, shoes, accessories)
- Organization by color and season
- Favorite marking
- Usage statistics and tracking
- Advanced search with multiple filters
- Custom tagging system
- Usage counter per item

## Architecture Overview

### Dual-Mode Application

This project has **two execution modes**:

1. **Mobile App** (Primary): React Native/Expo app for iOS and Android
2. **CLI Mode** (Legacy): Command-line TypeScript application for testing

### Core Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│                   Mobile Layer                      │
│  (React Native Components, Screens, Navigation)     │
├─────────────────────────────────────────────────────┤
│                  Context Layer                      │
│    (ClosetContext - State + AsyncStorage)           │
├─────────────────────────────────────────────────────┤
│                 Business Logic                      │
│            (ClosetService - Pure TS)                │
├─────────────────────────────────────────────────────┤
│                   Data Models                       │
│     (Interfaces, Types, Enums - Pure TS)            │
└─────────────────────────────────────────────────────┘
```

**Key Architectural Decisions**:

1. **Shared Core Logic**: Business logic (`src/`) is framework-agnostic and can be used in both mobile and CLI modes
2. **Service Layer Pattern**: `ClosetService` handles all business operations in-memory
3. **Context API for State**: React Context (`ClosetContext`) wraps the service for mobile app
4. **AsyncStorage Persistence**: Mobile data persists locally using `@react-native-async-storage/async-storage`
5. **Unidirectional Data Flow**: All state changes go through the service layer

## Directory Structure

```
myclosetb_beta/
├── App.tsx                    # Main React Native app entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript compiler config
├── jest.config.js             # Jest test configuration
├── babel.config.js            # Babel config for React Native
├── metro.config.js            # Metro bundler config
│
├── src/                       # Core business logic (framework-agnostic)
│   ├── index.ts              # CLI entry point
│   ├── models/               # Data models and types
│   │   ├── ClosetItem.ts    # Item interfaces and types
│   │   ├── Category.ts      # Enums for Category, Color, Season
│   │   └── index.ts         # Barrel export
│   ├── services/             # Business logic services
│   │   ├── ClosetService.ts # Main service (in-memory CRUD)
│   │   └── index.ts         # Barrel export
│   └── utils/                # Utility functions
│       └── idGenerator.ts   # UUID generation
│
├── mobile/                   # React Native specific code
│   ├── components/          # Reusable UI components
│   │   └── ClosetItemCard.tsx
│   ├── contexts/            # React Context providers
│   │   └── ClosetContext.tsx  # Global state + persistence
│   └── screens/             # Application screens
│       ├── HomeScreen.tsx        # Main list + search
│       ├── AddItemScreen.tsx     # Add new items
│       ├── ItemDetailsScreen.tsx # View/edit item
│       └── StatsScreen.tsx       # Statistics dashboard
│
├── tests/                   # Test suites
│   └── ClosetService.test.ts
│
├── assets/                  # Images, icons, fonts
└── dist/                    # Compiled JavaScript (CLI mode)
```

## Key Technologies

### Mobile Stack
- **React Native 0.73**: Mobile framework
- **Expo 50**: Development platform and build tools
- **React Navigation**:
  - `@react-navigation/bottom-tabs` - Tab navigation
  - `@react-navigation/native-stack` - Stack navigation
- **AsyncStorage 1.21**: Local persistence
- **Expo Vector Icons**: Icon library (Ionicons)

### Core TypeScript Stack
- **TypeScript 5.3**: Strict mode enabled
- **Node.js**: Runtime environment
- **UUID**: Unique ID generation

### Development Tools
- **Jest 29**: Testing framework with ts-jest
- **ESLint**: Code linting with TypeScript plugin
- **Prettier**: Code formatting
- **Metro**: React Native bundler

## Data Models

### Core Entity: ClosetItem

```typescript
interface ClosetItem {
  id: string;                    // UUID
  name: string;                  // Item name
  category: Category;            // TOPS, BOTTOMS, DRESSES, etc.
  color: Color;                  // RED, BLUE, BLACK, etc.
  brand?: string;                // Optional brand
  size?: string;                 // Optional size
  price?: number;                // Optional price
  purchaseDate?: Date;           // Optional purchase date
  season: Season[];              // SPRING, SUMMER, FALL, WINTER, ALL_SEASONS
  tags: string[];                // Custom tags
  imageUrl?: string;             // Optional image URL
  favorite: boolean;             // Favorite flag
  timesWorn: number;             // Usage counter
  lastWornDate?: Date;           // Last usage date
  notes?: string;                // Optional notes
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

### Enums Location
All enums (Category, Color, Season) are defined in `src/models/Category.ts`

## Development Workflows

### Starting the Mobile App

```bash
# Install dependencies
npm install

# Start Expo dev server (opens QR code)
npm start

# Run on iOS simulator (requires Mac + Xcode)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser (experimental)
npm run web
```

### Running CLI Mode

```bash
# Development mode (uses ts-node)
npm run dev:cli

# Production mode (compile + run)
npm run build:cli
npm run start:cli
```

### Testing

```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch
```

### Code Quality

```bash
# Lint TypeScript files
npm run lint

# Format code with Prettier
npm run format
```

## Key Conventions

### Code Style

1. **Language**: All user-facing text, comments, and documentation should be in **Portuguese (Brazilian)**
2. **File Naming**:
   - Components: PascalCase (e.g., `HomeScreen.tsx`)
   - Services: PascalCase (e.g., `ClosetService.ts`)
   - Utils: camelCase (e.g., `idGenerator.ts`)
3. **TypeScript**: Strict mode is enabled
   - No implicit any
   - All functions must have explicit return types
   - Unused locals/parameters are errors

### Component Patterns

1. **Functional Components**: Use React hooks, no class components
2. **Context Usage**: Always use the `useCloset()` hook from `ClosetContext`
3. **SafeAreaView**: All screens must wrap content in SafeAreaView for iOS compatibility

### State Management

1. **Single Source of Truth**: `ClosetService` is the core state manager
2. **Persistence**: All state changes in mobile app automatically persist to AsyncStorage
3. **Async Operations**: All context methods return Promises for consistency

### Navigation

The app uses a **nested navigation structure**:

```
TabNavigator (Bottom tabs)
├── HomeStack (Stack Navigator)
│   ├── HomeMain (List view)
│   ├── AddItem (Form)
│   └── ItemDetails (Detail view)
└── Stats (Statistics screen)
```

**Navigation Types**: Defined in screens, use TypeScript for type safety

### Error Handling

- Services return `null` for not found items
- Services return `boolean` for success/failure operations
- Context layer logs errors to console but doesn't throw

## Testing Guidelines

### Test Location
All tests are in `tests/` directory, named `*.test.ts`

### Test Coverage
The project focuses on testing business logic:
- ✅ Service layer (ClosetService)
- ⚠️ UI components (not currently tested)

### Running Tests
```bash
npm test                # Run once
npm run test:watch      # Watch mode
```

### Test Patterns
- Use Jest's `describe` and `test` blocks
- Clear the service between tests
- Test both success and failure cases

## Common Development Tasks

### Adding a New Screen

1. Create screen component in `mobile/screens/NewScreen.tsx`
2. Wrap content in `SafeAreaView`
3. Use `useCloset()` hook for data access
4. Add navigation in `App.tsx`
5. Update TypeScript navigation types

### Adding a New Field to ClosetItem

1. Update `ClosetItem` interface in `src/models/ClosetItem.ts`
2. Update `CreateClosetItemInput` and `UpdateClosetItemInput` as needed
3. Update `ClosetService.addItem()` to handle new field
4. Update form in `AddItemScreen.tsx`
5. Update display in `ItemDetailsScreen.tsx` and `ClosetItemCard.tsx`
6. Write tests in `tests/ClosetService.test.ts`

### Adding a New Filter

1. Update `ClosetItemFilters` interface in `src/models/ClosetItem.ts`
2. Update `ClosetService.searchItems()` method
3. Add UI controls in `HomeScreen.tsx`
4. Write tests for the new filter

### Modifying Statistics

1. Update return type of `getStatistics()` in `ClosetService.ts`
2. Update calculation logic in the method
3. Update `StatsScreen.tsx` to display new stats
4. Write tests for new calculations

## iOS Specific Configuration

The app is fully configured for iOS:

- **Bundle Identifier**: `com.spyduarte.mycloset`
- **Supports**: iPhone and iPad
- **Permissions Configured**:
  - Camera access (NSCameraUsageDescription)
  - Photo library read (NSPhotoLibraryUsageDescription)
  - Photo library write (NSPhotoLibraryAddUsageDescription)
- **SafeAreaView**: Implemented on all screens
- **Build Number**: 1.0.0

### Building for iOS

```bash
# Using Expo Go (easiest)
npm start  # Scan QR code with Expo Go app

# Using Simulator (requires Mac)
npm run ios

# Production build (requires EAS CLI)
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios
```

## Git Workflow

### Branch Naming
- Feature branches: `claude/description-sessionid`
- Always develop on feature branches, not main

### Commit Messages
- Should be in Portuguese
- Should describe the "why" not just the "what"
- Examples from history:
  - "Configura aplicativo para funcionar no iOS"
  - "Adiciona aplicativo mobile iOS/Android completo"
  - "Implementa sistema completo de gerenciamento de closet virtual"

### Pushing Changes
- Always use: `git push -u origin <branch-name>`
- Branch names must start with `claude/` and contain session ID
- Retry network failures with exponential backoff

## Important Notes for AI Assistants

### When Adding Features

1. **Always preserve Portuguese**: Keep all UI text, comments, and messages in Portuguese
2. **Test first**: Check existing tests to understand expected behavior
3. **Update tests**: Add tests for new functionality
4. **Maintain architecture**: Keep business logic in `src/`, UI in `mobile/`
5. **Type safety**: No `any` types, explicit return types on functions

### When Fixing Bugs

1. **Check both layers**: Bug might be in service OR context layer
2. **Verify persistence**: Ensure changes persist correctly in AsyncStorage
3. **Test on both platforms**: Consider iOS and Android differences
4. **Update relevant tests**: Ensure tests cover the bug scenario

### Common Pitfalls

1. **Date Serialization**: When loading from AsyncStorage, dates are strings and must be converted back to Date objects
2. **Service vs Context**: Don't bypass context and call service directly from screens
3. **Navigation Types**: Keep navigation type definitions in sync with actual navigation structure
4. **AsyncStorage**: All context operations are async, don't forget `await`

### Project Priorities

1. **Mobile-first**: The mobile app is the primary platform
2. **User experience**: Smooth, intuitive UI/UX for iOS and Android
3. **Data integrity**: Don't lose user data, ensure proper persistence
4. **Type safety**: Leverage TypeScript for compile-time safety
5. **Code quality**: Maintain test coverage for business logic

## File Modification Guidelines

### Files You'll Edit Most Often
- `mobile/screens/*.tsx` - UI changes and new features
- `src/services/ClosetService.ts` - Business logic changes
- `src/models/ClosetItem.ts` - Data model changes
- `tests/ClosetService.test.ts` - Test updates

### Files to Be Careful With
- `App.tsx` - Navigation structure (breaking changes affect whole app)
- `mobile/contexts/ClosetContext.tsx` - State management core
- `package.json` - Dependency changes can break builds
- `app.json` - Expo configuration (affects builds)

### Files Rarely Changed
- `tsconfig.json` - TypeScript config is already optimal
- `babel.config.js` - Expo handles this
- `metro.config.js` - Metro bundler config
- `jest.config.js` - Test config is complete

## Useful Code Snippets

### Using the Closet Service in a Screen

```typescript
import { useCloset } from '../contexts/ClosetContext';

function MyScreen() {
  const { items, addItem, deleteItem, loading } = useCloset();

  // Rest of component
}
```

### Adding an Item

```typescript
const newItem = await addItem({
  name: 'Camiseta Branca',
  category: Category.TOPS,
  color: Color.WHITE,
  season: [Season.SPRING, Season.SUMMER],
  tags: ['casual'],
  price: 49.90
});
```

### Searching Items

```typescript
const { searchItems } = useCloset();

const summerItems = searchItems({ season: Season.SUMMER });
const favorites = searchItems({ favorite: true });
const redTops = searchItems({
  category: Category.TOPS,
  color: Color.RED
});
```

### Getting Statistics

```typescript
const { getStatistics } = useCloset();

const stats = getStatistics();
console.log(stats.totalItems);      // Total count
console.log(stats.totalValue);      // Sum of prices
console.log(stats.favoriteItems);   // Count of favorites
console.log(stats.mostWornItem);    // Item with highest usage
console.log(stats.categoryCounts);  // Items per category
```

## Future Roadmap

### Planned Features
- Photo upload (camera/gallery integration)
- Outfit creator (combine multiple items)
- Usage calendar
- Weather-based suggestions
- Social sharing
- Backend API with REST
- Cloud sync
- Web interface
- E-commerce integration

### Technical Debt
- Add UI component tests
- Implement photo upload functionality
- Add offline-first sync mechanism
- Performance optimization for large wardrobes
- Add proper error boundaries

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Key Dependencies
- Expo SDK 50
- React Native 0.73
- TypeScript 5.3
- React Navigation 6.x

## Quick Reference

### Package Manager: npm (not yarn)

### Key Scripts
```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS
npm run android        # Run on Android
npm test               # Run tests
npm run lint           # Lint code
npm run format         # Format code
npm run dev:cli        # Run CLI mode
```

### Project Info
- **License**: MIT
- **Author**: spyDuarte
- **Repository**: https://github.com/spyDuarte/myclosetb_beta
- **Version**: 0.1.0

---

**Last Updated**: 2025-11-16
**For**: AI Assistants (Claude, GitHub Copilot, etc.)
**Purpose**: Comprehensive codebase guide for effective AI-assisted development
