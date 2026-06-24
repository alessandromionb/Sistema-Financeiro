const STORAGE_KEY = 'sistema-financeiro-mvp';
const initialTransactions = [
  {
    id: crypto.randomUUID(),
    description: 'Salário',
    amount: 3500,
    type: 'income',
    category: 'Trabalho',
    date: '2026-06-01'
  },
  {
    id: crypto.randomUUID(),
    description: 'Aluguel',
    amount: 1200,
    type: 'expense',
    category: 'Moradia',
    date: '2026-06-02'
  }
];

const transactionForm = document.getElementById('transaction-form');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const historyList = document.getElementById('history-list');
const recentList = document.getElementById('recent-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');

let transactions = loadTransactions();

function loadTransactions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialTransactions;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialTransactions;
  } catch {
    return initialTransactions;
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function getSummaries() {
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

function renderSummary() {
  const { income, expense, balance } = getSummaries();
  balanceEl.textContent = formatCurrency(balance);
  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
}

function renderTransactions(listElement, limit) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const visible = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

  if (!visible.length) {
    listElement.innerHTML = '<li class="empty-state">Nenhuma movimentação registrada ainda.</li>';
    return;
  }

  listElement.innerHTML = visible
    .map((item) => `
      <li class="transaction-item">
        <div class="transaction-main">
          <strong>${item.description}</strong>
          <span class="transaction-meta">${item.category} • ${new Date(item.date).toLocaleDateString('pt-BR')}</span>
        </div>
        <div class="transaction-main">
          <span class="amount-badge ${item.type === 'income' ? 'income' : 'expense'}">${item.type === 'income' ? '+' : '-'}${formatCurrency(Number(item.amount))}</span>
          <button class="delete-btn" data-id="${item.id}" type="button">Excluir</button>
        </div>
      </li>
    `)
    .join('');
}

function render() {
  renderSummary();
  renderTransactions(recentList, 5);
  renderTransactions(historyList);
}

transactionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(transactionForm);
  const newTransaction = {
    id: crypto.randomUUID(),
    description: formData.get('description').toString().trim(),
    amount: Number(formData.get('amount')),
    type: formData.get('type').toString(),
    category: formData.get('category').toString().trim(),
    date: formData.get('date').toString()
  };

  transactions = [newTransaction, ...transactions];
  saveTransactions();
  transactionForm.reset();
  document.getElementById('date').value = new Date().toISOString().slice(0, 10);
  render();
  showPanel('summary');
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    showPanel(tab.dataset.target);
  });
});

function showPanel(target) {
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.target === target));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === target));
}

document.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-btn');
  if (!deleteButton) {
    return;
  }

  transactions = transactions.filter((item) => item.id !== deleteButton.dataset.id);
  saveTransactions();
  render();
});

window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('date').value = today;
  render();
});
