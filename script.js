const display = document.getElementById('display');
let current = '0';
let previous = null;
let operator = null;
let resetNext = false;

const opSymbols = {
  '+': '+',
  '-': '-',
  '*': 'x',
  '/': '/'
};

function updateDisplay() {
  if (operator !== null && resetNext) {
    // Just chose an operator, show "previous operator"
    display.textContent = `${previous} ${opSymbols[operator]}`;
  } else if (operator !== null) {
    // Typing the second number, show "previous operator current"
    display.textContent = `${previous} ${opSymbols[operator]} ${current}`;
  } else {
    display.textContent = current;
  }
}

function inputNumber(num) {
  if (resetNext) {
    current = num;
    resetNext = false;
  } else {
    current = current === '0' ? num : current + num;
  }
  updateDisplay();
}

function chooseOperator(op) {
  if (operator !== null && !resetNext) {
    calculate();
  }
  previous = current;
  operator = op;
  resetNext = true;
  updateDisplay();
}

function calculate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    default: return;
  }
  current = result.toString();
  operator = null;
  previous = null;
  resetNext = true;
  updateDisplay();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  resetNext = false;
  updateDisplay();
}

document.querySelectorAll('[data-num]').forEach(btn => {
  btn.addEventListener('click', () => inputNumber(btn.dataset.num));
});

document.querySelectorAll('[data-op]').forEach(btn => {
  btn.addEventListener('click', () => chooseOperator(btn.dataset.op));
});

document.getElementById('equals').addEventListener('click', calculate);
document.getElementById('clear').addEventListener('click', clearAll);

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  if (['+', '-', '*', '/'].includes(e.key)) chooseOperator(e.key);
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Escape') clearAll();
});
