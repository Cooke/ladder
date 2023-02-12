# Welcome to the ladder!

## Deployment

Automatic with Vercel

## Development

Currently for development a couple of external dependencies needs to be setup via environment variables:

- DATABASE_URL - A postgres DB
- GOOGLE_CLIENT_ID: Google OAuth client id
- GOOGLE_CLIENT_SECRET: Google OAuth secret
- SESSION_SECRET: random characters

```sh
npm install
npm run dev
```
