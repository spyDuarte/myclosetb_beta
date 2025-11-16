# 🚀 Configuração do VS Code para MyCloset Beta

Esta pasta contém todas as configurações para automatizar o desenvolvimento do MyCloset Beta no Visual Studio Code.

---

## 📁 Arquivos de Configuração

### `tasks.json` - Tarefas Automatizadas

Define 15 tarefas que podem ser executadas com **Ctrl+Shift+P** → "Run Task":

#### Tarefas de Desenvolvimento
- **Start Expo** - Inicia o servidor Expo (Metro bundler)
- **Start iOS** - Inicia o app no simulador iOS
- **Start Android** - Inicia o app no emulador Android
- **Clear Metro Cache** - Limpa o cache do Metro bundler

#### Tarefas de Teste
- **Run Tests** - Executa todos os testes uma vez
- **Run Tests (Watch)** - Executa testes em modo watch
- **Run Tests (Coverage)** - Executa testes com relatório de cobertura

#### Tarefas de Qualidade de Código
- **Lint** - Executa ESLint para verificar problemas de código
- **Format Code** - Formata todo o código com Prettier
- **Build TypeScript** - Verifica erros de TypeScript sem compilar

#### Tarefas de Manutenção
- **Install Dependencies** - Instala dependências do npm
- **Clean Install** - Remove node_modules e reinstala tudo
- **Kill Expo/Metro** - Mata processos do Node.js/Expo

#### Tarefas Compostas
- **Full Development Setup** - Executa instalação + build + lint em sequência
- **Git: Commit & Push** - Adiciona, commita e faz push de mudanças

### `launch.json` - Configurações de Debug

Define 7 configurações de debug acessíveis via **F5** ou barra lateral Debug:

#### Debug React Native
- **Attach to packager** - Anexa ao packager em execução
- **Debug iOS** - Debug no simulador iOS
- **Debug Android** - Debug no emulador Android
- **Debug Expo** - Debug com Expo

#### Debug Jest
- **Run Jest Tests** - Executa todos os testes com debugger
- **Debug Jest Tests** - Debug do arquivo de teste atual
- **Debug Current Jest Test** - Debug apenas o teste atual

### `settings.json` - Configurações do Projeto

Configurações automáticas aplicadas ao abrir o projeto:

#### Editor
- ✅ Formatação automática ao salvar (Prettier)
- ✅ ESLint fix automático ao salvar
- ✅ Tab size: 2 espaços
- ✅ Réguas em 80 e 100 caracteres
- ✅ Word wrap ativado
- ✅ Colorização de brackets

#### TypeScript/JavaScript
- ✅ Imports automáticos
- ✅ Atualização de imports ao mover arquivos
- ✅ Single quotes como padrão
- ✅ Sugestões automáticas

#### Arquivos
- ✅ Auto-save após 1 segundo de inatividade
- ✅ Exclusão de node_modules, dist, coverage da busca
- ✅ Associações de arquivo corretas

#### Git
- ✅ Smart commit habilitado
- ✅ Auto fetch ativado
- ✅ GitLens integrado

### `extensions.json` - Extensões Recomendadas

Lista de 18 extensões recomendadas para desenvolvimento:

#### Essenciais
- React Native Tools
- Expo Tools
- ESLint
- Prettier
- TypeScript

#### Testes
- Jest
- Jest Runner

#### Git
- GitLens
- Git History

#### Produtividade
- Path Intellisense
- npm Intellisense
- Auto Rename Tag
- Import Cost
- Error Lens

#### Snippets
- ES7 React/Redux snippets
- Simple React Snippets

### `MyCloset.code-workspace` - Workspace

Arquivo de workspace que pode ser aberto diretamente:
```bash
code MyCloset.code-workspace
```

Inclui configurações consolidadas e atalhos rápidos.

### `snippets.code-snippets` - Code Snippets

Snippets customizados para desenvolvimento rápido:

| Prefix | Descrição |
|--------|-----------|
| `rnfc` | React Native Functional Component |
| `rnscreen` | React Native Screen com SafeAreaView |
| `jtest` | Jest Test Suite |
| `rnstyle` | React Native StyleSheet |
| `iuc` | Import useCloset |
| `ucloset` | Use Closet Hook |
| `clg` | Console.log com label |
| `tryc` | Try/Catch block |

---

## 🚀 Como Usar

### Método 1: Command Palette (Recomendado)

1. Abra o Command Palette: **Ctrl+Shift+P** (Windows/Linux) ou **Cmd+Shift+P** (Mac)
2. Digite "Run Task"
3. Selecione a tarefa desejada

**Exemplos:**
- "Run Task" → "Start Expo" - Inicia o servidor
- "Run Task" → "Start iOS" - Abre no simulador iOS
- "Run Task" → "Run Tests (Watch)" - Testes em watch mode

### Método 2: Atalhos de Teclado

Configure atalhos personalizados em **Preferências → Keyboard Shortcuts**:

```json
{
  "key": "ctrl+shift+r",
  "command": "workbench.action.tasks.runTask",
  "args": "Start Expo"
}
```

### Método 3: Menu Terminal

1. Menu **Terminal** → **Run Task...**
2. Selecione a tarefa

### Método 4: Debugger (F5)

1. Abra a barra lateral de Debug (**Ctrl+Shift+D**)
2. Selecione a configuração no dropdown
3. Pressione **F5** ou clique em "Start Debugging"

---

## 📝 Fluxo de Trabalho Recomendado

### Início do Dia

```bash
1. Abra o projeto no VS Code
2. Run Task → "Full Development Setup" (primeira vez)
3. Run Task → "Start Expo"
4. F5 → "Debug iOS" ou "Debug Android"
```

### Durante o Desenvolvimento

```bash
1. Edite os arquivos (auto-save e auto-format ativos)
2. Run Task → "Run Tests (Watch)" em outro terminal
3. Use snippets (rnfc, rnscreen, etc.) para código rápido
4. Debug com breakpoints quando necessário
```

### Antes de Commit

```bash
1. Run Task → "Lint" (verifica problemas)
2. Run Task → "Build TypeScript" (verifica erros)
3. Run Task → "Run Tests (Coverage)" (verifica cobertura)
4. Run Task → "Format Code" (formata tudo)
5. Run Task → "Git: Commit & Push"
```

### Resolução de Problemas

```bash
# App não inicia:
Run Task → "Kill Expo/Metro"
Run Task → "Clear Metro Cache"
Run Task → "Start Expo"

# Dependências quebradas:
Run Task → "Clean Install"

# TypeScript reclamando:
Run Task → "Build TypeScript"
```

---

## 🎯 Dicas e Truques

### Atalhos Úteis

| Ação | Atalho |
|------|--------|
| Command Palette | `Ctrl+Shift+P` |
| Quick Open | `Ctrl+P` |
| Terminal | `` Ctrl+` `` |
| Debug | `F5` |
| Run Task | `Ctrl+Shift+B` |
| Go to Definition | `F12` |
| Find All References | `Shift+F12` |
| Rename Symbol | `F2` |
| Format Document | `Shift+Alt+F` |

### Snippets Rápidos

```typescript
// Digite "rnfc" + Tab
// Cria componente funcional completo

// Digite "jtest" + Tab
// Cria suite de testes

// Digite "ucloset" + Tab
// Adiciona hook useCloset
```

### Debug de Testes

Para debugar um teste específico:

1. Abra o arquivo de teste
2. Coloque breakpoints (clique na margem esquerda)
3. F5 → "Debug Current Jest Test"
4. O debugger para nos breakpoints

### Extensões Adicionais Úteis

Instale via **Ctrl+Shift+X**:

- **Thunder Client** - Testar APIs (quando adicionar backend)
- **GitLens** - Visualizar histórico do Git
- **Todo Tree** - Gerenciar TODOs no código
- **Bracket Pair Colorizer** - Colorir brackets
- **Rainbow CSV** - Visualizar arquivos CSV

---

## 🔧 Personalização

### Adicionar Nova Tarefa

Edite `.vscode/tasks.json`:

```json
{
  "label": "Minha Tarefa",
  "type": "shell",
  "command": "comando aqui",
  "problemMatcher": []
}
```

### Adicionar Nova Configuração de Debug

Edite `.vscode/launch.json`:

```json
{
  "name": "Meu Debug",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/script.js"
}
```

### Adicionar Novo Snippet

Edite `.vscode/snippets.code-snippets`:

```json
"Meu Snippet": {
  "prefix": "msnip",
  "body": [
    "código aqui"
  ],
  "description": "Descrição"
}
```

---

## 🐛 Troubleshooting

### Tarefas não aparecem

1. Recarregue o VS Code: **Ctrl+Shift+P** → "Reload Window"
2. Verifique se `tasks.json` está válido (JSON)

### Debug não funciona

1. Instale a extensão "React Native Tools"
2. Certifique-se de que o Metro bundler está rodando
3. Verifique se `launch.json` está correto

### Formatação não funciona

1. Instale a extensão "Prettier"
2. Configure como formatter padrão:
   - **Ctrl+Shift+P** → "Format Document With..."
   - Selecione "Prettier"
   - Marque "Set as default formatter"

### ESLint não funciona

1. Instale a extensão "ESLint"
2. Execute: `npm install`
3. Recarregue o VS Code

---

## 📚 Recursos Adicionais

### Documentação VS Code
- [Tasks](https://code.visualstudio.com/docs/editor/tasks)
- [Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [Snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

### Extensões Recomendadas
- [React Native Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Comunidade
- [VS Code Tips](https://github.com/microsoft/vscode-tips-and-tricks)
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)

---

**Última atualização:** 2025-11-16
**Versão:** 1.0.0
**Projeto:** MyCloset Beta
