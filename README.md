# 🔗 EncURLtador – API de Encurtamento de Links

API RESTful para encurtamento de URLs com autenticação JWT e controle de permissões. Usuários podem criar links curtos personalizados, visualizar estatísticas e, caso sejam administradores, acessar detalhes avançados e deletar URLs.

---

## 🧱 Stack Utilizada

- **NestJS** – Framework backend
- **Prisma ORM** – ORM para acesso ao banco de dados
- **JWT** – Autenticação baseada em tokens
- **bcrypt** – Hash de senhas
- **PostgreSQL** – Banco de dados relacional

---

## ⚙️ Funcionalidades

| Rota                         | Método | Autenticado | Papel | Descrição                                         |
|-----------------------------|--------|-------------|-------|---------------------------------------------------|
| `/auth/login`               | POST   | ❌          | -     | Autentica o usuário e retorna um token JWT        |
| `/users`                    | POST   | ❌          | -     | Criação de novo usuário                           |
| `/shortUrl`                 | POST   | ✅          | USER  | Cria nova URL encurtada                           |
| `/shortUrl/:alias`          | GET    | ✅          | USER  | Redireciona para a URL original                   |
| `/shortUrl/admin/:alias`    | GET    | ✅          | ADMIN | Retorna detalhes da URL encurtada                 |
| `/shortUrl/admin/:alias`    | DELETE | ❌          | ADMIN | Deleta uma URL encurtada                          |

---

## 🔐 Autenticação

Utilize o endpoint abaixo para realizar o login:

```
POST /auth/login
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Cabeçalho nas rotas protegidas:**
```
Authorization: Bearer <access_token>
```

---

## 📥 Criação de usuário

```
POST /users
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123",
  "firstName": "João",
  "lastName": "Silva"
}
```

---

## 🔗 Criar URL encurtada

```
POST /shortUrl
Authorization: Bearer <token>
```

**Body:**
```json
{
  "originalUrl": "https://www.exemplo.com/artigo",
  "alias": "meuartigo"
}
```

**Resposta:**
```json
{
  "id": "uuid",
  "originalUrl": "https://www.exemplo.com/artigo",
  "alias": "meuartigo",
  "visitCount": 0,
  "userId": "uuid"
}
```

---

## ↪️ Redirecionar URL

```
GET /shortUrl/:alias
Authorization: Bearer <token>
```

Redireciona o usuário para a URL original e incrementa o contador de visitas.

---

## 📊 Detalhes da URL (ADMIN)

```
GET /shortUrl/admin/:alias
Authorization: Bearer <token>
```

Retorna detalhes da URL encurtada. **Requer papel ADMIN.**

---

## 🗑️ Deletar URL (ADMIN)

```
DELETE /shortUrl/admin/:alias
```

Remove a URL encurtada do sistema. **Apenas administradores.**

---

## 👥 Permissões por papel

| Papel | Acesso                                                                 |
|-------|------------------------------------------------------------------------|
| USER  | Criar URLs, redirecionar e acessar seus próprios dados                 |
| ADMIN | Tudo acima + acessar detalhes e deletar URLs de qualquer usuário       |

---

## 🧠 Lógica Interna

### Login
- Valida o e-mail e senha
- Gera um JWT com `sub`, `email` e `role`

### Criação de URL
- Valida alias único
- Associa com o `userId`

### Redirecionamento
- Verifica o dono da URL
- Incrementa `visitCount`

### Detalhes e exclusão
- Acesso restrito para ADMIN

---

## 🧾 Modelos Prisma

### `User`
```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  firstName String
  lastName  String
  role      UserRole  @default(USER)
  createdAt DateTime  @default(now())
  links     ShortLink[]
}
```

### `ShortLink`
```prisma
model ShortLink {
  id          String   @id @default(uuid())
  originalUrl String   @db.Text
  alias       String   @unique
  createdAt   DateTime @default(now())
  expiresAt   DateTime?
  visitCount  Int      @default(0)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

### `UserRole`
```prisma
enum UserRole {
  ADMIN
  USER
}
```

---

## 🚀 Como rodar localmente

```bash
# Clonar o repositório
git clone https://github.com/jeannsf/urlShortener.git
cd nome-do-repo

# Instalar dependências
npm install

# Copiar env de exemplo
cp .env.example .env

# Rodar as migrations
npx prisma migrate dev

# Iniciar servidor
npm run start:dev
```

---

## 📂 Estrutura de Diretórios

```
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   ├── jwt.strategy.ts
│   ├── dto/
│   │   └── login.dto.ts
│
├── users/
│   ├── users.controller.ts
│   ├── users.controller.spec.ts
│   ├── users.service.spec.ts
│   ├── users.module.ts
│   ├── users.repository.ts
│   ├── users.service.ts
│   ├── dto/
│   │   └── create-user.dto.ts
│
├── short-url/
│   ├── short-url.controller.ts
│   ├── short-url.repository.ts
│   ├── short-url.service.ts
│   ├── short-url.controller.spec.ts
│   ├── short-url.service.spec.ts
│   ├── dto/
│   │   ├── create-short-url.dto.ts
│   │   └── update-short-url.dto.ts
```
