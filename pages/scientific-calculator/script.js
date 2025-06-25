let history = [];

function displayHistory() {
  const historyList = document.getElementById('history');
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function appendToDisplay(value) {
  document.getElementById('display').value += value;
}

function clearDisplay() {
  document.getElementById('display').value = '';
}

function calculate() {
  let display = document.getElementById('display');
  let expression = display.value.trim();

  if (!expression) {
    display.value = '';
    return;
  }

  const displayForHistory = expression;
  expression = expression.replace(/÷/g, '/').replace(/×/g, '*');

  try {
    if (/[^0-9+\-*/().]/.test(expression)) {
      throw new Error('無効な式です');
    }

    const result = eval(expression);

    if (result === undefined || result === null || isNaN(result)) {
      throw new Error('無効な式です');
    }

    display.value = result;

    history.push(`${displayForHistory} = ${result}`);
    displayHistory();
  } catch (e) {
    display.value = 'エラー';
    console.error(e);
  }
}
