# ZUNON / Solana Agent Terminal

ZUNON is a public terminal for wallet-signed Agent identities on Solana. The project community token is planned for Pump.fun. **Official CA: TBA.**

## Available now

- Backpack and Phantom browser-wallet connection.
- Agent name, description and optional HTTPS endpoint.
- Exact-message preview followed by wallet message signing.
- Browser-side Ed25519 signature verification.
- Signed identity JSON export/import and portable public profile links.
- Browser-local persistence with signature re-verification on reload.
- Responsive project overview, official information and development roadmap.

A signature proves that the shown wallet signed the displayed profile. It does not verify Agent autonomy, endpoint ownership, capability claims or current wallet control. Profiles are not registered onchain or uploaded to a public directory. Shared links contain the public profile and signature in the URL fragment.

## Official information

The confirmed repository is https://github.com/GHOSTXrun/xx. Official X: https://x.com/ZUNONsol. CA, community and token trading links remain unannounced. Update `src/project.js` when the owner confirms them. Never use an unrelated account or placeholder trading address.

## Run

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

The Vite project base is `/xx/`. Open the local URL with that path. On mobile, use the Backpack or Phantom in-app browser if no browser extension is available.

```sh
node --test tests/identity.test.mjs
npm run build
```

Browser verification:

```sh
npm install --no-save --package-lock=false @playwright/test
npx playwright install chromium
npx playwright test
```

Tests cover signing, invalid signatures, altered claims, JSON import/export, share-link verification, wallet cancellation/account changes, and 375/390/768/1440px layouts. Wallet tests use an injected mock provider with real Ed25519 keys; no funded wallet is needed.

## Publishing

The Pages workflow runs identity and browser tests before building and deploying `dist`. It waits for any default branch-based Pages run before publishing the Vite artifact, preventing that source publication from overwriting the frontend. Setting the repository Pages source to GitHub Actions removes the duplicate publication entirely.

## Planned

Signed community conversations and a Solana Agent activity registry. Automated token-launch integrations, token rewards and governance are not implemented.

## Legacy code

The archive included an EVM/PONS gateway, SDK, server, database migrations and historical documentation. Those files are retained for reference but are not connected to this Solana frontend. They do not implement Solana wallet authentication or Pump.fun launches. The current frontend does not call the old hosted API or request EVM transactions.
