
# 🔗 EncURLtador – Link Shortening API

RESTful API for URL shortening with JWT authentication and role-based access control. Users can create custom short links, view statistics, and, if they are administrators, access advanced details and delete URLs.

---

## 🧱 Tech Stack

- **NestJS** – Backend framework  
- **Prisma ORM** – Database ORM  
- **JWT** – Token-based authentication  
- **bcrypt** – Password hashing  
- **PostgreSQL** – Relational database

---

## ⚙️ Features

| Route                        | Method | Authenticated | Role  | Description                                         |
|-----------------------------|--------|----------------|--------|-----------------------------------------------------|
| `/auth/login`               | POST   | ❌             | -      | Authenticates user and returns a JWT token          |
| `/users`                    | POST   | ❌             | -      | Creates a new user                                  |
| `/shortUrl`                 | POST   | ✅             | USER   | Creates a new shortened URL                         |
| `/shortUrl/:alias`          | GET    | ✅             | USER   | Redirects to the original URL                       |
| `/shortUrl/admin/:alias`    | GET    | ✅             | ADMIN  | Returns details of the shortened URL                |
| `/shortUrl/admin/:alias`    | DELETE | ❌             | ADMIN  | Deletes a shortened URL                             |

---

## 🔐 Authentication

Use the following endpoint to log in:

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Header for protected routes:**
```
Authorization: Bearer <access_token>
```

---

## 📥 Create User

```
POST /users
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

---

## 🔗 Create Short URL

```
POST /shortUrl
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "originalUrl": "https://www.example.com/article",
  "alias": "myarticle"
}
```

**Response:**
```json
{
  "id": "uuid",
  "originalUrl": "https://www.example.com/article",
  "alias": "myarticle",
  "visitCount": 0,
  "userId": "uuid"
}
```

---

## ↪️ Redirect to Original URL

```
GET /shortUrl/:alias
Authorization: Bearer <token>
```

Redirects the user to the original URL and increments the visit count.

---

## 📊 URL Details (ADMIN)

```
GET /shortUrl/admin/:alias
Authorization: Bearer <token>
```

Returns details of the shortened URL. **ADMIN role required.**

---

## 🗑️ Delete URL (ADMIN)

```
DELETE /shortUrl/admin/:alias
```

Removes the shortened URL from the system. **Admins only.**

---

## 👥 Role Permissions

| Role  | Access                                                                 |
|-------|------------------------------------------------------------------------|
| USER  | Create URLs, redirect and access their own data                        |
| ADMIN | Everything above + access details and delete URLs of any user          |

---

## 🧠 Internal Logic

### Login
- Validates email and password
- Generates JWT with `sub`, `email`, and `role`

### URL Creation
- Validates unique alias
- Associates with `userId`

### Redirection
- Validates link ownership
- Increments `visitCount`

### Details & Deletion
- Restricted to ADMIN users

---

## 🧾 Prisma Models

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

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/jeannsf/urlShortener.git
cd repo-name

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

---

## 📂 Project Structure

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
