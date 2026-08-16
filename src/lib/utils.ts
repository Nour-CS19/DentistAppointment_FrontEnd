import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a number as currency in EGP. Locale can be 'en' or 'ar'.
export function formatCurrency(amount: number | string | undefined | null, locale: "en" | "ar" = "en") {
  if (amount === undefined || amount === null || amount === "") return "";
  const value = typeof amount === "string" ? parseFloat(amount.replace(/,/g, "")) : amount;
  if (isNaN(Number(value))) return "";
  const locales = locale === "ar" ? "ar-EG" : "en-EG";
  return new Intl.NumberFormat(locales, { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(Number(value));
}
