const display = document.getElementById('display');
let expression = '';
let justCalculated = false;

function updateDisplay() {
  display.textContent = expression === '' ? '0' : expression;
}

function inputNumber(num) {
  if (justCalculated) {
    expression = '';
    justCalculated = false;
  }
  expression += num;
  updateDisplay();
}

function inputOperator(op) {
  if (expression === '' && op !== '-') return;
  justCalculated = false;

  const lastChar = expression.slice(-1);
  if (['+', '-', '*', '/'].includes(lastChar)) {
    expression = expression.slice(0, -1) + op;
  } else {
    expression += op;
  }
  updateDisplay();
}

function inputDecimal() {
  if (justCalculated) {
    expression = '';
    justCalculated = false;
  }
  const segment = expression.split(/[\+\-\*\/\(]/).pop();
  if (segment.includes('.')) return;
  if (segment === '' || ['+', '-', '*', '/', '('].includes(expression.slice(-1))) {
    expression += '0.';
  } else {
    expression += '.';
  }
  updateDisplay();
}

function inputParen() {
  if (justCalculated) {
    expression = '';
    justCalculated = false;
  }
  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;
  const lastChar = expression.slice(-1);

  if (openCount === closeCount || ['+', '-', '*', '/', '('].includes(lastChar) || expression === '') {
    expression += '(';
  } else {
    expression += ')';
  }
  updateDisplay();
}

function inputPercent() {
  const match = expression.match(/(\d+\.?\d*)$/);
  if (!match) return;
  const num = match[1];
  const start = expression.length - num.length;
  expression = expression.slice(0, start) + '(' + num + '/100)';
  justCalculated = false;
  updateDisplay();
}

function clearAll() {
  expression = '';
  justCalculated = false;
  updateDisplay();
}

function calculate() {
  if (expression === '') return;
  let evalExpr = expression;

  const openCount = (evalExpr.match(/\(/g) || []).length;
  const closeCount = (evalExpr.match(/\)/g) || []).length;
  evalExpr += ')'.repeat(Math.max(0, openCount - closeCount));

  if (!/^[0-9+\-*/(). ]*$/.test(evalExpr)) {
    display.textContent = 'Error';
    expression = '';
    return;
  }

  try {
    const result = Function('"use strict"; return (' + evalExpr + ')')();
    if (result === undefined || isNaN(result) || !isFinite(result)) {
      throw new Error('Invalid');
    }
    expression = (Math.round(result * 1e10) / 1e10).toString();
    justCalculated = true;
    updateDisplay();
  } catch (e) {
    display.textContent = 'Error';
    expression = '';
  }
}

document.querySelectorAll('[data-num]').forEach(btn => {
  btn.addEventListener('click', () => inputNumber(btn.dataset.num));
});

document.querySelectorAll('[data-op]').forEach(btn => {
  btn.addEventListener('click', () => inputOperator(btn.dataset.op));
});

document.getElementById('decimal').addEventListener('click', inputDecimal);
document.getElementById('paren').addEventListener('click', inputParen);
document.getElementById('percent').addEventListener('click', inputPercent);
document.getElementById('equals').addEventListener('click', calculate);
document.getElementById('clear').addEventListener('click', clearAll);

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  if (['+', '-', '*', '/'].includes(e.key)) inputOperator(e.key);
  if (e.key === '.') inputDecimal();
  if (e.key === '(' || e.key === ')') inputParen();
  if (e.key === '%') inputPercent();
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Escape') clearAll();
  if (e.key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateDisplay();
  }
});

// --- Dark mode toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
}

const savedTheme = localStorage.getItem('calculator-theme');
applyTheme(savedTheme === 'dark');

themeToggleBtn.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
  localStorage.setItem('calculator-theme', isDark ? 'dark' : 'light');
});
