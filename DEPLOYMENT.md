# 🚀 Deployment Guide

Este guia explica como configurar e publicar o **Jeito de Casa** no GitHub Pages usando GitHub Actions.

## 📋 Pré-requisitos

- Repositório no GitHub
- Código commitado e pushado para o branch `main`

## ⚙️ Configuração do GitHub Pages

1. Acesse o repositório no GitHub
2. Vá em **Settings** → **Pages**
3. Em **Source**, selecione **GitHub Actions**

![GitHub Pages Configuration](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/creating-custom-github-actions-workflow-to-publish-site.webp)

## 🔧 Arquivos de Configuração

### GitHub Actions Workflow

O arquivo `.github/workflows/deploy.yml` foi criado com a seguinte configuração:

- **Trigger**: Executa automaticamente em push para `main` ou manualmente via workflow_dispatch
- **Build**: Instala dependências e compila o projeto com Vite
- **Deploy**: Publica os arquivos da pasta `dist` no GitHub Pages

### Vite Configuration

O arquivo `vite.config.js` foi atualizado com:

```javascript
base: '/jeito-de-casa/'
```

Isso garante que todos os assets (CSS, JS, imagens) sejam carregados corretamente quando o app estiver hospedado em `https://seu-usuario.github.io/jeito-de-casa/`.

## 🚀 Como Publicar

### Primeira Publicação

1. Commit e push das alterações:
```bash
git add .
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

2. O GitHub Actions será executado automaticamente
3. Acompanhe o progresso em **Actions** no repositório
4. Após a conclusão, o site estará disponível em:
   ```
   https://LeandroAdeko.github.io/jeito-de-casa/
   ```

### Publicações Futuras

Qualquer push para o branch `main` irá automaticamente:
1. Executar o build do projeto
2. Publicar a nova versão no GitHub Pages

### Publicação Manual

Você também pode executar o workflow manualmente:
1. Vá em **Actions** no repositório
2. Selecione **Deploy to GitHub Pages**
3. Clique em **Run workflow**

## 🔐 Variáveis de Ambiente (Firebase)

> ⚠️ **IMPORTANTE**: Variáveis de ambiente não são incluídas automaticamente no deploy.

Se você estiver usando Firebase (autenticação), precisa configurar as variáveis de ambiente:

### Opção 1: GitHub Secrets (Recomendado)

1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Adicione as seguintes secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. Atualize o workflow `.github/workflows/deploy.yml` para incluir as variáveis no build:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
    VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
    VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
    VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
    VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
```

### Opção 2: Modo de Desenvolvimento

Se preferir manter o modo de desenvolvimento (sem autenticação) no deploy, não é necessário configurar as variáveis do Firebase.

## 🔍 Verificação

Após o deploy, verifique:

- ✅ Site carrega corretamente
- ✅ Navegação entre páginas funciona
- ✅ Assets (CSS, imagens) são carregados
- ✅ Funcionalidades principais estão operacionais

## 🐛 Troubleshooting

### Página 404 ao acessar rotas diretamente

Se você receber erro 404 ao acessar rotas como `/meal-organizer` diretamente, adicione um arquivo `public/404.html` que redireciona para `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Jeito de Casa</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/jeito-de-casa/'">
  </head>
</html>
```

### Assets não carregam

Verifique se o `base` no `vite.config.js` está correto:
- Para `https://usuario.github.io/jeito-de-casa/` → `base: '/jeito-de-casa/'`
- Para domínio customizado → `base: '/'`

## 📚 Recursos Adicionais

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
