"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  calculatePrintAction,
  getCalculatorParametersAction,
  saveCalculatorParametersAction,
} from "@/actions/calculator";
import {
  calculatorParametersSchema,
  calculatorSimulationSchema,
  type CalculatorParameters,
  type CalculatorParametersFormData,
  type CalculatorResult,
  type CalculatorSimulationFormData,
} from "@/schemas/calculator";
import { currency } from "@/lib/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";

const parameterDefaults: CalculatorParametersFormData = {
  filament_price: 0,
  kw_cost: 0,
  depreciation: 0,
  profit_margin: 0,
};

const simulationDefaults: CalculatorSimulationFormData = {
  filament_weight_grams: 0,
  kwh_used: 0,
};

function formatDate(value: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function NumberField({
  min = 0,
  step = "0.01",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input
      inputMode="decimal"
      min={min}
      step={step}
      type="number"
      {...props}
    />
  );
}

function ResultRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div className="border-border flex items-center justify-between gap-4 border-b py-3 last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={strong ? "text-lg font-semibold" : "font-medium"}>
        {currency(value)}
      </span>
    </div>
  );
}

export function CalculatorClient() {
  const [parameters, setParameters] = useState<CalculatorParameters | null>(
    null,
  );
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [isLoadingParameters, setIsLoadingParameters] = useState(true);
  const [parametersError, setParametersError] = useState<string | null>(null);
  const [parametersSuccess, setParametersSuccess] = useState<string | null>(
    null,
  );
  const [calculateError, setCalculateError] = useState<string | null>(null);

  const parametersForm = useForm<CalculatorParametersFormData>({
    resolver: zodResolver(calculatorParametersSchema),
    defaultValues: parameterDefaults,
  });

  const simulationForm = useForm<CalculatorSimulationFormData>({
    resolver: zodResolver(calculatorSimulationSchema),
    defaultValues: simulationDefaults,
  });

  useEffect(() => {
    let isActive = true;

    async function loadParameters() {
      setIsLoadingParameters(true);
      setParametersError(null);

      const response = await getCalculatorParametersAction();

      if (!isActive) return;

      if (response.success) {
        setParameters(response.data);
        parametersForm.reset({
          filament_price: response.data.filament_price,
          kw_cost: response.data.kw_cost,
          depreciation: response.data.depreciation,
          profit_margin: response.data.profit_margin,
        });
      } else if (response.status === 404) {
        setParameters(null);
      } else {
        setParametersError(response.error);
      }

      setIsLoadingParameters(false);
    }

    void loadParameters();

    return () => {
      isActive = false;
    };
  }, [parametersForm]);

  async function onSaveParameters(values: CalculatorParametersFormData) {
    setParametersError(null);
    setParametersSuccess(null);

    const response = await saveCalculatorParametersAction(values);

    if (!response.success) {
      setParametersError(response.error);
      return;
    }

    setParameters(response.data);
    parametersForm.reset({
      filament_price: response.data.filament_price,
      kw_cost: response.data.kw_cost,
      depreciation: response.data.depreciation,
      profit_margin: response.data.profit_margin,
    });
    setParametersSuccess(response.message ?? "Parâmetros salvos com sucesso.");
  }

  async function onCalculate(values: CalculatorSimulationFormData) {
    setCalculateError(null);
    setResult(null);

    if (!parameters) {
      setCalculateError(
        "Configure e salve os parâmetros antes de simular uma impressão.",
      );
      return;
    }

    const response = await calculatePrintAction(values);

    if (!response.success) {
      setCalculateError(response.error);
      return;
    }

    setResult(response.data);
  }

  const updatedAt = parameters ? formatDate(parameters.updated_at) : null;
  const isSaving = parametersForm.formState.isSubmitting;
  const isCalculating = simulationForm.formState.isSubmitting;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Calculadora</h1>
        <p className="text-muted-foreground text-sm">
          Configure os custos base e simule o preço sugerido para impressões 3D.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros</CardTitle>
            <CardDescription>
              Valores globais usados em todas as simulações.
            </CardDescription>
          </CardHeader>
          <Form {...parametersForm}>
            <form onSubmit={parametersForm.handleSubmit(onSaveParameters)}>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {isLoadingParameters ? (
                  <Alert className="sm:col-span-2">
                    <AlertDescription>
                      Carregando parâmetros da calculadora...
                    </AlertDescription>
                  </Alert>
                ) : null}

                {!isLoadingParameters && !parameters && !parametersError ? (
                  <Alert className="sm:col-span-2">
                    <AlertTitle>Configuração pendente</AlertTitle>
                    <AlertDescription>
                      Nenhum parâmetro foi encontrado. Salve os valores base
                      para liberar os cálculos.
                    </AlertDescription>
                  </Alert>
                ) : null}

                {parametersError ? (
                  <Alert className="sm:col-span-2" variant="destructive">
                    <AlertDescription>{parametersError}</AlertDescription>
                  </Alert>
                ) : null}

                {parametersSuccess ? (
                  <Alert className="sm:col-span-2">
                    <AlertDescription>{parametersSuccess}</AlertDescription>
                  </Alert>
                ) : null}

                <FormField
                  control={parametersForm.control}
                  name="filament_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filamento por kg</FormLabel>
                      <FormControl>
                        <NumberField
                          placeholder="150.00"
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={parametersForm.control}
                  name="kw_cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo do kWh</FormLabel>
                      <FormControl>
                        <NumberField
                          placeholder="0.95"
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={parametersForm.control}
                  name="depreciation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depreciação</FormLabel>
                      <FormControl>
                        <NumberField
                          placeholder="2.50"
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={parametersForm.control}
                  name="profit_margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margem de lucro (%)</FormLabel>
                      <FormControl>
                        <NumberField
                          placeholder="100"
                          step="1"
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-sm">
                  {updatedAt
                    ? `Atualizado em ${updatedAt}`
                    : "Sem parâmetros salvos"}
                </p>
                <Button
                  className="gap-2"
                  disabled={isSaving || isLoadingParameters}
                  type="submit"
                >
                  <Save className="size-4" />
                  {isSaving ? "Salvando..." : "Salvar parâmetros"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulação</CardTitle>
            <CardDescription>
              Informe consumo e material para estimar o preço.
            </CardDescription>
          </CardHeader>
          <Form {...simulationForm}>
            <form onSubmit={simulationForm.handleSubmit(onCalculate)}>
              <CardContent className="grid gap-4">
                {calculateError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{calculateError}</AlertDescription>
                  </Alert>
                ) : null}

                <FormField
                  control={simulationForm.control}
                  name="filament_weight_grams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso do filamento (g)</FormLabel>
                      <FormControl>
                        <NumberField
                          placeholder="500"
                          step="1"
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={simulationForm.control}
                  name="kwh_used"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>kWh consumido</FormLabel>
                      <FormControl>
                        <NumberField
                          placeholder="10"
                          {...field}
                          onChange={(event) =>
                            field.onChange(event.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="mt-2 gap-2"
                  disabled={isCalculating || !parameters}
                  type="submit"
                >
                  <Calculator className="size-4" />
                  {isCalculating ? "Calculando..." : "Calcular"}
                </Button>
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
          <CardDescription>
            Custos calculados a partir dos parâmetros salvos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="bg-muted rounded-lg p-5">
                <p className="text-muted-foreground text-sm">Custo total</p>
                <p className="mt-2 text-3xl font-semibold">
                  {currency(result.custoTotal)}
                </p>
                <p className="text-muted-foreground mt-6 text-sm">
                  Preco sugerido
                </p>
                <p className="text-primary mt-2 text-4xl font-semibold">
                  {currency(result.precoSugerido)}
                </p>
              </div>

              <div className="rounded-lg border px-5">
                <ResultRow
                  label="Custo de filamento"
                  value={result.breakdown.filamentCost}
                />
                <ResultRow
                  label="Custo de energia"
                  value={result.breakdown.energyCost}
                />
                <ResultRow
                  label="Depreciação"
                  value={result.breakdown.depreciationCost}
                />
                <ResultRow
                  label="Custo total"
                  strong
                  value={result.custoTotal}
                />
                <ResultRow
                  label="Preço sugerido"
                  strong
                  value={result.precoSugerido}
                />
              </div>
            </div>
          ) : (
            <div className="border-border text-muted-foreground flex min-h-40 items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm">
              Execute uma simulação para visualizar o detalhamento do cálculo.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

