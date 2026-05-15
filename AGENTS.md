# Kindergarten Manager Pro

Next.js 16 monolithic app (frontend + API routes) with MongoDB and NextAuth.js v5 (Credentials provider).

## Cursor Cloud specific instructions

### Services

| Service | Command | Notes |
|---|---|---|
| MongoDB | `mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017` | Must be running before the Next.js dev server |
| Next.js dev server | `npm run dev` | Serves UI on port 3000 and all API routes |

### Environment variables

The app requires a `.env.local` file in the project root with:

```
MONGODB_URI=mongodb://127.0.0.1:27017/kindergarten
AUTH_SECRET=<any base64 string, e.g. output of `openssl rand -base64 33`>
AUTH_TRUST_HOST=true
```

`src/lib/db.js` reads `process.env.MONGODB_URI` with a fallback to a hardcoded Atlas URI. In cloud environments, always set `MONGODB_URI` to a local instance since the Atlas cluster is unreachable.

### Auth

Login credentials are hardcoded: username `admin`, password `admin123`. No external OAuth or SMTP needed.

### Common commands

- **Lint:** `npm run lint` (ESLint with next core-web-vitals config)
- **Build:** `npm run build`
- **Dev:** `npm run dev`

### Gotchas

- MongoDB must be started **before** `npm run dev`; API routes call `dbConnect()` on every request and will fail with connection errors if mongod is not running.
- The app uses `next-auth` v5 beta. `AUTH_SECRET` is mandatory — without it, all auth middleware calls throw at runtime.
- `AUTH_TRUST_HOST=true` is needed in non-Vercel environments to avoid host-check errors from NextAuth.
