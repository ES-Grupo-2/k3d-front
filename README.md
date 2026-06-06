# k3d-front

K3D Frontend Application built with Next.js, React, TypeScript, and Tailwind CSS.

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Linting**: [ESLint](https://eslint.org) + [Prettier](https://prettier.io)

## Configuração do ambiente de desenvolvimento

### Backend

Clone o repositório do backend e, dentro da pasta, instale as dependências e suba o servidor:

```bash
npm install
npm run dev
```

> O backend sobe na porta `3000` por padrão. Antes de subir, configure o `.env` com as credenciais do banco remoto — peça para alguém do time.

### Frontend

**Modo dev:**
```bash
npm install
npm run dev -- --port 3001
```

**Via build (recomendado):**
```bash
npm install
npm run build
npm run start -- --port 3001
```

> A porta `3001` evita conflito com o backend.
