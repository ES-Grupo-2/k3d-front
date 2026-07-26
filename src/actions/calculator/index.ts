"use server";

import {
  calculatorParametersSchema,
  calculatorSimulationSchema,
  type CalculatorParameters,
  type CalculatorResult,
} from "@/schemas/calculator";
import {
  calculatePrintRequest,
  getCalculatorParametersRequest,
  saveCalculatorParametersRequest,
} from "@/services/calculator";
import { ApiError } from "@/services/auth/http";
import { requireRole } from "@/services/auth/session";

type CalculatorActionResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; status?: number };

function getActionError(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Nao foi possivel concluir a solicitacao.";
}

export async function getCalculatorParametersAction(): Promise<
  CalculatorActionResult<CalculatorParameters>
> {
  const { token } = await requireRole("GERENTE");

  try {
    const parameters = await getCalculatorParametersRequest(token);

    return {
      success: true,
      data: parameters,
    };
  } catch (error) {
    return {
      success: false,
      error: getActionError(error),
      status: error instanceof ApiError ? error.status : undefined,
    };
  }
}

export async function saveCalculatorParametersAction(
  input: unknown,
): Promise<CalculatorActionResult<CalculatorParameters>> {
  const { token } = await requireRole("GERENTE");
  const validation = calculatorParametersSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Revise os parametros antes de salvar.",
      status: 400,
    };
  }

  try {
    const result = await saveCalculatorParametersRequest(
      validation.data,
      token,
    );

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: getActionError(error),
      status: error instanceof ApiError ? error.status : undefined,
    };
  }
}

export async function calculatePrintAction(
  input: unknown,
): Promise<CalculatorActionResult<CalculatorResult>> {
  const { token } = await requireRole("GERENTE");
  const validation = calculatorSimulationSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Revise peso do filamento e consumo em kWh antes de calcular.",
      status: 400,
    };
  }

  try {
    const result = await calculatePrintRequest(validation.data, token);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: getActionError(error),
      status: error instanceof ApiError ? error.status : undefined,
    };
  }
}
