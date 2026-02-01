# OpenAI + Alchemy Cloudflare Worker

This worker exposes two endpoints:

- `POST /api/openai` — forwards chat completions to OpenAI.
- `GET|POST /api/alchemy` — forwards JSON-RPC calls to Alchemy.

## Environment variables

Set secrets with Wrangler (do **not** commit them):

```bash
wrangler secret put OPENAI_API_KEY
wrangler secret put ALCHEMY_API_KEY
```

Optional vars:

```bash
wrangler secret put OPENAI_MODEL
wrangler secret put CORS_ORIGIN
```

## Local development

```bash
npm install
npm run dev
```

Create a `.dev.vars` file for local development (not committed):

```bash
OPENAI_API_KEY=your_openai_key
ALCHEMY_API_KEY=your_alchemy_key
OPENAI_MODEL=gpt-4o-mini
CORS_ORIGIN=http://localhost:5173
```

## Deploy

```bash
npm run deploy
```

## API usage

### OpenAI

```bash
curl -X POST https://<your-worker-url>/api/openai \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Say hello"}'
```

### Alchemy

```bash
curl -X POST https://<your-worker-url>/api/alchemy \
  -H "Content-Type: application/json" \
  -d '{"network":"eth-mainnet","method":"eth_blockNumber","params":[]}'
```
