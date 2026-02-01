# Task: Add Cloudflare Worker Backend (OpenAI + Alchemy)

Create a new Cloudflare Worker backend that integrates OpenAI and Alchemy while leaving the existing GitHub Pages + Vite frontend untouched. Do **not** modify or delete any existing files; only add new files and folders.

## Goals
- Stand up a Cloudflare Worker that exposes API endpoints for:
  - OpenAI-powered text generation (or chat completions).
  - Alchemy-powered blockchain data retrieval.
- Keep secrets out of the repo and use environment bindings instead.
- Provide local development and deployment instructions.

## Constraints
- **Do not edit or delete any existing files.**
- Only add new files/folders needed for the Worker.
- Keep the frontend build/deploy workflow unchanged.

## Proposed Structure (new files only)
```
workers/
  openai-alchemy-worker/
    src/
      index.ts
    wrangler.toml
    package.json
    tsconfig.json
    README.md
```

## Functional Requirements
1. **Worker routes**
   - `POST /api/openai`
     - Accepts JSON with user prompt data.
     - Calls OpenAI API and returns response JSON.
   - `GET /api/alchemy` (or `POST /api/alchemy`)
     - Accepts chain + query params (e.g., address, network).
     - Calls Alchemy API and returns response JSON.

2. **Environment bindings**
   - `OPENAI_API_KEY`
   - `ALCHEMY_API_KEY`
   - Optional: `OPENAI_MODEL` default (e.g., `gpt-4o-mini`).

3. **Error handling & CORS**
   - Return meaningful error responses (status + message).
   - Allow CORS from the GitHub Pages origin (or `*` during development).

4. **Local dev & deploy**
   - Provide `wrangler dev` and `wrangler deploy` instructions.
   - Include an example `.dev.vars` (or mention how to set secrets).

## Implementation Notes
- Use Cloudflare Workers (module worker syntax).
- Use the OpenAI REST API via `fetch`.
- Use the Alchemy REST API via `fetch`.
- Avoid bundling server-only dependencies not supported on Workers.

## Acceptance Criteria
- Worker builds and runs locally with `wrangler dev`.
- `POST /api/openai` returns a valid OpenAI response when provided with a prompt.
- `GET/POST /api/alchemy` returns valid Alchemy data for a provided query.
- Secrets are configured via Wrangler and not committed to git.
- No changes to existing project files.
