# VibeFlix - Plataforma CMS de Cursos

Plataforma CMS estilo Netflix para armazenar e gerenciar cursos e conteúdos de mentorias.

## 🚀 Tecnologias

- **Next.js 14+** (App Router) com TypeScript
- **PostgreSQL** com Prisma ORM
- **JWT** para autenticação
- **shadcn/ui** + Tailwind CSS para UI
- **React Query** para gerenciamento de estado
- **Docker** para containerização

## 📋 Pré-requisitos

- Node.js 20+ 
- Docker e Docker Compose (para desenvolvimento com containers)
- PostgreSQL (se não usar Docker)

## 🛠️ Instalação

### Opção 1: Desenvolvimento Local

1. Clone o repositório:
```bash
git clone <repository-url>
cd VibeFlix
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vibeflix?schema=public"
JWT_SECRET="seu-secret-jwt-aqui"
```

4. Configure o banco de dados:
```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev

# (Opcional) Popular banco com dados iniciais
npm run db:seed
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Opção 2: Docker Compose

1. Clone o repositório:
```bash
git clone <repository-url>
cd VibeFlix
```

2. Configure as variáveis de ambiente no `docker-compose.yml` ou crie um arquivo `.env`:
```env
DATABASE_URL="postgresql://vibeflix:vibeflix_password@postgres:5432/vibeflix?schema=public"
JWT_SECRET="seu-secret-jwt-aqui"
```

3. Inicie os containers:
```bash
docker-compose up -d
```

4. Execute as migrations:
```bash
docker-compose exec app npx prisma migrate deploy
```

5. (Opcional) Popule o banco com dados iniciais:
```bash
docker-compose exec app npm run db:seed
```

A aplicação estará disponível em `http://localhost:3000`

## 👤 Usuários Padrão

Após executar o seed, você terá os seguintes usuários:

**Admin:**
- Email: `admin@vibeflix.com`
- Senha: `admin123`

**Aluno:**
- Email: `aluno@vibeflix.com`
- Senha: `student123`

⚠️ **IMPORTANTE**: Altere essas senhas em produção!

## 📚 Funcionalidades

### Painel Admin

- **Dashboard**: Estatísticas gerais (alunos, cursos, aulas, inscrições)
- **Gerenciamento de Cursos**: Criar, editar e deletar cursos
- **Gerenciamento de Aulas**: Adicionar aulas com vídeos do YouTube ou Google Drive
- **Gerenciamento de Alunos**: Visualizar lista de alunos
- **Gerenciamento de Inscrições**: Habilitar/desabilitar acesso de alunos a cursos
- **Planos de Aulas**: Criar planos de aulas futuras

### Interface do Aluno

- **Dashboard**: Visualizar cursos inscritos e disponíveis
- **Galeria de Cursos**: Navegação estilo Netflix com carrossel horizontal
- **Player de Vídeo**: Reprodução de vídeos do YouTube e Google Drive
- **Sistema de Notas**: Anotações pessoais por aula
- **Sistema de Comentários**: Comentários nas aulas
- **Preview de Cursos**: Visualização de cursos não habilitados (com bloqueio)

## 🎨 Personalização

As cores e estilos seguem o tema Netflix e podem ser customizadas através das variáveis CSS em `src/app/globals.css`.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run db:push` - Sincroniza schema com banco (sem migrations)
- `npm run db:migrate` - Cria e aplica nova migration
- `npm run db:studio` - Abre Prisma Studio
- `npm run db:seed` - Popula banco com dados iniciais

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- Autenticação JWT com cookies httpOnly
- Middleware de proteção de rotas
- Validação de dados com Zod
- Proteção CSRF através do middleware do Next.js

## 🐳 Docker

### Build da imagem:
```bash
docker build -t vibeflix .
```

### Executar container:
```bash
docker run -p 3000:3000 --env-file .env vibeflix
```

## 📦 Estrutura do Projeto

```
VibeFlix/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── seed.ts            # Script de seed
├── src/
│   ├── app/
│   │   ├── (auth)/        # Páginas de autenticação
│   │   ├── (admin)/       # Páginas do admin
│   │   ├── (student)/     # Páginas do aluno
│   │   └── api/           # API Routes
│   ├── components/
│   │   ├── ui/            # Componentes shadcn/ui
│   │   ├── admin/         # Componentes do admin
│   │   └── student/       # Componentes do aluno
│   └── lib/               # Utilitários e helpers
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🚧 Próximas Funcionalidades

- Integração com sistemas de pagamento
- Sistema de progresso de aulas
- Certificados de conclusão
- Notificações
- Busca avançada

## 📄 Licença

Este projeto é privado e de uso exclusivo.

## 🤝 Suporte

Para dúvidas ou problemas, entre em contato com o administrador do sistema.
