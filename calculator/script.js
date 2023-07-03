const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');
const memoryDisplay = document.getElementById('memoryDisplay');
const angleModeToggle = document.getElementById('angleMode');
let memory = 0;
let isShiftMode = false;

function addToDisplay(value) {
  display.value += value;
}

function addFunction(func) {
  switch (func) {
    case 'sin':
    case 'cos':
    case 'tan':
      display.value += `${func}(`;
      break;
    case 'asin':
    case 'acos':
    case 'atan':
      display.value += `a${func.slice(1)}(`;
      break;
    case 'log':
      display.value += 'log(';
      break;
    case 'ln':
      display.value += 'ln(';
      break;
    case 'sqrt':
      display.value += '√(';
      break;
    case 'cbrt':
      display.value += 'cbrt(';
      break;
    case 'abs':
      display.value += 'abs(';
      break;
    case '10^':
      display.value += '10^(';
      break;
    case 'fact':
      display.value += 'fact(';
      break;
  }
}

function toggleShift() {
  isShiftMode = !isShiftMode;
  document.getElementById('shiftBtn').classList.toggle('shift-active');

  // Toggle visibility of shift functions
  document.querySelectorAll('.shift-function').forEach((btn) => {
    const normalFunc = btn.getAttribute('data-normal');
    const shiftFunc = btn.getAttribute('data-shift');
    if (isShiftMode) {
      btn.setAttribute('onclick', `addFunction('${shiftFunc}')`);
    } else {
      btn.setAttribute('onclick', `addFunction('${normalFunc}')`);
    }
  });
}

function clearDisplay() {
  display.value = '';
  expressionDisplay.value = '';
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function toggleSign() {
  if (display.value !== '') {
    if (display.value.startsWith('-')) {
      display.value = display.value.slice(1);
    } else {
      display.value = '-' + display.value;
    }
  }
}

// Memory functions
function memoryStore() {
  if (display.value) {
    memory = parseFloat(display.value);
    updateMemoryDisplay();
  }
}

function memoryRecall() {
  display.value += memory;
}

function memoryAdd() {
  if (display.value) {
    memory += parseFloat(display.value);
    updateMemoryDisplay();
  }
}

function memoryClear() {
  memory = 0;
  updateMemoryDisplay();
}

function updateMemoryDisplay() {
  memoryDisplay.textContent = memory !== 0 ? `M = ${memory}` : '';
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function calculate() {
  try {
    let expression = display.value;
    expressionDisplay.value = expression;

    // Convert to radians if in degree mode
    if (angleModeToggle.checked) {
      expression = expression.replace(
        /sin\((.*?)\)/g,
        'sin($1 * Math.PI / 180)'
      );
      expression = expression.replace(
        /cos\((.*?)\)/g,
        'cos($1 * Math.PI / 180)'
      );
      expression = expression.replace(
        /tan\((.*?)\)/g,
        'tan($1 * Math.PI / 180)'
      );
    }

    // Replace mathematical expressions
    expression = expression
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/asin/g, 'Math.asin')
      .replace(/acos/g, 'Math.acos')
      .replace(/atan/g, 'Math.atan')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/cbrt\(/g, 'Math.cbrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/10\^/g, '10**')
      .replace(/\^/g, '**')
      .replace(/fact\((.*?)\)/g, (match, num) =>
        factorial(parseFloat(eval(num)))
      );

    let result = eval(expression);

    if (isNaN(result) || !isFinite(result)) {
      display.value = 'Error';
    } else {
      display.value = Number(result.toFixed(8)).toString();
    }
  } catch (error) {
    display.value = 'Error';
  }
}

// Keyboard support
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (
    (key >= '0' && key <= '9') ||
    key === '.' ||
    key === '+' ||
    key === '-' ||
    key === '*' ||
    key === '/' ||
    key === '(' ||
    key === ')'
  ) {
    addToDisplay(key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === 'Escape') {
    clearDisplay();
  }
});
