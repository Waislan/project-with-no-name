### Contexto do Projeto

Este documento descreve a arquitetura, módulos, rotas e padrões do projeto para servir como contexto a LLMs e para manutenção/expansão futura.

## Visão Geral
- Nome: `project-with-no-name`
- Tech stack: Node.js (ESM), Express 5, PostgreSQL (`pg`), dotenv
- Entry point: `src/server.js`
- App setup: `src/app.js`
- DB: `src/database/db.js` (Pool do `pg` configurado via variáveis de ambiente)

## Arquitetura em Camadas
- `routes/`: Registro de endpoints HTTP, mapeiam para controllers
- `controllers/`: Orquestram validação simples, fluxo HTTP e chamada de services
- `services/`: Regras de negócio; delegam persistência a repositories
- `repositories/`: Acesso a dados (SQL) via `pg`
- `factories/`: Montagem e injeção de dependências (repo -> service -> controller)
- `interfaces/`: Contratos base (`IController`, `IService`, `IRepository`)

## Boot da Aplicação
- `src/server.js`
  - Carrega `.env` com `dotenv`
  - Cria conexão: `connectToDatabase()`
  - Instancia `App` com `db` e registradores de rotas: `UserRoutes`, `PatientRoutes`, `ConsultationRoutes`
  - Sobe HTTP server em `PORT`
- `src/app.js`
  - Configura `express.json()`
  - Registra rotas via funções registradoras recebidas no construtor

## Variáveis de Ambiente (.env)
- `PORT` (padrão 3000)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`
- Observação: Há suporte comentado a `DB_URL` no código, porém o fluxo atual usa os campos separados acima.

## Banco de Dados
- Conexão: `src/database/db.js` (Pool do `pg` com `ssl: { rejectUnauthorized: false }`)
- Tabelas esperadas:
  - `auth.users` (gerenciada pelo Supabase Auth)
  - `user_profiles (user_id PK, name, timestamps)`
  - `patients (id, user_id, name, cpf, timestamps)`
  - `consultations (id, user_id, patient_id, consultation_date, notes, report, transcription, timestamps)`

## Módulos e Arquivos Principais
- `src/app.js`: classe `App`
- `src/server.js`: bootstrap e `listen`
- `src/database/db.js`: função `connectToDatabase`
- `src/interfaces/`: `IController.js`, `IService.js`, `IRepository.js`
- `src/factories/`: `UserFactory.js`, `PatientFactory.js`, `ConsultationFactory.js`
- `src/repositories/`: `UserRepository.js`, `PatientRepository.js`, `ConsultationRepository.js`
- `src/services/`: `UserService.js`, `PatientService.js`, `ConsultationService.js`
- `src/controllers/`: `UserController.js`, `PatientController.js`, `ConsultationController.js`
- `src/routes/`: `UserRoutes.js`, `PatientRoutes.js`, `ConsultationRoutes.js`

## Padrão de Injeção de Dependências
- Cada `Factory` monta a cadeia repo -> service -> controller
- Exceção: `ConsultationFactory` depende do `PatientService` para validar ownership; ele é obtido construindo o `PatientController` e lendo `patientService` do controller

## Contratos/Interfaces
- `IRepository`: define métodos async (findAll, findById, save, update, delete). Implementações reais usam SQL.
- `IService`: encapsula repositório; permite sobrepor regras de negócio (ex.: validações e ownership em `ConsultationService`).
- `IController`: define assinatura dos handlers HTTP.

## Regras de Negócio
- Users: CRUD de perfis em `user_profiles`; verificação de e-mail existente (na prática, Supabase Auth gerenciaria criação). Update pode criar perfil se inexistente.
- Patients: CRUD vinculado a `user_id`. Métodos filtram por `user_id`.
- Consultations: CRUD vinculado a `user_id` e `patient_id`. Serviço valida que o paciente pertence ao usuário antes de criar/ler/atualizar/excluir.

## Rotas HTTP
- Users (`src/routes/UserRoutes.js` → `UserController`)
  - `GET /users`
  - `GET /users/:id`
  - `POST /users`
  - `PUT /users/:id`
  - `DELETE /users/:id`

- Patients (`src/routes/PatientRoutes.js` → `PatientController`)
  - `GET /users/:userId/patients`
  - `POST /users/:userId/patients`
  - `GET /users/:userId/patients/:id`
  - `PUT /users/:userId/patients/:id`
  - `DELETE /users/:userId/patients/:id`

- Consultations (`src/routes/ConsultationRoutes.js` → `ConsultationController`)
  - `GET /users/:userId/consultations`
  - `GET /users/:userId/patients/:patientId/consultations`
  - `POST /users/:userId/patients/:patientId/consultations`
  - `GET /users/:userId/patients/:patientId/consultations/:id`
  - `PUT /users/:userId/patients/:patientId/consultations/:id`
  - `DELETE /users/:userId/patients/:patientId/consultations/:id`

## Fluxos de Dados
- Request → `Route` → `Controller` → `Service` → `Repository` → DB
- Responses tratam:
  - 200 OK: sucesso comum
  - 201 Created: criação
  - 400 Bad Request: validações (`required`, ownership)
  - 404 Not Found: recurso inexistente/fora de escopo
  - 409 Conflict: e-mail já existente
  - 500 Internal Server Error: erros inesperados

## Convenções Importantes
- ESM (import/export) em todos os módulos
- `express.json()` habilitado
- SQL parametrizado com `$1..$n`
- IDs: `gen_random_uuid()` no DB (exceto placeholder em `UserRepository.save` para criar perfil)

## Como Adicionar uma Nova Entidade
1. Criar repositório em `src/repositories/NovaEntidadeRepository.js`
2. Criar serviço em `src/services/NovaEntidadeService.js`
3. Criar controller em `src/controllers/NovaEntidadeController.js`
4. Criar factory em `src/factories/NovaEntidadeFactory.js`
5. Criar registrador de rotas em `src/routes/NovaEntidadeRoutes.js`
6. Incluir registrador no array passado ao `App` em `src/server.js`

## Notas e Pontos de Atenção
- `UserRepository.save` contém placeholder para criação de usuário no Supabase (`newUserId = 'generated-uuid'`), ajuste conforme integração real.
- `connectToDatabase` usa SSL com `rejectUnauthorized: false`; revise para ambientes produtivos.
- O projeto assume tabelas do Supabase (`auth.users`) existentes e acessíveis.
