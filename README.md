
# Comunidade do Luto - Plataforma de Apoio

Uma plataforma completa de apoio ao luto com comunidade, blog e sistema administrativo.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Estado**: React Query (@tanstack/react-query)
- **Roteamento**: React Router DOM

## 📋 Funcionalidades

### 🏠 Site Principal
- Landing page com informações sobre a plataforma
- Sistema de contato
- Newsletter
- Blog público
- Planos e preços

### 👥 Comunidade
- **Fóruns de discussão** organizados por categorias
- **Grupos privados** de apoio (máximo 12 membros)
- **Sistema de posts** com likes e comentários
- **Perfis anônimos** para privacidade
- **Moderação** integrada

### 🛠️ Painel Administrativo
- **Dashboard** com estatísticas
- **Gestão de contatos** e mensagens
- **Administração da newsletter**
- **Editor de blog** com upload de imagens
- **Configurações** do site e rastreamento
- **Gestão de integrações**

## 🔐 Autenticação

### Tipos de Usuários
- **Visitantes**: Acesso ao site público e blog
- **Membros da Comunidade**: Acesso aos fóruns e grupos
- **Administradores**: Acesso ao painel administrativo

### Fluxos de Login
- **Comunidade**: `/comunidade/login`
- **Administração**: `/admin/login`

## 📱 Links de Acesso

### 🎯 Páginas Principais
- **Home**: `/`
- **Blog**: `/blog`
- **Comunidade**: `/comunidade`

### 👥 Área da Comunidade (Requer Login)
- **Login/Cadastro**: `/comunidade/login`
- **Dashboard**: `/comunidade` (após login)
- **Grupos**: `/comunidade/grupos`
- **Discussões Ativas**: `/comunidade/ativos`
- **Categorias**: `/comunidade/:slug`

### 🛠️ Painel Administrativo (Requer Permissões Admin)
- **Login Admin**: `/admin/login`
- **Dashboard**: `/admin`
- **Contatos**: `/admin/contacts`
- **Newsletter**: `/admin/newsletter`
- **Blog**: `/admin/blog`
- **Integrações**: `/admin/integrations`
- **Configurações**: `/admin/settings`

### 📄 Páginas Legais
- **Termos de Uso**: `/termos-de-uso`
- **Política de Privacidade**: `/politica-de-privacidade`
- **Política de Cookies**: `/politica-de-cookies`

## 🚀 Como Executar

```bash
# 1. Clone o repositório
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente no Supabase
# - Acesse o painel do Supabase
# - Configure as integrações necessárias

# 4. Execute o projeto
npm run dev
```

## 📊 Estrutura do Banco de Dados

### Principais Tabelas
- `community_profiles` - Perfis dos usuários da comunidade
- `forum_categories` - Categorias dos fóruns
- `forum_posts` - Posts dos fóruns
- `forum_comments` - Comentários dos posts
- `community_groups` - Grupos privados
- `group_members` - Membros dos grupos
- `blog_posts` - Posts do blog
- `contact_messages` - Mensagens de contato
- `newsletter_subscriptions` - Assinantes da newsletter
- `user_roles` - Roles dos usuários (admin, etc.)

## 🔧 Configuração de Produção

### Supabase
1. **URL Configuration** em Authentication:
   - Site URL: URL do seu domínio
   - Redirect URLs: URLs autorizadas para redirect

2. **Email Templates**: Configure templates personalizados

3. **RLS Policies**: Já configuradas para segurança

### Deploy
1. **Conecte seu domínio** nas configurações do projeto
2. **Configure variáveis de ambiente** no Supabase
3. **Publique** usando o botão "Publish" no Lovable

## 🛡️ Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Autenticação** via Supabase Auth
- **Validação** de permissões em todas as operações
- **Anonimato** opcional para membros da comunidade

## 📈 Performance

- **React Query** para cache de dados
- **Lazy loading** de componentes
- **Otimização** de re-renders
- **Compressão** de imagens automática

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico ou dúvidas sobre a plataforma, acesse:
- **Comunidade**: Para discussões e apoio entre usuários
- **Contato**: Formulário de contato no site principal

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para apoiar pessoas em processo de luto**
