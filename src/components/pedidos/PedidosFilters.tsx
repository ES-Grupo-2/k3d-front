"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui";

// Filter bar for the Orders screen.
// It's the only interactive (client) part of the screen: it never keeps the
// orders in state, it just pushes the search and filters into the URL. The
// page's Server Component reacts to the `searchParams` change and returns the
// already-filtered list.
// On desktop the controls stay inline; on mobile they collapse into two buttons
// (Search and Filter) to avoid cluttering the screen, opening the input and the
// drawer on demand.

// Sentinel Select value for "no filter" — Radix doesn't accept an empty item.
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

// Chip option group used in the mobile filters drawer.
function FilterChips({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs font-medium uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value || "all"}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-secondary/40 text-foreground hover:border-primary"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const isFirstRender = useRef(true);

  // Re-syncs the search when the URL changes externally (e.g. browser
  // back/forward), so we don't keep text typed on a previous visit. Done as a
  // render-time adjustment (React's recommended pattern for deriving state from
  // a prop) instead of an effect that calls setState.
  const [syncedQuery, setSyncedQuery] = useState(initialQuery);
  if (initialQuery !== syncedQuery) {
    setSyncedQuery(initialQuery);
    setQuery(initialQuery);
  }

  // Rewrites the URL preserving the other params; an empty value drops the key.
  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // Debounces the text search so we don't fire a request on every keystroke.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => updateParam("q", query.trim()), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const activeFilterCount = (initialColumn ? 1 : 0) + (initialPayment ? 1 : 0);
  const hasActiveFilters = query !== "" || activeFilterCount > 0;

  // Clears only the filters (status and payment), keeping the text search.
  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    params.delete("payment");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearAll() {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <>
      {/* Mobile: two discreet buttons (Search opens an inline input, Filter opens a drawer) */}
      <div className="flex gap-2 md:hidden">
        {searchOpen ? (
          <div className="relative flex-1">
            <Search className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, cliente ou ID…"
              className="pr-9 pl-9"
              aria-label="Buscar pedidos"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Fechar busca"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={`flex flex-1 items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
              query
                ? "border-primary text-foreground"
                : "border-secondary/40 text-muted-foreground"
            }`}
          >
            <Search className="size-4 shrink-0" />
            <span className="truncate">{query || "Pesquisar"}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          aria-label="Abrir filtros"
          className={`relative flex shrink-0 items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
            activeFilterCount > 0
              ? "border-primary text-foreground"
              : "border-secondary/40 text-muted-foreground"
          }`}
        >
          <SlidersHorizontal className="size-4" />
          Filtro
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground inline-flex size-5 items-center justify-center rounded-full text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop: inline controls */}
      <div className="hidden gap-3 md:flex md:items-center">
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
          <SelectTrigger className="w-44" aria-label="Filtrar por status">
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
            className="w-48"
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

      {/* Filters drawer (mobile) */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" className="w-80 max-w-[85vw] gap-6 p-6">
          <SheetTitle>Filtros</SheetTitle>

          <FilterChips
            label="Status"
            value={initialColumn}
            options={[{ value: "", label: "Todos" }, ...COLUMN_OPTIONS]}
            onSelect={(value) => updateParam("status", value)}
          />

          <FilterChips
            label="Forma de pagamento"
            value={initialPayment}
            options={[{ value: "", label: "Todas" }, ...PAYMENT_OPTIONS]}
            onSelect={(value) => updateParam("payment", value)}
          />

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground mt-2 inline-flex items-center gap-1.5 self-start rounded-md text-sm transition-colors"
            >
              <X className="size-4" />
              Limpar filtros
            </button>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
