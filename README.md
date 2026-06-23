# Mood Tracker API

Backend da aplicação Mood Tracker, responsável pelo gerenciamento de usuários, autenticação, check-ins diários, humor, sono, medicações, rotinas e métricas para dashboard.

## Tecnologias

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt

## Funcionalidades

### Autenticação

- Registro de usuários
- Login com JWT
- Rotas protegidas por Guard
- Controle de sessão baseado em token

### Check-ins

Cada check-in diário pode conter:

- Registro de humor
- Registro de sono
- Medicações tomadas
- Rotinas concluídas

A API utiliza `upsert` para permitir atualização de um check-in existente para a mesma data.

### Humor

Campos disponíveis:

- score
- anxiety
- energy
- irritability
- notes

### Sono

Campos disponíveis:

- hours
- quality
- notes

### Medicações

- Cadastro de medicações
- Ativação e desativação
- Registro de tomada diária
- Histórico vinculado ao check-in

### Rotinas

- Cadastro de rotinas
- Ativação e desativação
- Registro de conclusão diária
- Histórico vinculado ao check-in

### Dashboard

Métricas agregadas por período:

- day
- week
- month
- all

Inclui:

- Média de humor
- Média de horas de sono
- Taxa de adesão às medicações
- Taxa de conclusão de rotinas
- Dados históricos para gráficos

---

## Estrutura do Projeto

```

src
│
├── auth
├── checkin
├── dashboard
├── medication
├── routine
├── prisma
│
├── app.module.ts
└── main.ts

```

---

## Instalação

```bash
npm install
```

## Variáveis de Ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/moodtracker"

JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

---

## Execução

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

---

## Banco de Dados

Gerar cliente Prisma:

```bash
npx prisma generate
```

Criar migration:

```bash
npx prisma migrate dev --name migration_name
```

Aplicar migrations:

```bash
npx prisma migrate deploy
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

---

## Principais Endpoints

### Auth

#### Registrar usuário

```http
POST /auth/register
```

#### Login

```http
POST /auth/login
```

---

### Check-in

#### Criar ou atualizar check-in

```http
POST /checkin
```

Exemplo:

```json
{
  "date": "2026-06-23",
  "mood": {
    "score": 8,
    "anxiety": 3,
    "energy": 7,
    "irritability": 2,
    "notes": "Dia produtivo"
  },
  "sleep": {
    "hours": 7.5,
    "quality": 8,
    "notes": "Dormi bem"
  },
  "medications": [],
  "routines": []
}
```

---

### Medications

#### Listar medicações

```http
GET /medication
```

#### Criar medicação

```http
POST /medication
```

---

### Routines

#### Listar rotinas

```http
GET /routine
```

#### Criar rotina

```http
POST /routine
```

---

### Dashboard

#### Obter métricas

```http
GET /dashboard?period=week
```

Parâmetros disponíveis:

```text
day
week
month
all
```

---

## Estrutura de Resposta do Dashboard

```json
{
  "today": {},
  "summary": {},
  "charts": {
    "moodLast7Days": [],
    "sleepLast7Days": []
  }
}
```

---

## Modelo de Dados

```

User
│
├── Checkins
│ ├── MoodEntry
│ ├── SleepEntry
│ ├── MedicationLogs
│ └── RoutineLogs
│
├── Medications
└── RoutineItems

```

---

## Desenvolvido por

**Carlos Teixeira**

Desenvolvedor Full Stack especializado em aplicações modernas utilizando Vue.js, NestJS, TypeScript e PostgreSQL.

### Contato

- Portfolio: https://seu-portfolio.com
- E-mail: teixeirahist1988@gmail.com

---

## Licença

MIT
