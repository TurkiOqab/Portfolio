import { PortfolioData, defaultPortfolioData } from "../types";

const STORAGE_KEY = "portfolio_data";

/**
 * Check if portfolio data exists in localStorage
 */
export function hasPortfolioData(): boolean {
    if (typeof window === "undefined") return false;
    const data = localStorage.getItem(STORAGE_KEY);
    return data !== null;
}

/**
 * Get portfolio data from localStorage
 */
export function getPortfolioData(): PortfolioData {
    if (typeof window === "undefined") return defaultPortfolioData;

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultPortfolioData;

    try {
        return JSON.parse(data) as PortfolioData;
    } catch {
        return defaultPortfolioData;
    }
}

/**
 * Save portfolio data to localStorage
 */
export function savePortfolioData(data: PortfolioData): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Clear portfolio data from localStorage
 */
export function clearPortfolioData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Update a specific field in portfolio data
 */
export function updatePortfolioField<K extends keyof PortfolioData>(
    field: K,
    value: PortfolioData[K]
): PortfolioData {
    const current = getPortfolioData();
    const updated = { ...current, [field]: value };
    savePortfolioData(updated);
    return updated;
}
