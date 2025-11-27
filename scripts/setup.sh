#!/bin/bash

# FinanceControl - Setup Script
# Este script configura e inicializa o ambiente de desenvolvimento

echo "🚀 Iniciando setup do FinanceControl..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ requerida. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js versão $(node -v) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se .env existe, se não, criar
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOL
# Database
DATABASE_URL="file:./db/custom.db"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# App Configuration
NODE_ENV="development"
PORT=3000

# Email (opcional)
EMAIL_HOST=""
EMAIL_PORT=""
EMAIL_USER=""
EMAIL_PASS=""
EOL
    echo "✅ Arquivo .env criado"
fi

# Criar diretório do banco de dados se não existir
mkdir -p db

# Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# Fazer push do schema para o banco
echo "🗄️ Configurando banco de dados..."
npx prisma db push

# Popular banco com dados iniciais
echo "🌱 Populando banco com dados iniciais..."
npx tsx prisma/seed.ts

# Verificar se o build funciona
echo "🏗️ Testando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build realizado com sucesso!"
else
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi

# Limpar build de desenvolvimento
rm -rf .next

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Comandos úteis:"
echo "  npm run dev        - Iniciar servidor de desenvolvimento"
echo "  npm run build      - Build para produção"
echo "  npm run start      - Iniciar servidor de produção"
echo "  npm run lint       - Verificar código com ESLint"
echo "  npm run db:studio  - Abrir Prisma Studio"
echo "  npm run db:push    - Atualizar schema do banco"
echo "  npm run db:seed    - Popular banco com dados iniciais"
echo ""
echo "🌐 Aplicação estará disponível em: http://localhost:3000"
echo "🗄️ Prisma Studio: http://localhost:5555 (comando: npm run db:studio)"
echo ""
echo "🚀 Para iniciar o desenvolvimento: npm run dev"