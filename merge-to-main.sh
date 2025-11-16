#!/bin/bash
# Script para mergear branch de desenvolvimento na main
# Uso: bash merge-to-main.sh
#
# ATENÇÃO: Este script requer permissões de administrador no repositório!

set -e  # Sair se qualquer comando falhar

echo "🔄 Iniciando processo de merge para branch main..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variáveis
DEV_BRANCH="claude/test-critical-areas-01ATetHamQrm8Nx82RAUe2aG"
MAIN_BRANCH="main"

echo -e "${YELLOW}[1/7]${NC} Salvando branch atual..."
CURRENT_BRANCH=$(git branch --show-current)
echo "    Branch atual: $CURRENT_BRANCH"
echo ""

echo -e "${YELLOW}[2/7]${NC} Verificando se há alterações não commitadas..."
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}    ❌ Erro: Há alterações não commitadas!${NC}"
    echo "    Por favor, commit ou stash suas alterações antes de continuar."
    exit 1
fi
echo -e "${GREEN}    ✓ Working directory limpo${NC}"
echo ""

echo -e "${YELLOW}[3/7]${NC} Fazendo fetch do repositório remoto..."
git fetch origin
echo -e "${GREEN}    ✓ Fetch completo${NC}"
echo ""

echo -e "${YELLOW}[4/7]${NC} Fazendo checkout da branch main..."
git checkout $MAIN_BRANCH
echo -e "${GREEN}    ✓ Checkout completo${NC}"
echo ""

echo -e "${YELLOW}[5/7]${NC} Atualizando branch main com últimas alterações..."
git pull origin $MAIN_BRANCH
echo -e "${GREEN}    ✓ Pull completo${NC}"
echo ""

echo -e "${YELLOW}[6/7]${NC} Mergeando branch de desenvolvimento..."
echo "    Branch: $DEV_BRANCH"
git merge $DEV_BRANCH --no-ff -m "Merge: Corrige dependências NPM e finaliza testes críticos

- Adiciona arquivo .npmrc com legacy-peer-deps
- Corrige versão do react-test-renderer (18.2.0)
- Atualiza tsconfig.json com extends Expo
- Resolve erro de módulo serve-static/debug
- Mantém 141 testes passando (98.23% coverage)

Closes testing phase with complete test suite and dependency fixes."
echo -e "${GREEN}    ✓ Merge completo${NC}"
echo ""

echo -e "${YELLOW}[7/7]${NC} Fazendo push para o repositório remoto..."
echo "    ATENÇÃO: Este comando pode falhar se a branch main estiver protegida!"
echo ""

# Tentar push normal
if git push origin $MAIN_BRANCH; then
    echo -e "${GREEN}    ✓ Push completo!${NC}"
    echo ""
    echo -e "${GREEN}✅ SUCESSO!${NC} Branch $DEV_BRANCH mergeada em $MAIN_BRANCH"
    echo ""
    echo "Próximos passos:"
    echo "  - Verificar no GitHub: https://github.com/spyDuarte/myclosetb_beta"
    echo "  - Deletar branch de desenvolvimento (opcional):"
    echo "    git branch -d $DEV_BRANCH"
    echo "    git push origin --delete $DEV_BRANCH"
else
    echo -e "${RED}    ❌ Erro no push!${NC}"
    echo ""
    echo "A branch main está protegida. Você tem 3 opções:"
    echo ""
    echo "OPÇÃO 1: Criar Pull Request via GitHub Web"
    echo "  1. Acesse: https://github.com/spyDuarte/myclosetb_beta/compare"
    echo "  2. Configure base:main ← compare:$DEV_BRANCH"
    echo "  3. Crie e aprove o PR"
    echo ""
    echo "OPÇÃO 2: Usar GitHub CLI (se instalado)"
    echo "  gh pr create --base main --head $DEV_BRANCH --fill"
    echo "  gh pr merge --merge --delete-branch"
    echo ""
    echo "OPÇÃO 3: Desabilitar proteção da branch (Admin)"
    echo "  1. Settings → Branches → Branch protection rules"
    echo "  2. Desabilitar temporariamente"
    echo "  3. Executar: git push origin $MAIN_BRANCH"
    echo "  4. Reabilitar proteção"
    echo ""
    echo "Desfazendo o merge local:"
    echo "  git reset --hard origin/$MAIN_BRANCH"
    echo ""
    exit 1
fi

# Retornar para a branch original (opcional)
if [[ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]]; then
    echo "Retornando para branch original: $CURRENT_BRANCH"
    git checkout $CURRENT_BRANCH
fi

echo ""
echo -e "${GREEN}🎉 Processo concluído!${NC}"
