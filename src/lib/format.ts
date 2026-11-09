import { clsx, type ClassValue } from "clsx";

export function cx(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(cents: number) {
  return brl.format(cents / 100);
}

/**
 * Parcelamento no cartão.
 * `interestFree` é a quantidade de parcelas sem juros; acima disso há juros
 * simples embutidos. Nunca anunciar "sem juros" além do que é praticado —
 * oferta vaga vincula o lojista (CDC, art. 30).
 */
export function installmentsLabel(
  cents: number,
  interestFree = 6,
  max = 12,
) {
  const each = Math.round(cents / interestFree);
  return `até ${interestFree}x de ${formatBRL(each)} sem juros · ${max}x com juros`;
}

/** Valor de cada parcela com juros simples compostos sobre o total. */
export function installmentValue(cents: number, times: number, monthlyRate = 0.0299) {
  if (times <= 1) return cents;
  const total = cents * (1 + monthlyRate * (times - 1));
  return Math.round(total / times);
}

export function formatDatePtBr(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function maskCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
