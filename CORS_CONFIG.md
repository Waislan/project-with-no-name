# Configuração CORS - Backend Express

## Problema Resolvido
O frontend Next.js rodando na porta 4000 (localhost:4000) estava recebendo erros de CORS ao tentar fazer requisições para o backend Express na porta 3000 (localhost:3000).

## Solução Implementada

### 1. Instalação da Dependência
```bash
npm install cors
```

### 2. Configuração no App.js
A configuração do CORS foi adicionada em `src/app.js` antes de qualquer middleware de rota:

```javascript
import cors from 'cors';

// Configuração do CORS
this.express.use(cors({
    origin: [
        'http://localhost:4000',           // Desenvolvimento local
        'http://localhost:3001',           // Desenvolvimento local
        'https://nutria-nine.vercel.app'   // Produção no Vercel
    ],
    credentials: true,                     // Permite cookies e headers de autenticação
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization']     // Headers permitidos
}));
```

## Detalhes da Configuração

### Origins Permitidos
- **Desenvolvimento**: `http://localhost:4000` (porta atual)
- **Desenvolvimento**: `http://localhost:3001` (porta anterior - mantida para compatibilidade)
- **Produção**: `https://nutria-nine.vercel.app`

### Configurações Adicionais
- **credentials: true**: Permite o envio de cookies e headers de autenticação
- **methods**: Todos os métodos HTTP comuns (GET, POST, PUT, DELETE, OPTIONS)
- **allowedHeaders**: Headers padrão para APIs REST (Content-Type, Authorization)

## Como Funciona

1. **Middleware CORS**: É executado antes de qualquer rota
2. **Validação de Origin**: Verifica se a origem da requisição está na lista permitida
3. **Headers CORS**: Adiciona automaticamente os headers necessários para o navegador
4. **Preflight OPTIONS**: Responde automaticamente às requisições OPTIONS do navegador

## Teste da Configuração

Após reiniciar o servidor, o frontend deve conseguir fazer requisições sem erros de CORS:

```bash
npm start
```

## Segurança

- Apenas as origens especificadas podem acessar a API
- O middleware é executado antes das rotas, garantindo que todas as requisições sejam validadas
- Headers sensíveis não são expostos automaticamente

## Troubleshooting

Se ainda houver problemas de CORS:

1. Verifique se o servidor foi reiniciado
2. Confirme que as origens estão corretas
3. Verifique se não há outros middlewares interferindo
4. Use as ferramentas de desenvolvedor do navegador para ver os headers CORS
