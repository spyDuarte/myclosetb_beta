# 🚀 Guia de Deploy - MyCloset Web

Este guia contém instruções detalhadas para fazer deploy da versão web do MyCloset em diferentes plataformas.

## 📋 Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Conta em uma plataforma de hospedagem (Vercel, Netlify, ou similar)

## 🌐 Plataformas Suportadas

### 1. Vercel (Recomendado)

Vercel é a forma mais rápida e fácil de fazer deploy de aplicações Expo Web.

#### Deploy via CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Fazer login (abrirá o navegador)
vercel login

# Deploy (na raiz do projeto)
vercel

# Deploy em produção
vercel --prod
```

#### Deploy via Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. Configurações automáticas (detecta `vercel.json`)
5. Clique em "Deploy"

**Variáveis de Ambiente** (se necessário):
- `NODE_VERSION`: 18

#### URL de Produção
Após o deploy, sua aplicação estará disponível em:
- `https://seu-projeto.vercel.app`
- Você pode configurar um domínio customizado no dashboard

---

### 2. Netlify

#### Deploy via CLI

```bash
# Instalar Netlify CLI globalmente
npm install -g netlify-cli

# Fazer login
netlify login

# Inicializar projeto
netlify init

# Build e deploy
netlify deploy --prod
```

#### Deploy via Dashboard

1. Acesse [netlify.com](https://netlify.com)
2. Clique em "Add new site" > "Import an existing project"
3. Conecte ao GitHub e selecione o repositório
4. Configurações são detectadas automaticamente via `netlify.toml`
5. Clique em "Deploy site"

**Build Settings:**
- Build command: `expo export -p web`
- Publish directory: `dist`

---

### 3. GitHub Pages

Para hospedar gratuitamente no GitHub Pages:

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar scripts ao package.json
# "predeploy": "expo export -p web",
# "deploy": "gh-pages -d dist"

# Build e deploy
npm run deploy
```

Configurar no GitHub:
1. Settings > Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`

URL: `https://seu-usuario.github.io/myclosetb_beta/`

---

## 🔧 Build Local

Para testar o build localmente antes do deploy:

```bash
# Instalar dependências
npm install

# Build para web
expo export -p web

# Servir localmente (usando serve)
npx serve dist
```

Acesse em: `http://localhost:3000`

---

## 🎨 Customização

### Metadados e SEO

Edite `web/index.html` para customizar:
- Título da página
- Descrição meta
- Tags Open Graph (Facebook)
- Tags Twitter Card
- Favicon e ícones

### PWA (Progressive Web App)

O app já está configurado como PWA:
- ✅ Installable (pode ser instalado no dispositivo)
- ✅ Offline-capable (funciona offline via AsyncStorage)
- ✅ App-like experience

### Tema e Cores

Edite `app.json` > `web.themeColor` para mudar a cor do tema.

---

## 📱 Testes em Dispositivos

### Desktop
```bash
npm run web
```
Acesse: `http://localhost:19006`

### Mobile (mesmo dispositivo na rede)
```bash
npm run web
```
Acesse: `http://SEU_IP:19006` (exibido no terminal)

### Responsividade

Teste em diferentes tamanhos:
- Desktop: 1920x1080, 1366x768
- Tablet: 768x1024 (iPad)
- Mobile: 375x667 (iPhone SE), 414x896 (iPhone 11)

Use DevTools (F12) > Toggle device toolbar

---

## 🔒 Segurança

O projeto já inclui headers de segurança:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 🚨 Troubleshooting

### Erro: "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Build falha com erro de memória
```bash
# Aumentar memória do Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Imagens não carregam
- Verifique se as imagens estão em `assets/`
- Use caminhos relativos: `./assets/icon.png`

### AsyncStorage não funciona na web
- Expo automaticamente usa localStorage no navegador
- Funciona da mesma forma que no mobile

### Navegação não funciona em produção
- Verifique se tem rewrites configurados (já incluído em vercel.json e netlify.toml)
- Todas as rotas devem apontar para `index.html`

---

## 📊 Performance

### Otimizações Incluídas

1. **Code Splitting**: Automático via Expo
2. **Tree Shaking**: Remove código não utilizado
3. **Cache Headers**: Assets com cache de 1 ano
4. **Gzip/Brotli**: Habilitado automaticamente pela plataforma

### Métricas Recomendadas

Use Lighthouse (DevTools) para verificar:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 🔄 CI/CD (Integração Contínua)

### Deploy Automático no Push

Vercel e Netlify configuram automaticamente CI/CD quando você conecta o repositório GitHub.

Cada push para `main` dispara:
1. ✅ Build automático
2. ✅ Deploy para production
3. ✅ Preview URLs para PRs

### GitHub Actions (Opcional)

Crie `.github/workflows/deploy.yml` para controle customizado.

---

## 📝 Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Testar localmente: `npm run web`
- [ ] Build de produção: `expo export -p web`
- [ ] Verificar se todas as imagens carregam
- [ ] Testar navegação entre telas
- [ ] Verificar responsividade (mobile/tablet/desktop)
- [ ] Testar funcionalidades principais (adicionar/editar/deletar itens)
- [ ] Verificar AsyncStorage (dados persistem ao recarregar)
- [ ] Testar em diferentes navegadores (Chrome, Firefox, Safari)
- [ ] Verificar SEO tags (`web/index.html`)
- [ ] Configurar domínio customizado (opcional)
- [ ] Configurar analytics (opcional)

---

## 🌟 Recursos Adicionais

### Analytics (Opcional)

Para adicionar Google Analytics:

1. Instalar pacote:
```bash
npm install react-ga4
```

2. Configurar em `App.tsx`:
```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
```

### Monitoring (Opcional)

Para adicionar Sentry:

```bash
npx expo install sentry-expo
```

Configure em `app.json` > `plugins`.

---

## 📞 Suporte

- Documentação Expo Web: https://docs.expo.dev/workflow/web/
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com/

---

## 🎉 Pronto!

Seu MyCloset Web está pronto para ser acessado de qualquer lugar!

**Próximos passos sugeridos:**
1. Compartilhe a URL com amigos e familiares
2. Configure um domínio customizado (ex: `mycloset.seu-dominio.com`)
3. Adicione analytics para entender o uso
4. Considere adicionar autenticação para múltiplos usuários

---

*Última atualização: 2025-11-16*
