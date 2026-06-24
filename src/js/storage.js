const STORAGE_KEY = 'sistema-financeiro-mvp-v2';

export function loadTransactions(defaultTransactions = []) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultTransactions;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultTransactions;
  } catch {
    return defaultTransactions;
  }
}

export function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
