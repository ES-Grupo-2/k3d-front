// Calcula uma escala fixa para o eixo de valores dos gráficos. Por padrão o
// Recharts marca o eixo nos próprios valores dos dados, o que produz marcas
// irregulares ("R$ 1.437", "R$ 2.913") que mudam a cada período. Aqui o eixo
// passa a usar marcas redondas e igualmente espaçadas, independentes dos dados.
// Author: lukasnascimento1

// Multiplicadores "redondos" aceitos para o intervalo entre marcas.
const NICE_STEPS = [1, 2, 2.5, 5, 10];

// Escala usada quando não há dados (ou todos são zero), para o eixo não colapsar.
const EMPTY_TICKS = [0, 25, 50, 75, 100];

export interface ValueScale {
  ticks: number[];
  domain: [number, number];
}

// Arredonda o intervalo bruto para o próximo multiplicador redondo (1, 2, 2,5,
// 5 ou 10 vezes uma potência de 10).
function niceStep(rawStep: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const factor = NICE_STEPS.find((step) => step >= rawStep / magnitude) ?? 10;
  return factor * magnitude;
}

// Corrige o ruído de ponto flutuante da soma acumulada das marcas.
function round(value: number): number {
  return Number(value.toPrecision(12));
}

/**
 * Monta marcas redondas e igualmente espaçadas cobrindo todos os valores.
 * O zero está sempre incluído e valores negativos (ex.: lucro no vermelho)
 * estendem a escala para baixo.
 *
 * @param values - valores plotados no eixo
 * @param tickCount - quantidade desejada de marcas (o resultado pode variar em 1)
 */
export function buildValueScale(values: number[], tickCount = 5): ValueScale {
  const max = Math.max(0, ...values);
  const min = Math.min(0, ...values);

  if (max === min) {
    return { ticks: EMPTY_TICKS, domain: [0, 100] };
  }

  const step = niceStep((max - min) / (tickCount - 1));
  const lower = Math.floor(min / step) * step;
  const upper = Math.ceil(max / step) * step;

  const ticks: number[] = [];
  for (let tick = lower; tick <= upper + step / 2; tick += step) {
    ticks.push(round(tick));
  }

  return { ticks, domain: [ticks[0], ticks[ticks.length - 1]] };
}
