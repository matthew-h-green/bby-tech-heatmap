export function formatCurrency(value: number): string {
  return `$${value}M`;
}

export function formatCurrencyDecimal(value: number): string {
  return `$${value.toFixed(1)}M`;
}

export function formatPercent(value: number): string {
  return `${value}%`;
}
