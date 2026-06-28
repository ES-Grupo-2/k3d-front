"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

// Barra de filtros da tela de Pedidos.
// É a única parte interativa (client) da tela: não guarda os pedidos em estado,
// apenas empurra a busca e os filtros para a URL. O Server Component da página
// reage à mudança de `searchParams` e devolve a lista já filtrada.

// Valor sentinela do Select para "sem filtro" — o Radix não aceita item vazio.
const ALL = "ALL";

const COLUMN_OPTIONS = [
  { value: "TODO", label: "A Fazer" },
  { value: "DOING", label: "Fazendo" },
  { value: "DONE", label: "Concluído" },
];

const PAYMENT_OPTIONS = [
  { value: "PIX", label: "Pix" },
  { value: "CREDIT_CARD", label: "Cartão de Crédito" },
  { value: "DEBIT_CARD", label: "Cartão de Débito" },
  { value: "CASH", label: "Dinheiro" },
];

interface PedidosFiltersProps {
  initialQuery: string;
  initialColumn: string;
  initialPayment: string;
}

export function PedidosFilters({
  initialQuery,
  initialColumn,
  initialPayment,
}: PedidosFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const isFirstRender = useRef(true);

  // Reescreve a URL preservando os demais parâmetros; valor vazio remove a chave.
  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // Debounce da busca textual para não disparar uma requisição a cada tecla.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => updateParam("q", query.trim()), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const hasActiveFilters =
    query !== "" || initialColumn !== "" || initialPayment !== "";

  function clearAll() {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, cliente ou ID…"
          className="pl-9"
          aria-label="Buscar pedidos"
        />
      </div>

      <Select
        value={initialColumn || ALL}
        onValueChange={(value) =>
          updateParam("status", value === ALL ? "" : value)
        }
      >
        <SelectTrigger
          className="w-full sm:w-44"
          aria-label="Filtrar por status"
        >
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todos os status</SelectItem>
          {COLUMN_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={initialPayment || ALL}
        onValueChange={(value) =>
          updateParam("payment", value === ALL ? "" : value)
        }
      >
        <SelectTrigger
          className="w-full sm:w-48"
          aria-label="Filtrar por forma de pagamento"
        >
          <SelectValue placeholder="Pagamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Toda forma de pagamento</SelectItem>
          {PAYMENT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors"
        >
          <X className="size-4" />
          Limpar
        </button>
      )}
    </div>
  );
}
