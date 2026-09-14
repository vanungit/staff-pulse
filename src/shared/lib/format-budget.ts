export function formatBudgetRub(value: number): string {
  const amount = Math.round(value).toLocaleString("ru-RU");
  return `${amount} руб.`;
}

export function formatPerformance(value: number): string {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
