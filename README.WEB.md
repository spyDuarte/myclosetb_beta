# 🌐 MyCloset Web

Versão web do MyCloset - seu guarda-roupa digital acessível de qualquer navegador!

## ✨ Funcionalidades

Todas as funcionalidades do app mobile disponíveis na web:

- 👕 **Gerenciamento de Itens**: Adicionar, editar, visualizar e deletar peças
- 📷 **Upload de Fotos**: Adicione imagens dos seus itens (via upload ou câmera)
- 🔍 **Busca e Filtros**: Encontre itens rapidamente com filtros avançados
- ⭐ **Favoritos**: Marque seus itens preferidos
- 📊 **Estatísticas**: Veja métricas do seu guarda-roupa
- 🏷️ **Categorização**: Organize por tipo, cor, estação, tags
- 💾 **Persistência Local**: Dados salvos no navegador (localStorage)
- 📱 **PWA**: Instale como app no dispositivo

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run web
```

Acesse: `http://localhost:19006`

### Build de Produção

```bash
# Criar build otimizado
npm run build:web

# Servir localmente
npm run serve:web
```

## 📦 Deploy

### Vercel (1 minuto)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Documentação completa**: Veja [DEPLOY.md](./DEPLOY.md)

## 🎨 Compatibilidade

### Navegadores Suportados

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Dispositivos

- 💻 Desktop (Windows, Mac, Linux)
- 📱 Mobile (iOS Safari, Android Chrome)
- 📟 Tablet (iPad, Android tablets)

## 🔧 Tecnologias

- **React 18**: UI library
- **React Native Web**: Compartilha código com mobile
- **Expo SDK 50**: Framework e ferramentas
- **TypeScript**: Type safety
- **AsyncStorage**: Persistência (localStorage no browser)
- **React Navigation**: Roteamento

## 📱 PWA Features

A versão web funciona como Progressive Web App:

- **Installable**: Pode ser instalado na tela inicial
- **Offline-capable**: Funciona sem internet (dados locais)
- **App-like**: Interface igual ao app nativo
- **Responsive**: Adapta a qualquer tamanho de tela

### Instalar como App

**Chrome/Edge:**
1. Abra o site
2. Clique no ícone de instalação (barra de endereço)
3. Confirme "Instalar"

**Safari (iOS):**
1. Abra o site
2. Toque em "Compartilhar"
3. "Adicionar à Tela de Início"

## 🔒 Privacidade

- ✅ Todos os dados ficam no seu dispositivo
- ✅ Nenhum dado enviado para servidores
- ✅ Funciona 100% offline
- ✅ Sem tracking ou analytics (por padrão)

## 🎯 Diferenças vs Mobile

### Funcionalidades Idênticas
- ✅ Todas as operações CRUD
- ✅ Filtros e busca
- ✅ Estatísticas
- ✅ Persistência de dados

### Adaptações Web
- 📸 Câmera funciona em dispositivos com câmera
- 🖼️ Upload de imagens via input file
- 💾 LocalStorage ao invés de AsyncStorage nativo
- 🎨 Interface responsiva para telas grandes

## 📊 Performance

Build otimizado com:
- Code splitting automático
- Tree shaking
- Assets minificados
- Gzip/Brotli compression
- Cache headers otimizados

**Tamanho estimado**: ~800KB (initial bundle gzipped)

## 🐛 Troubleshooting

### Dados não persistem
- Verifique se cookies/localStorage estão habilitados
- Modo anônimo pode limitar armazenamento

### Imagens não carregam
- Verifique permissões de câmera no navegador
- Teste upload de arquivo como alternativa

### Interface quebrada
- Limpe cache e recarregue (Ctrl+Shift+R)
- Verifique se está usando navegador compatível

## 🤝 Contribuindo

Encontrou um bug na versão web? Abra uma issue!

## 📄 Licença

MIT - Veja [LICENSE](./LICENSE)

---

**Demo**: https://mycloset.vercel.app *(depois do deploy)*

**Repositório**: https://github.com/spyDuarte/myclosetb_beta
