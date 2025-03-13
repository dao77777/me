# Test

## Todo

- [ ] when add `middleware.ts` with `export { auth as middleware } from "@/auth`, next will thorw error `not found property 'exec'`
 
## Tips

turn off vpn before nextjs load google font, otherwise would throw error 

## Base

`docker-compose.yaml`
```yaml
version: '3.9'

services:
  postgres:
    image: postgres:latest  # 使用轻量级 Alpine 版本
    container_name: postgres
    environment:
      - POSTGRES_DB=my-app      # 默认数据库名称
      - POSTGRES_USER=dao77777        # 数据库用户名
      - POSTGRES_PASSWORD=root  # 数据库密码
      - POSTGRES_HOST_AUTH_METHOD=md5  # 启用密码认证（默认是trust，生产环境建议修改）
    volumes:
      - postgres_data:/var/lib/postgresql/data  # 数据持久化
    ports:
      - "5432:5432"  # 主机端口:容器端口
    networks:
      - postgres_net
    restart: unless-stopped  # 容器意外停止时自动重启

volumes:
  postgres_data:  # 定义持久化数据卷

networks:
  postgres_net:  # 定义专用网络
    driver: bridge
```

**common file**
- `.git(dir)`
- `.gitignore`
- `node_modules(dir)`
- `__test__(dir)`
- `.env`
- `.env.local`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `tsconfig.json`
- `package.json`
- `pnpm-lock.yaml`
- `README.md`

**Env**
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_<PROVIDER>_ID`
- `AUTH_<PROVIDER>_SECRET`
- `<AI_PROVIDER>_API_KEY`

## Package

**next**
- install
```bash
pnpm create next-app@latest
```
- package
    - runtime
        - `next`,
        - `react`
        - `react-dom`
    - dev
        - base
            - `typescript`
            - `@types/node`
            - `@tpyes/react`
            - `@tpyes/react-dom`
        - tailwind
            - `@tailwindcss/postcss`
            - `tailwindcss`
        - eslint
            - `eslint`
            - `eslint-config-next`
            - `@eslint/eslintrc`
- file
    - `app`
    - `public`
    - `middleware.ts`
    ```typescript
    export { auth as middleware } from "@/auth"
    ```
    - `.next`: build directory
    - `next-env.d.ts`: type declaration
    - `next.config.ts`
    ```typescript
    import type { NextConfig } from "next";

    const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
            pathname: '**',
        },
        ],
    },
    };

    export default nextConfig;
    ```
- command
    - `next dev --turbopack`
    - `next build`
    - `next start`
    - `next lint`

**test**
- install
```bash
pnpm add -D \
@testing-library/react \
@testing-library/dom \
@testing-library/jest-dom \
jest \
jest-environment-jsdom \
@types/jest \
ts-jest \
ts-node
```
- package(dev only)
    - `@testing-library/react`
    - `@testing-library/dom`
    - `@testing-library/jest-dom`
    - `jest`
    - `jest-environment-jsdom`
    - `@types/jest`
    - `ts-jest`
    - `ts-node`
- file
    - `jest.config.ts`
    ```typescript
    import type {Config} from 'jest';

    const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    };

    export default config;
    ```
- commnad
    - `jest [<name>]`

**dotenv(install for testing purpose)**
- install
```bash
pnpm add dotenv
```

**shadcn**
- install
```bash
pnpm dlx shadcn@latest init
```
- package(runtime only)
    - `@radix-ui/react-slot`
    - `class-variance-authority`
    - `clsx`
    - `lucide-react`
    - `tailwind-merge`
    - `tailwindcss-animate`
- file
    - `components(dir)`
    - `lib(dir)`
    - `components.json`
- command
    - `pnpm dlx shadcn@latest add <component>`

**auth**
- install
```bash
pnpm add \
next-auth@beta \
@auth/prisma-adapter \
```
- package
    - `next-auth`
    - `@auth/prisma-adapter`
- file
    - `auth.ts`
- command
    - `auth secret`: generate `AUTH_SECRET` environment variable

**prisma**
- install
```bash
pnpm add \
@prisma/client \
prisma
```
- package
    - runtime
        - `@prisma/client`
    - dev
        - `prisma`
- file
    - `prisma(dir)`
    - `prisma/schema.prisma`
    ```prisma
    datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
    }

    generator client {
        provider = "prisma-client-js"
    }

    model User {
        id            String          @id @default(cuid())
        name          String?
        email         String          @unique
        emailVerified DateTime?
        image         String?
        accounts      Account[]
        sessions      Session[]
        // Optional for WebAuthn support
        Authenticator Authenticator[]

        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt
    }

    model Account {
        userId            String
        type              String
        provider          String
        providerAccountId String
        refresh_token     String?
        access_token      String?
        expires_at        Int?
        token_type        String?
        scope             String?
        id_token          String?
        session_state     String?

        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt

        user User @relation(fields: [userId], references: [id], onDelete: Cascade)

        @@id([provider, providerAccountId])
    }

    model Session {
        sessionToken String   @unique
        userId       String
        expires      DateTime
        user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt
    }

    model VerificationToken {
        identifier String
        token      String
        expires    DateTime

        @@id([identifier, token])
    }

    // Optional for WebAuthn support
    model Authenticator {
        credentialID         String  @unique
        userId               String
        providerAccountId    String
        credentialPublicKey  String
        counter              Int
        credentialDeviceType String
        credentialBackedUp   Boolean
        transports           String?

        user User @relation(fields: [userId], references: [id], onDelete: Cascade)

        @@id([userId, credentialID])
    }
    ```
    - `prisma/migrations(dir)`
    - `prisma.ts`
- command
    - `prisma migrate dev [--name <name>]`: push db & generate client
    - `prisma generate`
    - `prisma push db`
    - `prisma studio`: start up a studio could be accessed by port 5555

**openai**
- install
```bash
pnpm add \
openai
```