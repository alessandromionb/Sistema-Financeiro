import { INITIAL_TRANSACTIONS, createTransaction, filterTransactions, formatCurrency, getCategoryOptions, getCategoryTotals, getSummaries, sortTransactions } from './transactions.js';
import { loadTransactions, saveTransactions } from './storage.js';

const transactionForm = document.getElementById('transaction-form');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const recentList = document.getElementById('recent-list');
const historyList = document.getElementById('history-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const totalCountEl = document.getElementById('total-count');
const topCategoryEl = document.getElementById('top-category');
const searchInput = document.getElementById('search');
const typeFilter = document.getElementById('filter-type');
const categoryFilter = document.getElementById('filter-category');
const clearFiltersBtn = document.getElementById('clear-filters');
const quickAddBtn = document.getElementById('quick-add-btn');
const goHistoryBtn = document.getElementById('go-history-btn');
const descriptionInput = document.getElementById('description');

let transactions = loadTransactions(INITIAL_TRANSACTIONS);

function init() {
  bindEvents();
  setDefaultDate();
  render();
}

function bindEvents() {
  transactionForm.addEventListener('submit', handleSubmit);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => showPanel(tab.dataset.target));
  });

  quickAddBtn.addEventListener('click', () => {
    showPanel('record');
    descriptionInput.focus();
  });

  goHistoryBtn.addEventListener('click', () => showPanel('history'));

  searchInput.addEventListener('input', renderHistory);
  typeFilter.addEventListener('change', renderHistory);
  categoryFilter.addEventListener('change', renderHistory);
  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    typeFilter.value = '';
    categoryFilter.value = '';
    renderHistory();
  });

  document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-btn');
    if (!deleteButton) {
      return;
    }

    transactions = transactions.filter((item) => item.id !== deleteButton.dataset.id);
    saveTransactions(transactions);
    render();
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(transactionForm);
  const newTransaction = createTransaction(formData);

  transactions = [newTransaction, ...transactions];
  saveTransactions(transactions);
  transactionForm.reset();
  setDefaultDate();
  render();
  showPanel('summary');
  descriptionInput.focus();
}

function render() {
  renderSummary();
  renderRecent();
  renderHistory();
  populateCategoryFilter();
  renderCharts();
}

function renderSummary() {
  const { income, expense, balance } = getSummaries(transactions);
  balanceEl.textContent = formatCurrency(balance);
  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
  totalCountEl.textContent = transactions.length;
  const topCategory = getCategoryTotals(transactions)[0];
  topCategoryEl.textContent = topCategory ? topCategory.name : '—';
}

function renderRecent() {
  const visible = sortTransactions(transactions).slice(0, 5);
  renderItems(recentList, visible);
}

function renderHistory() {
  const filters = {
    query: searchInput.value.trim(),
    type: typeFilter.value,
    category: categoryFilter.value
  };

  const visible = sortTransactions(filterTransactions(transactions, filters));
  renderItems(historyList, visible);
}

function renderItems(container, items) {
  if (!items.length) {
    container.innerHTML = '<li class="empty-state">Nenhuma movimentação encontrada.</li>';
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <li class="transaction-item">
          <div class="transaction-main">
            <strong>${item.description}</strong>
            <span class="transaction-meta">${item.category}${item.note ? ` • ${item.note}` : ''} • ${new Date(item.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div class="transaction-main">
            <span class="amount-badge ${item.type === 'income' ? 'income' : 'expense'}">${item.type === 'income' ? '+' : '-'}${formatCurrency(Number(item.amount))}</span>
            <button class="delete-btn" data-id="${item.id}" type="button">Excluir</button>
          </div>
        </li>
      `
    )
    .join('');
}

function populateCategoryFilter() {
  const categories = getCategoryOptions(transactions);
  const currentValue = categoryFilter.value;

  categoryFilter.innerHTML = [
    '<option value="">Todas as categorias</option>',
    ...categories.map((category) => `<option value="${category}">${category}</option>`)
  ].join('');

  if (currentValue) {
    categoryFilter.value = currentValue;
  }
}

function renderCharts() {
  renderCategoryChart();
  renderDonutChart();
}

function renderCategoryChart() {
  const svg = document.getElementById('bars-chart');
  const data = getCategoryTotals(transactions);
  if (!data.length) {
    svg.innerHTML = '<text x="20" y="90" fill="#64748b">Cadastre movimentações para ver o gráfico.</text>';
    return;
  }

  const width = 320;
  const height = 180;
  const margin = 24;
  const chartHeight = 120;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const barWidth = 38;
  const gap = 18;

  const bars = data
    .map((item, index) => {
      const valueHeight = (Number(item.value) / maxValue) * chartHeight;
      const x = margin + index * (barWidth + gap);
      const y = height - margin - valueHeight;
      const color = index % 2 === 0 ? '#2563eb' : '#3b82f6';
      return `<rect x="${x}" y="${y}" width="${barWidth}" height="${valueHeight}" rx="8" fill="${color}"></rect><text x="${x + barWidth / 2}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#64748b">${item.name.slice(0, 8)}</text>`;
    })
    .join('');

  svg.innerHTML = `<line x1="${margin}" y1="${height - margin}" x2="${width - margin}" y2="${height - margin}" stroke="#e2e8f0" stroke-width="1"></line>${bars}`;
}

function renderDonutChart() {
  const svg = document.getElementById('donut-chart');
  const { income, expense } = getSummaries(transactions);
  const total = income + expense || 1;
  const incomeRatio = income / total;
  const expenseRatio = expense / total;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const incomeOffset = circumference * (1 - incomeRatio);
  const expenseOffset = circumference * (1 - expenseRatio);

  svg.innerHTML = `
    <circle cx="110" cy="110" r="70" fill="none" stroke="#e2e8f0" stroke-width="24"></circle>
    <circle cx="110" cy="110" r="70" fill="none" stroke="#15803d" stroke-width="24" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${incomeOffset}" transform="rotate(-90 110 110)"></circle>
    <circle cx="110" cy="110" r="70" fill="none" stroke="#dc2626" stroke-width="24" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${expenseOffset}" transform="rotate(-90 110 110)"></circle>
    <text x="110" y="100" text-anchor="middle" font-size="16" fill="#14213d">Saldo</text>
    <text x="110" y="126" text-anchor="middle" font-size="16" font-weight="700" fill="#14213d">${formatCurrency(income - expense)}</text>
  `;
}

function setDefaultDate() {
  const dateInput = document.getElementById('date');
  dateInput.value = new Date().toISOString().slice(0, 10);
}

function showPanel(target) {
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.target === target));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === target));
}

window.addEventListener('DOMContentLoaded', init);
