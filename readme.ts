export const README = `
# 📘 TaskFlow Backend (Project Management API)

## 🚀 Overview

TaskFlow Backend is a Node.js REST API for managing projects, team members, and tasks with role-based access control (RBAC).

It is inspired by tools like Jira, Notion, and Asana.

## ✨ Features

- JWT-based authentication
- Project management
- Project member management
- RBAC with OWNER, ADMIN, MEMBER
- Task creation and management
- Pagination and search
- Layered architecture (Controller -> Service -> Prisma -> Database)

## 🏗️ Architecture

Request -> Controller -> Service -> Prisma -> Database

### 🧠 Layer Responsibilities

- Controller: handles request and response
- Service: business logic
- Prisma: ORM and DB communication
- Database: data storage

### ✅ Example Flow

\`POST /projects\` -> controller -> service -> prisma -> database

## 📁 Folder Structure

\`\`\`
src/
├── modules/
│   ├── auth/
│   ├── project/
│   └── task/
├── config/
│   └── prisma.ts
├── middlewares/
│   └── auth.middleware.ts
├── utils/
│   ├── ApiError.ts
│   ├── ApiResponse.ts
│   └── catchAsync.ts
├── app.ts
└── server.ts
\`\`\`

## 📦 Libraries Used

- express: web framework
- prisma: ORM
- @prisma/client: Prisma DB client
- jsonwebtoken: auth tokens
- bcrypt: password hashing
- cors: cross-origin support
- dotenv: environment variables

## ⚙️ Setup

### 🗄️ Database

1. Install and run PostgreSQL

2. Create database:
\`\`\`sql
CREATE DATABASE taskflow_db;
\`\`\`

3. Add in \`.env\`:
\`\`\`
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskflow_db"
\`\`\`

### 🧬 Prisma

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

## 🔁 Prisma Workflow Rule

Whenever schema changes:

1. Run migration
2. Generate Prisma client
3. Restart server

\`\`\`bash
npx prisma migrate dev --name <change_name>
npx prisma generate
\`\`\`

If you skip generation, you may see errors like:

\`Property 'projectMember' does not exist\`

## 🧪 Run Project

\`\`\`bash
npm install
npm run dev
npx prisma studio
\`\`\`

## 🔐 RBAC

Roles:

- OWNER
- ADMIN
- MEMBER

Sample rules:

- Add member: OWNER only
- Update project: OWNER and ADMIN
- Delete project: OWNER only
- Create task: any member
- Update task: creator or admin

## 📌 Sample APIs

- Create project: \`POST /api/v1/projects\`
- Add member: \`POST /api/v1/projects/:id/members\`
- Create task: \`POST /api/v1/projects/:projectId/tasks\`

### Example add member payload

\`\`\`json
{
  "userId": "user-uuid",
  "role": "MEMBER"
}
\`\`\`
`;