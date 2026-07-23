"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const ALL = "ALL";

const SECTION_OPTIONS = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "FAZENDO", label: "Fazendo" },
  { value: "FINALIZADO", label: "Finalizado" },
];

const PAYMENT_OPTIONS = [
  { value: "PIX", label: "Pix" },
  { value: "CARTAO_CREDITO", label: "Cartão de Crédito" },
  { value: "CARTAO_DEBITO", label: "Cartão de Débito" },
  { value: "DINHEIRO", label: "Dinheiro" },
];

interface PedidosFiltersProps {
  initialQuery: string;
  initialSection: string; 
  initialPayment: string;
}

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
  initialSection,
  initialPayment,
}: PedidosFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const isFirstRender = useRef(true);

  const [syncedQuery, setSyncedQuery] = useState(initialQuery);
  if (initialQuery !== syncedQuery) {
    setSyncedQuery(initialQuery);
    setQuery(initialQuery);
  }

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

 useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => updateParam("search", query.trim()), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const activeFilterCount = (initialSection ? 1 : 0) + (initialPayment ? 1 : 0);
  const hasActiveFilters = query !== "" || activeFilterCount > 0;

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("section"); 
    params.delete("payment");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearAll() {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <>
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
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
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

      <div className="hidden gap-3 md:flex md:items-center">
        <div className="relative flex-1">
          <Search className="text-foreground/75 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, cliente ou ID…"
            className="pl-9 text-foreground/90 placeholder:text-foreground/75"
          />
        </div>

        <Select
          value={initialSection || ALL}
          onValueChange={(value) =>
            updateParam("section", value === ALL ? "" : value) // Corrigido para section
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status da Produção" />
          </SelectTrigger>
          <SelectContent className="hover:cursor-pointer">
            <SelectItem value={ALL}>Todos os status</SelectItem>
            {SECTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="hover:cursor-pointer">
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
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Toda forma de pagamento</SelectItem>
            {PAYMENT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="hover:cursor-pointer">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-muted-foreground hover:cursor-pointer hover:text-foreground inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors"
          >
            <X className="size-4" />
            Limpar
          </button>
        )}
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" className="w-80 max-w-[85vw] gap-6 p-6">
          <SheetTitle>Filtros</SheetTitle>

          <FilterChips
            label="Status da Produção"
            value={initialSection}
            options={[{ value: "", label: "Todos" }, ...SECTION_OPTIONS]}
            onSelect={(value) => updateParam("section", value)}
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