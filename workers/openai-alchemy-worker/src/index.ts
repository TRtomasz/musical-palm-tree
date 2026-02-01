type Env = {
  OPENAI_API_KEY: string;
  ALCHEMY_API_KEY: string;
  OPENAI_MODEL?: string;
  CORS_ORIGIN?: string;
};

type OpenAIRequest = {
  prompt?: string;
  messages?: Array<{ role: string; content: string }>;
  temperature?: number;
};

type AlchemyRequest = {
  network?: string;
  method?: string;
  params?: unknown[];
};

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_RPC_METHOD = "eth_blockNumber";

function jsonResponse(body: unknown, status = 200, origin = "*") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  });
}

function getCorsOrigin(request: Request, env: Env) {
  if (env.CORS_ORIGIN) {
    return env.CORS_ORIGIN;
  }
  return request.headers.get("Origin") ?? "*";
}

async function handleOpenAI(request: Request, env: Env) {
  if (!env.OPENAI_API_KEY) {
    return jsonResponse({ error: "Missing OPENAI_API_KEY" }, 500);
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const body = (await request.json().catch(() => null)) as OpenAIRequest | null;
  if (!body) {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const messages = body.messages ?? (body.prompt ? [{ role: "user", content: body.prompt }] : null);
  if (!messages) {
    return jsonResponse({ error: "Provide prompt or messages" }, 400);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL ?? DEFAULT_MODEL,
      messages,
      temperature: body.temperature ?? 0.7,
    }),
  });

  const data = await response.json().catch(() => ({ error: "Invalid OpenAI response" }));
  if (!response.ok) {
    return jsonResponse({ error: "OpenAI request failed", details: data }, response.status);
  }

  return jsonResponse(data, 200);
}

async function handleAlchemy(request: Request, env: Env) {
  if (!env.ALCHEMY_API_KEY) {
    return jsonResponse({ error: "Missing ALCHEMY_API_KEY" }, 500);
  }

  if (request.method !== "GET" && request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let payload: AlchemyRequest = {};
  if (request.method === "GET") {
    const url = new URL(request.url);
    const rawParams = url.searchParams.get("params");
    let parsedParams: unknown[] | undefined;
    if (rawParams) {
      try {
        parsedParams = JSON.parse(rawParams) as unknown[];
      } catch {
        return jsonResponse({ error: "Invalid params JSON" }, 400);
      }
    }
    payload = {
      network: url.searchParams.get("network") ?? undefined,
      method: url.searchParams.get("method") ?? undefined,
      params: parsedParams,
    };
  } else {
    payload = (await request.json().catch(() => ({}))) as AlchemyRequest;
  }

  const network = payload.network ?? "eth-mainnet";
  const method = payload.method ?? DEFAULT_RPC_METHOD;
  const params = payload.params ?? [];

  const endpoint = `https://${network}.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method,
      params,
    }),
  });

  const data = await response.json().catch(() => ({ error: "Invalid Alchemy response" }));
  if (!response.ok) {
    return jsonResponse({ error: "Alchemy request failed", details: data }, response.status);
  }

  return jsonResponse(data, 200);
}

export default {
  async fetch(request: Request, env: Env) {
    const corsOrigin = getCorsOrigin(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      });
    }

    const url = new URL(request.url);
    if (url.pathname === "/api/openai") {
      const response = await handleOpenAI(request, env);
      response.headers.set("Access-Control-Allow-Origin", corsOrigin);
      return response;
    }

    if (url.pathname === "/api/alchemy") {
      const response = await handleAlchemy(request, env);
      response.headers.set("Access-Control-Allow-Origin", corsOrigin);
      return response;
    }

    return jsonResponse({ error: "Not found" }, 404, corsOrigin);
  },
};
