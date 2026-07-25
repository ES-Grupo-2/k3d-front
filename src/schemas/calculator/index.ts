import { z } from "zod";

const requiredNumber = (message: string) =>
  z.number({ error: message }).finite(message);

export const calculatorParametersSchema = z.object({
  filament_price: requiredNumber("Informe o preço do filamento.").positive(
    "O preço do filamento deve ser maior que zero.",
  ),
  kw_cost: requiredNumber("Informe o custo do kWh.").positive(
    "O custo do kWh deve ser maior que zero.",
  ),
  depreciation: requiredNumber("Informe a depreciação.").min(
    0,
    "A depreciação deve ser maior ou igual a zero.",
  ),
  profit_margin: requiredNumber("Informe a margem de lucro.").min(
    0,
    "A margem deve ser maior ou igual a zero.",
  ),
});

export const calculatorSimulationSchema = z.object({
  filament_weight_grams: requiredNumber("Informe o peso do filamento.").positive(
    "O peso do filamento deve ser maior que zero.",
  ),
  kwh_used: requiredNumber("Informe o consumo em kWh.").positive(
    "O consumo em kWh deve ser maior que zero.",
  ),
});

export type CalculatorParametersFormData = z.infer<
  typeof calculatorParametersSchema
>;
export type CalculatorSimulationFormData = z.infer<
  typeof calculatorSimulationSchema
>;

export interface CalculatorParameters extends CalculatorParametersFormData {
  id: number;
  updated_at: string;
}

export interface CalculatorResult {
  inputs: CalculatorSimulationFormData;
  breakdown: {
    filamentCost: number;
    energyCost: number;
    depreciationCost: number;
  };
  custoTotal: number;
  precoSugerido: number;
}
