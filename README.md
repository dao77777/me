# Test

## Todo

- [ ] when add `middleware.ts` with `export { auth as middleware } from "@/auth`, next will thorw error `not found property 'exec'`
- [ ] email authentication support
- [ ] markdown
  - [ ] MarkDoc
 
## Tips

turn off vpn before nextjs load google font, otherwise would throw error 

## Base

### Docker

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

### Common File

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

### Environment

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_<OAUTH_PROVIDER>_ID`
- `AUTH_<OAUTH_PROVIDER>_SECRET`
- `AUTH_<EMAIL_PROVIDER>_KEY`
- `<AI_PROVIDER>_API_KEY`

## Package

### Next
- install: `pnpm create next-app@latest`
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

### Env

Other tools
- dotenv
- crossenv

- install: `pnpm add @next/env`
- edit: `@/envConfig.ts` file
  ```ts
  import { loadEnvConfig } from '@next/env'
 
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
  ```
- usage: add the code `import { loadEnvConfig } from "@next/env"` at the begining of target file

### Tailwind

**Scrollbar**
- install: `pnpm add -D tailwind-scrollbar`
- edit `global.css` file
  ```css
  @import 'tailwindcss';

  /* ... */
  
  @plugin 'tailwind-scrollbar' {
    nocompatible: true;
    preferredStrategy: 'pseudoelements';
  }

  @layer components {
    .scroll-custom {
      @apply 
      scrollbar
      scrollbar-thumb-rounded-full
      scrollbar-track-rounded-full
      scrollbar-w-0.5
      sm:scrollbar-w-1
      scrollbar-thumb-stone-400
      scrollbar-hover:scrollbar-thumb-stone-500
      scrollbar-track-stone-300/0
      scrollbar-track-hover:scrollbar-track-stone-300
      scrollbar-active:scrollbar-thumb-stone-600;
    }
  }
  ```
- utilities
    - begin with: `scrollbar` & `scrollbar-thin`
    - for thumb: `scrollbar-thumb-<color>` & `scrollbar-thumb-rounded-*` & `scrollbar-w-*`
    - for track: `scrollbar-track-<color>` & `scrollbar-track-rounded-*`
    - for corner: `scrollbar-corner-<color>`
- variants
    - for thumb: `scrollbar-hover:` & `scrollbar-active`
    - for track: `scrollbar-track-hover:` & `scrollbar-track-active:`
    - for corner: `scrollbar-corner-hover:` & `scrollbar-corner-active:`

### Test

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

### Dotenv(install for testing purpose)

- install: `pnpm add dotenv`

### Shadcn

- install: `pnpm dlx shadcn@latest init`
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

### Auth

- install

  ```bash
  pnpm add \
  next-auth@beta \
  @auth/drizzle-adapter \
  ```
- package
    - `next-auth`
    - `@auth/prisma-adapter`
- file
    - `auth.ts`
- command
    - `auth secret`: generate `AUTH_SECRET` environment variable

### openai
- install: `pnpm add openai`

### Markdown

- install

  for next

  ```bash
  pnpm add \
  @next/mdx \ 
  @mdx-js/loader \
  @mdx-js/react \
  @types/mdx \
  unified \
  remark-html \
  remark-parse
  ``` 

  for style

  `pnpm add @tailwindcss/typography`
- edit `next.config.ts`
  ```typescript
  const nextConfig: NextConfig = {
    /* ... */
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    // experimental: {
    //   mdxRs: {
    //     jsxRuntime: string            // Custom jsx runtime
    //     jsxImportSource?: string       // Custom jsx import source,
    //     mdxType?: 'gfm' | 'commonmark' // Configure what kind of mdx syntax will be used to parse & transform
    //   },
    // },
  };  

  const withMDX = createMDX({
    // Add markdown plugins here, as desired
    /* .... */
  })  

  export default withMDX(nextConfig);
  ```
- add `mdx-components.tsx`
  ```tsx
  import type { MDXComponents } from 'mdx/types'
  import Image, { ImageProps } from 'next/image'
   
  export function useMDXComponents(components: MDXComponents):   MDXComponents {
    return {
      // Allows customizing built-in components, e.g. to add styling.
      // h1: ({ children }) => (
      //   <h1 style={{ color: 'red', fontSize: '48px' }}>{children}  </h1>
      // ),
      // img: (props) => (
      //   <Image
      //     sizes="100vw"
      //     style={{ width: '100%', height: 'auto' }}
      //     {...(props as ImageProps)}
      //   />
      // ),
      ...components,
    }
  }
  ```
- add `@/app/wiki/[slug]/layout.tsx`
  ```tsx
  export default function MdxLayout({ children }: { children: React.ReactNode }) {
      // Create any shared layout or styles here
      return (
          <div className="
              wrapper 
              w-full 
              h-full 
              overflow-auto
              scroll-custom
          ">
              <article className="prose prose-sm sm:prose-base   lg:prose-lg xl:prose-xl m-auto">
                  {children}
              </article>
          </div>
      )
  }
  ```
- add `@/app/wiki/[slug]/page.tsx`

  ```tsx
  import { articles } from '@/wiki/utils';
  
  export default async function Page({
      params,
  }: {
      params: Promise<{ slug: string }>
  }) {
      const { slug } = await params;
      const { default: Post } = await import(`@/wiki/article/${slug}.  mdx`);
  
      return <Post />
  }
  
  export function generateStaticParams() {
      const slugs = articles
          .map(name => ({ slug: name.replace(/\.mdx?$/, '') }));
      return slugs;
  }
  
  export const dynamicParams = true
  ```
- add `@/wiki/article(dir)`: store `mdx` file
- add `@/wiki/utils.ts`: utils for reading article file's name and article file's directory

- style: `@tailwindcss/typography`
- code highlight: ?
- ast parse: ?

gemoji

- unified, unist-util-visit, mdast-util-find-and-replace, has-utils-to-string
- remark, remark-parse, remark-stringify, remark-toc, remark-gfm, remark-directive, remark-lint
- rehype, rehype-parse, rehype-stirngify, rehype-slug, rehype-document, rehype-preset-minify, rehype-minify-whitespace, rehype-starry-night
- retext, retext-indefinite-article, retext-equality, retext-repeated-words, retext-spell
- remark-rehype, remark-retext, rehype-remark, retext-english, rehype-react
- to-vfile, vfile-reporter

markd: simply transform markdown to html

mdx-js

- [MarkDoc](https://markdoc.dev/)
- [MDX](https://mdxjs.com/)
- [remark](https://github.com/remarkjs/remark)
- [rehype](https://github.com/rehypejs/rehype)


jsx | ts -> js

minify & format

module mode transform & ecmascript version transform & polyfill transform

js module -> source map

type checking & lint checking

### Drizzle

- install
```bash
pnpm add \
drizzle-orm \
drizzle-zod \
zod
pg
```
```bash
pnpm add -D \
drizzle-kit \
@types/pg
```
- file
  - `@/lib/db/schema.ts`: schema
  - `@/lib/db/index.ts`: export configured db
  - `@/lib/db/migrations(dir)`: migrations
  - `@/drizzle.config.ts`: used by `drizzle-kit`
- command
  - `drizzle-kit push`: no migration, push directly
  - `dirzzle-kit generate`: generte migration files
  - `drizzle-kit migrate`: migrate
  - `drizzle-kit studio`: studio

### AI

install: `ai`, `@ai-sdk/openai-compatible`, `@ai-sdk`
```bash
pnpm add ai @ai-sdk/openai-compatible @ai-sdk/react @ai-sdk/provider @ai-sdk/provider-utils
```

### TRPC

`pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query zod @tanstack/react-query`

### SuperJson

`pnpm add superjson`