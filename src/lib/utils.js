// THIS FILE IS NOT THE SAME AS THE UTILS FOLDER. THIS IS USED FOR THE RADIX UI COMPONENTS.
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
