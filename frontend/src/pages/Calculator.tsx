import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "../api/client";
import type { CalculationResult } from "../api/types";
import { currency } from "../lib/format";

export function CalculatorPage() {
  const { data: config } = useQuery({
    queryKey: ["calc-config"],
    queryFn: () => api.get("/calculator/config").then((r) => r.data),
  });

  const [form, setForm] = useState({
    filamentPrice: 120,
    filamentType: "PLA",
    filamentGrams: 50,
    kwhPrice: 0.85,
    kwhAmount: 0.5,
    profitMargin: 60,
    printHours: 2,
    hourlyDepreciation: 1.5,
  });

  useEffect(() => {
    if (config) {
      setForm((s) => ({
        ...s,
        filamentPrice: Number(config.filamentPrice),
        kwhPrice: Number(config.kwhPrice),
        profitMargin: Number(config.profitMargin),
        hourlyDepreciation: Number(config.hourlyDepreciation),
      }));
    }
  }, [config]);

  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = useMutation({
    mutationFn: (payload: typeof form) =>
      api.post<CalculationResult>("/calculator/calculate", payload).then((r) => r.data),
    onSuccess: (r) => setResult(r),
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Erro no cálculo"),
  });

  const saveConfig = useMutation({
    mutationFn: () =>
      api
        .put("/calculator/config", {
          filamentPrice: form.filamentPrice,
          kwhPrice: form.kwhPrice,
          profitMargin: form.profitMargin,
          hourlyDepreciation: form.hourlyDepreciation,
        })
        .then((r) => r.data),
    onSuccess: () => toast.success("Parâmetros padrão salvos"),
  });

  function update<K extends keyof typeof form>(c: K, v: (typeof form)[K]) {
    setForm((s) => ({ ...s, [c]: v }));
  }

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-1 text-foreground">Calculadora Inteligente</h1>
      <p className="text-sm text-muted mb-6">
        Calcula custo e preço sugerido para pedidos extraordinários.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <form
          className="panel p-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            calculate.mutate(form);
          }}
        >
          <h2 className="font-semibold mb-2 text-foreground">Insumos</h2>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Preço filamento (R$/kg)" type="number" step="0.01"
              value={form.filamentPrice} onChange={(v) => update("filamentPrice", v)} />
            <Field label="Tipo de filamento" value={form.filamentType}
              onChange={(v) => update("filamentType", v as any)} />
            <Field label="Filamento (gramas)" type="number" step="0.1"
              value={form.filamentGrams} onChange={(v) => update("filamentGrams", v)} />
            <Field label="Horas de impressão" type="number" step="0.1"
              value={form.printHours} onChange={(v) => update("printHours", v)} />
            <Field label="Preço KWh (R$)" type="number" step="0.0001"
              value={form.kwhPrice} onChange={(v) => update("kwhPrice", v)} />
            <Field label="Qtde KWh" type="number" step="0.001"
              value={form.kwhAmount} onChange={(v) => update("kwhAmount", v)} />
            <Field label="Depreciação/hora (R$)" type="number" step="0.01"
              value={form.hourlyDepreciation} onChange={(v) => update("hourlyDepreciation", v)} />
            <Field label="Margem de lucro (%)" type="number" step="0.1"
              value={form.profitMargin} onChange={(v) => update("profitMargin", v)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => saveConfig.mutate()}>
              Salvar como padrão
            </button>
            <button type="submit" className="btn-primary" disabled={calculate.isPending}>
              {calculate.isPending ? "Calculando…" : "Calcular"}
            </button>
          </div>
        </form>

        <div className="panel p-5">
          <h2 className="font-semibold mb-3 text-foreground">Resultado</h2>
          {!result ? (
            <p className="text-sm text-muted">Preencha os campos e clique em Calcular.</p>
          ) : (
            <dl className="space-y-2 text-sm">
              <Row label="Filamento" value={currency(result.filamentCost)} />
              <Row label="Energia" value={currency(result.energyCost)} />
              <Row label="Depreciação" value={currency(result.depreciationCost)} />
              <div className="border-t border-border my-2" />
              <Row label="Custo total" value={currency(result.totalCost)} emphasis />
              <Row label={`Lucro (${result.profitMarginPercent}%)`} value={currency(result.profit)} />
              <div className="border-t border-border my-2" />
              <Row label="Preço sugerido" value={currency(result.suggestedPrice)} emphasis large />
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  step,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        type={type}
        step={step}
        value={String(value)}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
}

function Row({
  label,
  value,
  emphasis,
  large,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={`${emphasis ? "font-semibold text-foreground" : "text-foreground"} ${large ? "text-lg" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
