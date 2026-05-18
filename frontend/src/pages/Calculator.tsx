/**
 * @file Tela da Calculadora Inteligente (rota `/calculator`). Layout em duas
 * colunas: form de insumos + painel de resultado. Estilo EyePleasure.
 * @author lukasnascimento1
 */
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
    <div className="p-8 max-w-6xl">
      <header className="mb-6">
        <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">
          Calculadora Inteligente
        </h1>
        <p className="text-[13px] text-muted">
          Calcula custo e preço sugerido para pedidos extraordinários.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <form
          className="ep-glass p-6"
          onSubmit={(e) => {
            e.preventDefault();
            calculate.mutate(form);
          }}
        >
          <h2 className="font-bold text-[14px] uppercase tracking-wider text-faint mb-4">Insumos</h2>

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

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn-glass" onClick={() => saveConfig.mutate()}>
              Salvar como padrão
            </button>
            <button type="submit" className="btn-primary" disabled={calculate.isPending}>
              {calculate.isPending ? <span className="spinner" style={{ width: 18, height: 18 }} /> : "Calcular"}
            </button>
          </div>
        </form>

        <div className="ep-glass p-6">
          <h2 className="font-bold text-[14px] uppercase tracking-wider text-faint mb-4">Resultado</h2>
          {!result ? (
            <p className="text-[13px] text-muted">Preencha os campos e clique em Calcular.</p>
          ) : (
            <dl className="space-y-2.5 text-[14px]">
              <Row label="Filamento" value={currency(result.filamentCost)} />
              <Row label="Energia" value={currency(result.energyCost)} />
              <Row label="Depreciação" value={currency(result.depreciationCost)} />
              <div style={{ borderTop: "1px solid var(--ep-border)", margin: "10px 0" }} />
              <Row label="Custo total" value={currency(result.totalCost)} emphasis />
              <Row label={`Lucro (${result.profitMarginPercent}%)`} value={currency(result.profit)} />
              <div style={{ borderTop: "1px solid var(--ep-border)", margin: "10px 0" }} />
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
    <div className="field">
      <label>{label}</label>
      <input
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
      <dd
        style={{
          color: emphasis ? "var(--ep-text)" : "var(--ep-text-soft)",
          fontWeight: emphasis ? 700 : 500,
          fontSize: large ? 20 : 14,
          background: large
            ? "linear-gradient(135deg, var(--ep-primary-soft), var(--ep-accent-soft))"
            : "none",
          WebkitBackgroundClip: large ? "text" : "border-box",
          backgroundClip: large ? "text" : "border-box",
          WebkitTextFillColor: large ? "transparent" : "currentColor",
        }}
      >
        {value}
      </dd>
    </div>
  );
}
