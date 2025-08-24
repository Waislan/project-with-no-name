# Project with No Name

## Descrição
API REST construída com Node.js, Express e PostgreSQL seguindo padrões de arquitetura limpa.

## Estrutura do Projeto
```
api/
├── controllers/     # Controladores da aplicação
├── services/        # Lógica de negócio
├── repositories/    # Acesso a dados
├── factories/       # Fábricas para injeção de dependência
├── interfaces/      # Contratos/interfaces
├── routes/          # Definição de rotas
├── database/        # Configuração do banco de dados
├── server.js        # Servidor para desenvolvimento local
├── vercel.js        # Ponto de entrada para Vercel
└── app.js           # Classe principal da aplicação
```

## Tecnologias
- Node.js
- Express.js
- PostgreSQL
- Vercel (deploy)

## Como Executar Localmente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Execute o servidor:
```bash
npm run dev
```

## Deploy no Vercel

### Pré-requisitos
- Conta no Vercel
- Projeto conectado ao repositório Git

### Passos para Deploy

1. **Instale o Vercel CLI** (opcional):
```bash
npm i -g vercel
```

2. **Deploy automático**:
- Faça push para o branch principal
- O Vercel detectará automaticamente o projeto e fará o deploy

3. **Deploy manual**:
```bash
vercel
```

### Configuração do Vercel

O projeto está configurado para usar uma única função serverless (`api/vercel.js`) que consolida todas as rotas, evitando o erro de limite de 12 funções do plano Hobby.

### Variáveis de Ambiente no Vercel

Configure as seguintes variáveis no dashboard do Vercel:
- `DATABASE_URL`: URL de conexão com o PostgreSQL
- `NODE_ENV`: `production`

## Endpoints da API

### Usuários
- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Buscar usuário por ID
- `POST /users` - Criar usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### Pacientes
- `GET /users/:userId/patients` - Listar pacientes de um usuário
- `POST /users/:userId/patients` - Criar paciente
- `GET /users/:userId/patients/:id` - Buscar paciente por ID
- `PUT /users/:userId/patients/:id` - Atualizar paciente
- `DELETE /users/:userId/patients/:id` - Deletar paciente

### Consultas
- `GET /users/:userId/consultations` - Listar consultas de um usuário
- `GET /users/:userId/patients/:patientId/consultations` - Listar consultas de um paciente
- `POST /users/:userId/patients/:patientId/consultations` - Criar consulta
- `GET /users/:userId/patients/:patientId/consultations/:id` - Buscar consulta por ID
- `PUT /users/:userId/patients/:patientId/consultations/:id` - Atualizar consulta
- `DELETE /users/:userId/patients/:patientId/consultations/:id` - Deletar consulta

## Arquitetura

O projeto segue os princípios da Clean Architecture:

- **Controllers**: Responsáveis por receber requisições HTTP e retornar respostas
- **Services**: Contêm a lógica de negócio da aplicação
- **Repositories**: Gerenciam o acesso aos dados
- **Factories**: Criam instâncias das classes com suas dependências injetadas
- **Interfaces**: Definem contratos entre as camadas

## Solução para Limite de Funções no Vercel

Para resolver o erro "No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan", o projeto foi configurado para usar uma única função serverless (`api/vercel.js`) que consolida todas as rotas do Express.

Isso é alcançado através de:
1. Um único arquivo de entrada para o Vercel
2. Configuração no `vercel.json` que roteia todas as requisições para essa função
3. Cache da aplicação Express para reutilização entre invocações