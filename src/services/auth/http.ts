import { API_URL } from "./config";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(status: number, fallback?: string) {
  if (status === 400) return fallback || "Dados invalidos.";
  if (status === 401) return "Credenciais invalidas.";
  if (status === 403) return "Voce nao tem permissao para realizar esta acao.";
  if (status === 409) return "Este usuario ja existe.";
  if (status >= 500) return "Erro interno da API. Tente novamente em instantes.";

  return fallback || "Nao foi possivel concluir a solicitacao.";
}

async function parseJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function readApiMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const data = payload as Record<string, unknown>;
  const message = data.message || data.error;

  return typeof message === "string" ? message : undefined;
}

export async function authHttp<T>(
  path: string,
  { body, headers, token, ...options }: RequestOptions = {},
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const payload = await parseJson(response);

    if (!response.ok) {
      throw new ApiError(
        getErrorMessage(response.status, readApiMessage(payload)),
        response.status,
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Falha de conexao com a API. Verifique se o backend esta online.",
      0,
    );
  }
}
