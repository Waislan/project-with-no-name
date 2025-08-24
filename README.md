# Patient Management API

Uma API REST completa para gerenciamento de usuários e pacientes, construída com Node.js, Express.js e PostgreSQL, integrada com Supabase Auth, seguindo padrões de arquitetura limpa.

## 🏗️ Arquitetura

O projeto segue uma **Arquitetura Limpa** com separação clara de responsabilidades:

- **Routes**: Definições de endpoints HTTP
- **Controllers**: Manipulação de requisições/respostas
- **Services**: Lógica de negócio
- **Repositories**: Camada de acesso a dados
- **Factories**: Injeção de dependências
- **Interfaces**: Classes base abstratas para consistência

## 🚀 Funcionalidades

### Users (Usuários via Supabase Auth)
- ✅ **Gerenciamento de Perfis**: Criar, ler, atualizar e deletar perfis de usuário
- 🔐 **Autenticação**: Gerenciada pelo Supabase Auth
- 🔐 **Validações**: Nome obrigatório para perfil
- 🆔 **Identificação**: IDs UUID únicos do Supabase Auth

### Patients (Pacientes)
- ✅ **CRUD Completo**: Criar, ler, atualizar e deletar pacientes
- 🔗 **Dependência**: Pacientes pertencem a usuários específicos
- 🔐 **Validações**: Nome obrigatório, CPF obrigatório, user_id obrigatório
- 🆔 **Identificação**: IDs UUID únicos

## 📡 Endpoints da API

### Users
```
GET    /users                    - Listar todos os usuários
GET    /users/:id                - Buscar usuário por ID
POST   /users                    - Criar perfil de usuário
PUT    /users/:id                - Atualizar perfil de usuário
DELETE /users/:id                - Deletar perfil de usuário
GET    /users/:id/profile        - Buscar usuário com perfil completo
POST   /users/:id/profile        - Criar perfil para usuário existente
```

### Patients (Nested Routes)
```
GET    /users/:userId/patients           - Listar pacientes de um usuário
POST   /users/:userId/patients           - Criar paciente para um usuário
GET    /users/:userId/patients/:id       - Buscar paciente específico
PUT    /users/:userId/patients/:id       - Atualizar paciente
DELETE /users/:userId/patients/:id       - Deletar paciente
```

### Patients (Global Routes - Compatibilidade)
```
GET    /patients           - Listar todos os pacientes
GET    /patients/:id       - Buscar paciente por ID
```

## 🛠️ Tecnologias

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.1.0
- **Database**: PostgreSQL com driver `pg` v8.16.3
- **Authentication**: Supabase Auth
- **Environment**: dotenv v17.2.1
- **Arquitetura**: Arquitetura em camadas com injeção de dependências

## 📁 Estrutura do Projeto

```
src/
├── app.js                    # Classe principal da aplicação
├── server.js                 # Ponto de entrada da aplicação
├── controllers/              # Manipuladores de requisições
│   ├── UserController.js
│   └── PatientController.js
├── database/                 # Configuração do banco de dados
│   └── db.js
├── factories/                # Injeção de dependências
│   ├── UserFactory.js
│   └── PatientFactory.js
├── interfaces/               # Classes base abstratas
│   ├── IController.js
│   ├── IService.js
│   └── IRepository.js
├── repositories/             # Camada de acesso a dados
│   ├── UserRepository.js
│   └── PatientRepository.js
├── routes/                   # Definições de rotas
│   ├── UserRoutes.js
│   └── PatientRoutes.js
└── services/                 # Lógica de negócio
    ├── UserService.js
    └── PatientService.js
```

## 🗄️ Modelo de Dados

### Users (Supabase Auth)
```sql
-- Tabela gerenciada pelo Supabase Auth
auth.users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
)

-- Tabela de perfis de usuário
user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Patients
```sql
patients (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DB_URL=postgresql://username:password@localhost:5432/database_name
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Banco de Dados
Certifique-se de que:
- O Supabase está configurado e funcionando
- As tabelas `user_profiles` e `patients` existem no seu banco PostgreSQL
- A tabela `auth.users` é gerenciada pelo Supabase Auth

### 3. Instalação de Dependências
```bash
npm install
```

### 4. Executar a Aplicação
```bash
npm start
```

## 📋 Exemplos de Uso

### Criar Perfil de Usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"user_id": "uuid-do-supabase", "name": "João Silva"}'
```

### Criar Paciente para um Usuário
```bash
curl -X POST http://localhost:3000/users/{userId}/patients \
  -H "Content-Type: application/json" \
  -d '{"name": "Maria Santos", "cpf": "123.456.789-00"}'
```

### Listar Pacientes de um Usuário
```bash
curl http://localhost:3000/users/{userId}/patients
```

### Buscar Usuário com Perfil Completo
```bash
curl http://localhost:3000/users/{userId}/profile
```

## 🔒 Validações

### Users
- User ID é obrigatório (deve ser um UUID válido do Supabase)
- Nome é obrigatório para o perfil

### Patients
- Nome é obrigatório
- CPF é obrigatório
- User ID é obrigatório
- Paciente deve pertencer ao usuário especificado

## 🚨 Tratamento de Erros

- **400 Bad Request**: Dados inválidos ou campos obrigatórios ausentes
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## 🔄 Padrões de Design

1. **Dependency Injection**: Factory pattern para criar objetos com dependências
2. **Interface Segregation**: Classes base abstratas para contratos de API consistentes
3. **Single Responsibility**: Cada camada tem responsabilidades distintas
4. **Inversion of Control**: Módulos de alto nível não dependem de módulos de baixo nível

## 🚀 Pontos de Extensão

A arquitetura suporta fácil extensão através de:
- Adição de novos módulos de rotas (seguindo o padrão existente)
- Criação de novos triplets controller/service/repository
- Implementação de interfaces adicionais para diferentes tipos de entidades
- Adição de novas factories para injeção de dependências

## 📝 Comandos de Desenvolvimento

- `npm start` - Iniciar o servidor usando `node src/server.js`
- Servidor roda em `http://localhost:3000` por padrão

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.