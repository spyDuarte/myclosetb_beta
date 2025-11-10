# 🎨 myclosetb_beta

Sistema de gerenciamento de closet virtual desenvolvido em TypeScript. Organize suas roupas, acessórios e calçados de forma digital, acompanhe o uso, crie looks e gerencie seu guarda-roupa de maneira eficiente.

## ✨ Funcionalidades

- ✅ Adicionar, editar e remover itens do closet
- 🏷️ Categorização por tipo (tops, bottoms, vestidos, calçados, acessórios, etc.)
- 🎨 Organização por cores
- 🌦️ Filtro por estação do ano
- ⭐ Marcar itens favoritos
- 📊 Estatísticas de uso (itens mais usados, valor total do closet, etc.)
- 🔍 Busca avançada com múltiplos filtros
- 🏷️ Sistema de tags personalizadas
- 📈 Contador de uso por item

## 🚀 Instalação

```bash
# Clonar o repositório
git clone https://github.com/spyDuarte/myclosetb_beta.git
cd myclosetb_beta

# Instalar dependências
npm install
```

## 📱 App Mobile (iOS/Android)

Este projeto inclui um aplicativo móvel completo desenvolvido com **React Native e Expo**!

### Executar o App Mobile

```bash
# Instalar dependências
npm install

# Iniciar o Expo
npm start

# Executar no iOS (requer Mac com Xcode)
npm run ios

# Executar no Android
npm run android

# Ou escaneie o QR code com o app Expo Go no seu iPhone/Android
```

### 🍎 Configurações Específicas do iOS

O aplicativo está totalmente configurado para funcionar no iOS com:

- ✅ **Bundle Identifier**: `com.spyduarte.mycloset`
- ✅ **Suporte para iPad e iPhone**
- ✅ **SafeAreaView** implementado em todas as telas
- ✅ **Permissões de privacidade** configuradas:
  - Acesso à câmera para fotos de itens
  - Acesso à galeria de fotos
  - Permissão para salvar fotos
- ✅ **Ícones e Splash Screen** otimizados para iOS
- ✅ **Build Number** e versão configurados

Para executar no iOS:

1. **Usando Expo Go** (mais fácil):
   - Instale o app Expo Go da App Store
   - Execute `npm start`
   - Escaneie o QR code com a câmera do iPhone

2. **Usando simulador iOS** (requer Mac):
   - Instale Xcode da App Store
   - Execute `npm run ios`
   - O simulador abrirá automaticamente

3. **Build para produção**:
   ```bash
   # Instalar EAS CLI
   npm install -g eas-cli

   # Login no Expo
   eas login

   # Configurar projeto
   eas build:configure

   # Build para iOS
   eas build --platform ios
   ```

### Recursos do App Mobile

- Interface nativa para iOS e Android
- Navegação por abas (Closet e Estatísticas)
- Adicionar/editar/excluir itens
- Marcar itens como favoritos
- Registrar uso de itens
- Busca e filtros em tempo real
- Estatísticas visuais do closet
- Persistência local com AsyncStorage
- Design moderno e intuitivo

### Telas do App

1. **Home (Closet)**: Lista de todos os itens com busca e estatísticas rápidas
2. **Adicionar Item**: Formulário completo para adicionar novos itens
3. **Detalhes do Item**: Visualização completa com opções de edição
4. **Estatísticas**: Análise visual do closet com gráficos

## 📖 Uso (Versão CLI)

### Executar a aplicação de demonstração CLI

```bash
# Executar versão CLI em modo desenvolvimento
npm run dev:cli

# Ou compilar e executar versão CLI
npm run build:cli
npm run start:cli
```

### Executar testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

### Exemplo de uso

```typescript
import { ClosetService } from './services';
import { Category, Color, Season } from './models';

// Criar instância do serviço
const closet = new ClosetService();

// Adicionar item
const item = closet.addItem({
  name: 'Camiseta Básica Branca',
  category: Category.TOPS,
  color: Color.WHITE,
  brand: 'Zara',
  size: 'M',
  price: 49.90,
  season: [Season.SPRING, Season.SUMMER],
  tags: ['casual', 'básico']
});

// Marcar como favorito
closet.toggleFavorite(item.id);

// Registrar uso
closet.markAsWorn(item.id);

// Buscar itens
const summerItems = closet.searchItems({ season: Season.SUMMER });
const favorites = closet.searchItems({ favorite: true });

// Obter estatísticas
const stats = closet.getStatistics();
console.log(`Total de itens: ${stats.totalItems}`);
console.log(`Valor total: R$ ${stats.totalValue}`);
```

## 🏗️ Estrutura do Projeto

```
myclosetb_beta/
├── App.tsx              # App principal React Native
├── app.json             # Configuração Expo
├── src/                 # Lógica de negócio compartilhada
│   ├── models/          # Modelos de dados e tipos
│   ├── services/        # Serviços (ClosetService)
│   ├── utils/           # Utilitários
│   └── index.ts         # Versão CLI
├── mobile/              # App Mobile
│   ├── components/      # Componentes reutilizáveis
│   │   └── ClosetItemCard.tsx
│   ├── contexts/        # Context API (estado global)
│   │   └── ClosetContext.tsx
│   └── screens/         # Telas do app
│       ├── HomeScreen.tsx
│       ├── AddItemScreen.tsx
│       ├── ItemDetailsScreen.tsx
│       └── StatsScreen.tsx
├── tests/               # Testes unitários
├── assets/              # Imagens e ícones
├── dist/                # Código compilado (CLI)
└── package.json
```

## 🧪 Testes

O projeto possui cobertura de testes para todas as funcionalidades principais:

- Adicionar e remover itens
- Atualizar informações de itens
- Marcar itens como favoritos
- Registrar uso de itens
- Buscar com filtros
- Calcular estatísticas

## 🛠️ Tecnologias

### Mobile
- **React Native 0.73** - Framework mobile
- **Expo 50** - Plataforma de desenvolvimento
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Persistência local
- **TypeScript** - Tipagem estática

### Backend/CLI
- **TypeScript** - Linguagem principal
- **Node.js** - Runtime

### Qualidade de Código
- **Jest** - Framework de testes
- **ESLint** - Linting
- **Prettier** - Formatação de código

## 📝 Scripts Disponíveis

### App Mobile
```bash
npm start          # Iniciar Expo dev server
npm run ios        # Executar no iOS
npm run android    # Executar no Android
npm run web        # Executar no navegador
```

### Versão CLI
```bash
npm run build:cli  # Compilar TypeScript para JavaScript
npm run start:cli  # Executar aplicação compilada
npm run dev:cli    # Executar em modo desenvolvimento
```

### Testes e Qualidade
```bash
npm test           # Executar testes
npm run test:watch # Executar testes em modo watch
npm run lint       # Executar linter
npm run format     # Formatar código
```

## 🎯 Roadmap

- [x] App Mobile iOS/Android com React Native
- [x] Navegação entre telas
- [x] Persistência local (AsyncStorage)
- [x] Interface moderna e intuitiva
- [ ] Upload de fotos de itens (câmera/galeria)
- [ ] Criador de looks (combinações de roupas)
- [ ] Calendário de uso
- [ ] Sugestões baseadas em clima
- [ ] Compartilhamento de closet com amigos
- [ ] Backend com API REST
- [ ] Sincronização na nuvem
- [ ] Interface web com React
- [ ] Integração com e-commerce

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**spyDuarte**

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
