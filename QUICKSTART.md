# 🚀 Quick Start - MyCloset Beta

Guia rápido para iniciar o desenvolvimento em **menos de 5 minutos**!

---

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- ✅ **Node.js** (v18+) - [Download](https://nodejs.org/)
- ✅ **npm** (v9+) - Vem com Node.js
- ✅ **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- ✅ **Git** - [Download](https://git-scm.com/)

### Opcional (para testar em dispositivos):
- 📱 **Xcode** (macOS) - Para iOS
- 🤖 **Android Studio** - Para Android
- 📲 **Expo Go** app - Para testar no celular

---

## 🎯 Setup Inicial (Apenas uma vez)

### 1. Clone o Repositório

```bash
git clone https://github.com/spyDuarte/myclosetb_beta.git
cd myclosetb_beta
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Abra no VS Code

```bash
code .
```

### 4. Instale as Extensões Recomendadas

Quando o VS Code abrir, você verá uma notificação:

```
"Este workspace recomenda extensões"
[Instalar Todas] [Mostrar Recomendações]
```

Clique em **"Instalar Todas"** e aguarde a instalação das 18 extensões.

---

## 🏃 Iniciando o App (Método Mais Rápido)

### Opção 1: Command Palette (Recomendado) ⭐

1. Pressione **`Ctrl+Shift+P`** (Windows/Linux) ou **`Cmd+Shift+P`** (Mac)
2. Digite: `run task`
3. Selecione: **`Start Expo`**
4. Aguarde o QR Code aparecer no terminal

**Pronto!** 🎉 Agora você pode:
- Escanear o QR Code com o app **Expo Go** no celular
- Pressionar **`i`** para abrir no simulador iOS (Mac)
- Pressionar **`a`** para abrir no emulador Android

### Opção 2: Terminal Integrado

1. Pressione **`` Ctrl+` ``** para abrir o terminal
2. Execute:
   ```bash
   npm start
   ```

### Opção 3: Atalho Direto para iOS/Android

**Para iOS:**
1. `Ctrl+Shift+P` → `Run Task` → **`Start iOS`**

**Para Android:**
1. `Ctrl+Shift+P` → `Run Task` → **`Start Android`**

---

## 🐛 Debug (Depuração)

### Método Visual (Mais Fácil)

1. Inicie o app primeiro: `Ctrl+Shift+P` → `Run Task` → `Start Expo`
2. Pressione **`F5`**
3. Selecione:
   - **`Debug iOS`** para iOS
   - **`Debug Android`** para Android
   - **`Debug Expo`** para Expo
4. Coloque breakpoints clicando na margem esquerda do código
5. O debugger pausará nos breakpoints automaticamente!

### Atalhos de Debug

| Ação | Atalho |
|------|--------|
| Iniciar Debug | `F5` |
| Parar Debug | `Shift+F5` |
| Step Over | `F10` |
| Step Into | `F11` |
| Step Out | `Shift+F11` |
| Continue | `F5` |

---

## 🧪 Executando Testes

### Testes em Watch Mode (Recomendado durante desenvolvimento)

1. `Ctrl+Shift+P` → `Run Task` → **`Run Tests (Watch)`**
2. Os testes rodarão automaticamente quando você salvar arquivos!

### Executar Todos os Testes

1. `Ctrl+Shift+P` → `Run Task` → **`Run Tests`**

### Ver Cobertura de Testes

1. `Ctrl+Shift+P` → `Run Task` → **`Run Tests (Coverage)`**
2. Abra `coverage/lcov-report/index.html` no navegador

### Debug de Testes

1. Abra o arquivo de teste (ex: `tests/ClosetService.test.ts`)
2. Coloque breakpoints
3. Pressione `F5`
4. Selecione **`Debug Current Jest Test`**
5. O debugger parará nos breakpoints!

---

## ✨ Usando Snippets (Código Rápido)

### Criar Componente React Native

1. Crie novo arquivo: `MeuComponente.tsx`
2. Digite: **`rnfc`**
3. Pressione **`Tab`**
4. Boom! 💥 Componente completo criado!

### Criar Tela

1. Crie arquivo: `MinhaScreen.tsx`
2. Digite: **`rnscreen`**
3. Pressione **`Tab`**
4. Tela com SafeAreaView pronta!

### Todos os Snippets Disponíveis

| Digite | Pressione Tab | Resultado |
|--------|---------------|-----------|
| `rnfc` | Tab | Componente Funcional |
| `rnscreen` | Tab | Tela Completa |
| `jtest` | Tab | Suite de Testes |
| `rnstyle` | Tab | StyleSheet |
| `ucloset` | Tab | Hook useCloset |
| `clg` | Tab | console.log() |
| `tryc` | Tab | Try/Catch block |

---

## 📝 Formatação e Qualidade de Código

### Automático ✅

- **Formatação:** Salve o arquivo (`Ctrl+S`) e o código é formatado automaticamente!
- **ESLint:** Problemas aparecem sublinhados em vermelho/amarelo
- **Auto-save:** Arquivos salvam automaticamente após 1 segundo

### Manual

**Formatar tudo:**
1. `Ctrl+Shift+P` → `Run Task` → **`Format Code`**

**Verificar problemas:**
1. `Ctrl+Shift+P` → `Run Task` → **`Lint`**

**Verificar TypeScript:**
1. `Ctrl+Shift+P` → `Run Task` → **`Build TypeScript`**

---

## 🛠️ Tarefas Úteis

Todas acessíveis via: `Ctrl+Shift+P` → `Run Task`

### Desenvolvimento
- ✅ **Start Expo** - Inicia o servidor
- ✅ **Start iOS** - Abre no simulador iOS
- ✅ **Start Android** - Abre no emulador Android
- ✅ **Clear Metro Cache** - Limpa cache (se tiver problemas)

### Testes
- ✅ **Run Tests** - Executa todos os testes
- ✅ **Run Tests (Watch)** - Testes em modo watch
- ✅ **Run Tests (Coverage)** - Com relatório de cobertura

### Qualidade
- ✅ **Lint** - Verifica problemas de código
- ✅ **Format Code** - Formata todo o código
- ✅ **Build TypeScript** - Verifica erros TS

### Manutenção
- ✅ **Install Dependencies** - Instala dependências
- ✅ **Clean Install** - Reinstala tudo do zero
- ✅ **Kill Expo/Metro** - Mata processos travados

### Compostas
- ✅ **Full Development Setup** - Instala + Build + Lint
- ✅ **Git: Commit & Push** - Add + Commit + Push

---

## 🎮 Atalhos de Teclado Essenciais

### Navegação
| Ação | Atalho |
|------|--------|
| Command Palette | `Ctrl+Shift+P` |
| Quick Open (arquivo) | `Ctrl+P` |
| Ir para símbolo | `Ctrl+Shift+O` |
| Ir para definição | `F12` |
| Voltar | `Alt+←` |
| Ir para linha | `Ctrl+G` |

### Edição
| Ação | Atalho |
|------|--------|
| Comentar linha | `Ctrl+/` |
| Duplicar linha | `Shift+Alt+↓` |
| Mover linha | `Alt+↑/↓` |
| Multi-cursor | `Ctrl+Alt+↓` |
| Renomear | `F2` |
| Formatar | `Shift+Alt+F` |

### Terminal & Debug
| Ação | Atalho |
|------|--------|
| Terminal | `` Ctrl+` `` |
| Novo terminal | `` Ctrl+Shift+` `` |
| Debug | `F5` |
| Breakpoint | `F9` |

---

## 🔥 Fluxo de Trabalho Diário

### Manhã (Início do dia)

```bash
1. Abrir VS Code no projeto
2. Ctrl+Shift+P → Run Task → "Start Expo"
3. Escanear QR Code com Expo Go OU
4. Pressionar 'i' para iOS / 'a' para Android
5. Ctrl+Shift+P → Run Task → "Run Tests (Watch)"
```

### Durante o Desenvolvimento

```bash
1. Editar código (auto-save ativo)
2. Usar snippets (rnfc, rnscreen, etc.)
3. Salvar (Ctrl+S) = auto-format + auto-lint
4. Ver testes rodando automaticamente
5. Debug com breakpoints quando necessário (F5)
```

### Antes do Commit

```bash
1. Ctrl+Shift+P → Run Task → "Lint"
2. Ctrl+Shift+P → Run Task → "Build TypeScript"
3. Ctrl+Shift+P → Run Task → "Run Tests (Coverage)"
4. git add -A
5. git commit -m "mensagem"
6. git push
```

OU simplesmente:

```bash
Ctrl+Shift+P → Run Task → "Git: Commit & Push"
```

---

## ❓ Resolução de Problemas Comuns

### App não inicia

```bash
1. Ctrl+Shift+P → Run Task → "Kill Expo/Metro"
2. Ctrl+Shift+P → Run Task → "Clear Metro Cache"
3. Ctrl+Shift+P → Run Task → "Start Expo"
```

### Dependências quebradas

```bash
Ctrl+Shift+P → Run Task → "Clean Install"
```

### TypeScript reclamando

```bash
Ctrl+Shift+P → Run Task → "Build TypeScript"
# Ver os erros e corrigir
```

### Metro bundler travado

```bash
# Terminal:
killall node  # Mac/Linux
taskkill /F /IM node.exe  # Windows

# OU:
Ctrl+Shift+P → Run Task → "Kill Expo/Metro"
```

### Formatação não funciona

```bash
1. Ctrl+Shift+P → "Format Document With..."
2. Selecionar "Prettier"
3. Marcar "Configure Default Formatter"
```

### Cache corrompido

```bash
# Limpar tudo:
rm -rf node_modules
rm package-lock.json
npm install
npx expo start -c
```

---

## 📚 Recursos Adicionais

### Documentação do Projeto
- 📖 [CLAUDE.md](./CLAUDE.md) - Guia completo do projeto
- 🔧 [app.config.ts](./src/config/app.config.ts) - Todas as configurações
- 📱 [PLATFORM_COMPATIBILITY.md](./docs/PLATFORM_COMPATIBILITY.md) - iOS/Android
- 💻 [.vscode/README.md](./.vscode/README.md) - Configurações VS Code

### Documentação Externa
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Jest](https://jestjs.io/docs/getting-started)

### Comunidade
- [GitHub Issues](https://github.com/spyDuarte/myclosetb_beta/issues)
- [React Native Community](https://reactnative.dev/community/overview)
- [Expo Forums](https://forums.expo.dev/)

---

## 🎉 Pronto!

Agora você está pronto para desenvolver no MyCloset Beta com **máxima produtividade**!

### Próximos Passos

1. ✅ Explorar o código em `src/` e `mobile/`
2. ✅ Executar os testes: `Ctrl+Shift+P` → `Run Tests (Watch)`
3. ✅ Fazer sua primeira modificação
4. ✅ Ver o app recarregar automaticamente (Fast Refresh)
5. ✅ Criar seu primeiro commit

### Dica Pro 💡

Configure atalhos customizados:
1. `Ctrl+K Ctrl+S` - Abre atalhos de teclado
2. Busque por "Run Task"
3. Adicione atalho: `Ctrl+Shift+R` para "Start Expo"

Agora você pode iniciar o app com **um único atalho**! 🚀

---

**Happy Coding!** 🎨✨

**Última atualização:** 2025-11-16
**Versão:** 1.0.0
**Projeto:** MyCloset Beta
