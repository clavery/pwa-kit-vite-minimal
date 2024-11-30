# pwa-kit-vite-minimal

POC of using Vite for building (minimal) https://github.com/SalesforceCommerceCloud/pwa-kit applications and replacing
the webpack dev server with a vite based one.

- fast HMR
- SSR
- vite toolchain
- speedy build
- typescript
- tailwind / shadcn UI
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
npx @salesforce/pwa-kit-dev push -s project -t environment
```

## TODO

- [ ] PWA style config import
- [ ] react query SSR example (react-router loader)
- [ ] http-proxy's from config
- [ ] Call something via proxy (i.e. custom API, httpbin, etc)
- [ ] source map wonkiness after adding RR

## Support / License

**This project should not be treated as Salesforce Product.** It is an example implementation.
Customers and partners use this at-will with no expectation of roadmap, technical support,
defect resolution, production-style SLAs.

This project is maintained by the **Salesforce Community**. Salesforce Commerce Cloud or Salesforce Platform Technical
Support do not support this project or its setup.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
