# Deploy no Vercel - Instruções Completas

## 🚀 Solução para o Erro de Limite de Funções

O projeto foi configurado para resolver o erro:
```
Error: No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan
```

### Como Funciona a Solução

1. **Arquivo Único**: `api/vercel.js` consolida todas as rotas em uma única função serverless
2. **Configuração**: `vercel.json` roteia todas as requisições para essa função
3. **Cache**: A aplicação Express é inicializada uma vez e reutilizada entre invocações

## 📋 Pré-requisitos

- [ ] Conta no Vercel (gratuita)
- [ ] Projeto conectado ao repositório Git
- [ ] Banco PostgreSQL configurado e acessível

## 🔧 Configuração do Banco de Dados

### 1. Variáveis de Ambiente no Vercel

No dashboard do Vercel, vá em **Settings > Environment Variables** e configure:

```
DATABASE_URL=postgresql://username:password@host:port/database_name
NODE_ENV=production
```

**Importante**: Use `DATABASE_URL` (não `DB_URL`) para compatibilidade com o Vercel.

### 2. Configuração do PostgreSQL

Certifique-se de que:
- O banco está acessível externamente
- SSL está configurado corretamente
- As tabelas necessárias existem

## 🚀 Deploy Automático

### 1. Conecte o Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **New Project**
3. Importe seu repositório Git
4. O Vercel detectará automaticamente a configuração

### 2. Configuração Automática

O Vercel usará:
- **Build Command**: Automático (detecta Node.js)
- **Output Directory**: Automático
- **Install Command**: `npm install`

### 3. Deploy

- Faça push para o branch principal
- O Vercel fará deploy automático
- Acesse a URL fornecida

## 🔍 Verificação do Deploy

### 1. Logs de Build

Verifique se não há erros nos logs de build do Vercel.

### 2. Teste dos Endpoints

Teste os endpoints principais:
```bash
# Listar usuários
curl https://seu-projeto.vercel.app/users

# Health check
curl https://seu-projeto.vercel.app/
```

### 3. Logs de Runtime

No dashboard do Vercel, verifique os logs de runtime para erros.

## 🛠️ Solução de Problemas

### Erro de Conexão com Banco

```
Error: Failed to initialize application
```

**Solução**:
1. Verifique se `DATABASE_URL` está configurada
2. Teste a conexão localmente
3. Verifique se o banco está acessível externamente

### Erro de Build

```
Build failed
```

**Solução**:
1. Verifique os logs de build
2. Teste localmente com `npm run build`
3. Verifique se todas as dependências estão em `package.json`

### Erro de Runtime

```
Function execution timeout
```

**Solução**:
1. O `maxDuration` está configurado para 30 segundos
2. Verifique se o banco está respondendo rapidamente
3. Considere otimizar queries lentas

## 📊 Monitoramento

### 1. Métricas do Vercel

- **Function Invocations**: Número de chamadas
- **Function Duration**: Tempo de execução
- **Error Rate**: Taxa de erro

### 2. Logs

- **Build Logs**: Durante o deploy
- **Runtime Logs**: Durante a execução
- **Function Logs**: Logs específicos da função

## 🔄 Atualizações

### 1. Deploy Automático

- Push para o branch principal = deploy automático
- O Vercel detecta mudanças e faz rebuild

### 2. Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## 💡 Dicas de Performance

### 1. Cold Start

- A primeira requisição pode ser mais lenta
- Use cache para reduzir tempo de inicialização

### 2. Conexão com Banco

- O pool de conexões é reutilizado entre invocações
- Configure `maxDuration` adequadamente

### 3. Dependências

- Mantenha apenas dependências necessárias
- Use `dependencies` (não `devDependencies`)

## 🆘 Suporte

### 1. Vercel

- [Documentação](https://vercel.com/docs)
- [Comunidade](https://github.com/vercel/vercel/discussions)

### 2. Projeto

- Verifique os logs no dashboard do Vercel
- Teste localmente primeiro
- Verifique as variáveis de ambiente

## ✅ Checklist de Deploy

- [ ] Repositório conectado ao Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Banco PostgreSQL acessível
- [ ] Build bem-sucedido
- [ ] Endpoints funcionando
- [ ] Logs sem erros críticos
- [ ] Performance aceitável
