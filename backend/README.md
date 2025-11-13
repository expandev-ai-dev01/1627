# TODO List - Backend API

Sistema de gerenciamento de tarefas - API REST

## Tecnologias

- Node.js
- TypeScript
- Express.js
- MS SQL Server
- Zod (validação)

## Estrutura do Projeto

```
src/
├── api/              # Controladores de API
├── routes/           # Definições de rotas
├── middleware/       # Middlewares Express
├── services/         # Lógica de negócio
├── utils/            # Funções utilitárias
├── constants/        # Constantes da aplicação
├── instances/        # Instâncias de serviços
├── config/           # Configurações
└── server.ts         # Ponto de entrada
```

## Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar variáveis de ambiente no arquivo .env
```

## Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run dev
```

## Build e Produção

```bash
# Build do projeto
npm run build

# Executar em produção
npm start
```

## Estrutura de API

### Endpoints Externos (Públicos)
```
POST /api/v1/external/...
```

### Endpoints Internos (Autenticados)
```
GET    /api/v1/internal/...
POST   /api/v1/internal/...
PUT    /api/v1/internal/...
DELETE /api/v1/internal/...
```

## Health Check

```
GET /health
```

Retorna o status da aplicação e timestamp.

## Variáveis de Ambiente

Ver arquivo `.env.example` para lista completa de variáveis necessárias.

## Padrões de Código

- TypeScript strict mode
- Path aliases com @/
- Documentação TSDoc
- Validação com Zod
- Tratamento de erros padronizado
- Multi-tenancy por idAccount

## Licença

ISC