export const INITIAL_TRANSACTIONS = [
  {
    id: crypto.randomUUID(),
    description: 'Salário',
    amount: 3500,
    type: 'income',
    category: 'Trabalho',
    date: '2026-06-01',
    note: 'Pagamento mensal'
  },
  {
    id: crypto.randomUUID(),
    description: 'Aluguel',
    amount: 1200,
    type: 'expense',
    category: 'Moradia',
    date: '2026-06-02',
    note: 'Apartamento'
  },
  {
    id: crypto.randomUUID(),
    description: 'Mercado',
    amount: 520,
    type: 'expense',
    category: 'Alimentação',
    date: '2026-06-05',
    note: 'Compras da semana'
  }
];

export function createTransaction(formData) {
  const description = formData.get('description')?.toString().trim() ?? '';
  const amount = Number(formData.get('amount'));
  const type = formData.get('type')?.toString() ?? 'expense';
  const category = formData.get('category')?.toString().trim() ?? 'Geral';
  const date = formData.get('date')?.toString() ?? new Date().toISOString().slice(0, 10);
  const note = formData.get('note')?.toString().trim() ?? '';

  return {
    id: crypto.randomUUID(),
    description,
    amount,
    type,
    category,
    date,
    note
  };
}

export function getSummaries(transactions) {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expense = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return {
    income,
    expense,
    balance: income - expense
  };
}

export function sortTransactions(transactions) {
  return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function filterTransactions(transactions, filters = {}) {
  const query = (filters.query ?? '').toLowerCase();
  const type = filters.type ?? '';
  const category = (filters.category ?? '').toLowerCase();

  return transactions.filter((item) => {
    const matchesQuery =
      !query ||
      [item.description, item.category, item.note]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

    const matchesType = !type || item.type === type;
    const matchesCategory = !category || item.category.toLowerCase() === category;

    return matchesQuery && matchesType && matchesCategory;
  });
}

export function getCategoryOptions(transactions) {
  return [...new Set(transactions.map((item) => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function getCategoryTotals(transactions) {
  const totals = transactions.reduce((acc, item) => {
    const key = item.category || 'Geral';
    acc[key] = (acc[key] || 0) + Number(item.amount);
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
