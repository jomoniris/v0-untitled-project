import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(dateString: string) {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString()
  } catch (e) {
    return dateString
  }
}
