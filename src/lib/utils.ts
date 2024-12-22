import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    ano: 31536000,
    mês: 2592000,
    dia: 86400,
    hora: 3600,
    minuto: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);

    if (interval >= 1) {
      // Handle plural forms
      if (unit === "mês" && interval > 1) return `${interval} meses atrás`;
      return `${interval} ${unit}${interval > 1 && unit !== "mês" ? "s" : ""} atrás`;
    }
  }

  return "agora mesmo";
}
