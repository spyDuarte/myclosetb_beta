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

## 📖 Uso

### Executar a aplicação de demonstração

```bash
# Executar em modo desenvolvimento
npm run dev

# Ou compilar e executar
npm run build
npm start
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
├── src/
│   ├── models/          # Modelos de dados e tipos
│   │   ├── Category.ts  # Enums de categorias, cores e estações
│   │   ├── ClosetItem.ts # Interface do item de closet
│   │   └── index.ts
│   ├── services/        # Lógica de negócio
│   │   ├── ClosetService.ts # Serviço principal do closet
│   │   └── index.ts
│   ├── utils/           # Utilitários
│   │   └── idGenerator.ts
│   └── index.ts         # Arquivo principal
├── tests/               # Testes unitários
│   └── ClosetService.test.ts
├── dist/                # Código compilado
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
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

- **TypeScript** - Linguagem principal
- **Jest** - Framework de testes
- **ESLint** - Linting
- **Prettier** - Formatação de código

## 📝 Scripts Disponíveis

```bash
npm run build      # Compilar TypeScript para JavaScript
npm start          # Executar aplicação compilada
npm run dev        # Executar em modo desenvolvimento
npm test           # Executar testes
npm run test:watch # Executar testes em modo watch
npm run lint       # Executar linter
npm run format     # Formatar código
```

## 🎯 Roadmap

- [ ] Interface web com React/Vue
- [ ] Persistência de dados (banco de dados)
- [ ] Upload de fotos de itens
- [ ] Criador de looks (combinações de roupas)
- [ ] Calendário de uso
- [ ] Sugestões baseadas em clima
- [ ] Compartilhamento de closet com amigos
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
