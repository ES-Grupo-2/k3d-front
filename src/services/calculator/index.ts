import type {
  CalculatorParameters,
  CalculatorParametersFormData,
  CalculatorResult,
  CalculatorSimulationFormData,
} from "@/schemas/calculator";
import { authHttp } from "@/services/auth/http";

type ApiObject = Record<string, unknown>;

function asObject(value: unknown): ApiObject {
  return value && typeof value === "object" ? (value as ApiObject) : {};
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeParameters(payload: unknown): CalculatorParameters {
  const root = asObject(payload);
  const data = asObject(root.data || root);

  return {
    id: readNumber(data.id),
    filament_price: readNumber(data.filament_price),
    kw_cost: readNumber(data.kw_cost),
    depreciation: readNumber(data.depreciation),
    profit_margin: readNumber(data.profit_margin),
    updated_at: readString(data.updated_at),
  };
}

function normalizeResult(payload: unknown): CalculatorResult {
  const root = asObject(payload);
  const inputs = asObject(root.inputs);
  const breakdown = asObject(root.breakdown);

  return {
    inputs: {
      filament_weight_grams: readNumber(inputs.filament_weight_grams),
      kwh_used: readNumber(inputs.kwh_used),
    },
    breakdown: {
      filamentCost: readNumber(breakdown.filamentCost),
      energyCost: readNumber(breakdown.energyCost),
      depreciationCost: readNumber(breakdown.depreciationCost),
    },
    custoTotal: readNumber(root.custoTotal),
    precoSugerido: readNumber(root.precoSugerido),
  };
}

export async function getCalculatorParametersRequest(
  token: string,
): Promise<CalculatorParameters> {
  const payload = await authHttp<unknown>("/calculator/parameters", {
    method: "GET",
    token,
  });

  return normalizeParameters(payload);
}

export async function saveCalculatorParametersRequest(
  data: CalculatorParametersFormData,
  token: string,
): Promise<{ message: string; data: CalculatorParameters }> {
  const payload = await authHttp<unknown>("/calculator/parameters", {
    method: "POST",
    token,
    body: data,
  });
  const root = asObject(payload);

  return {
    message:
      readString(root.message) ||
      "Parametros configurados e salvos com sucesso!",
    data: normalizeParameters(root.data || root),
  };
}

export async function calculatePrintRequest(
  data: CalculatorSimulationFormData,
  token: string,
): Promise<CalculatorResult> {
  const payload = await authHttp<unknown>("/calculator/calculate", {
    method: "POST",
    token,
    body: data,
  });

  return normalizeResult(payload);
}

