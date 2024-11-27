# pwa-kit-vite-minimal

POC of using Vite for building (minimal) https://github.com/SalesforceCommerceCloud/pwa-kit applications and replacing
the webpack dev server with a vite based one.

- faster HMR
- vite toolchain
- speedy builds
- typescript
- no commerce code (just minimal react app)

## Dev

```bash
npm start
open http://localhost:5173/
```

- Express routes in `ssr.js`
- Server render entry point in `src/entry-server.tsx`

## Building

```bash
npm install
npm run build
npm run push -- -s project -t environment
```

## TODO

- [ ] PWA style config import
- [ ] http-proxy's from config
- [ ] Add push command
- [ ] Add helmet
- [ ] static file serving of root assets (worker/favicon) - right now the main handler serves these as the rendered app html