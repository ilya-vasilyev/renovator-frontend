# Renovator (Nuxt frontend)

![image](https://github.com/user-attachments/assets/de1ee0ad-031e-46a4-82ed-652a7bc61a79)

An open-source web configurator tool for renovation projects.
Developed by Estonian Academy of Arts (EKA).

Consists of two parts:

- **Frontend** _(this repository)_
- [Backend](https://github.com/ilya-vasilyev/renovator-backend) 

### Tech stack

- Nuxt
- Tailwind
- Nuxt UI
- Sketchfab API

---

## Deploy

Deploy and run this project in production you can use static hosting platforms.

Netlify:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ilya-vasilyev/renovator-frontend)

Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Filya-vasilyev%2Frenovator-frontend)

Or deploy a full stack (frontend + backend) on Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/mNpqga)

If you want to deploy it on your own hosting, build it as a simple static website (Nuxt in SPA mode) using `npm run build` and host the `dist` directory.

### ⚠️ Environment variables

This project needs the following environment variables to run properly:

- **`NUXT_PUBLIC_STRAPI_URL`** - a backend URL in the format `https://<YOUR_BACKEN_URL>`

# For developers

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

...
